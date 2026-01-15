//loads environment variables from server/.env
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

console.log("DATABASE_URL exists?", !!process.env.DATABASE_URL);
//express server setup
const express = require('express');

//session middleware
const session = require("express-session");
//postgres session store
const pgSession = require("connect-pg-simple")(session);
//database pool
const { pool } = require("./db/index.js")

const app = express();
//parse JSON request bodies
app.use(express.json())


app.use(
    session({
        //where session data lives
        store: new pgSession({
            pool: pool,
            tableName: "session",
            createTableIfMissing: true,
        }),
        //makes sure cookies aren't tampered with
        secret: process.env.SESSION_SECRET,
        //dont rewrite session if nothing chaged
        resave: false,
        //don't create sessions for users who never log in
        saveUninitialized: false,
        cookie: {
            //JS cannot read cookies
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            //cookies expire after 7 days
            maxAge: 7 * 24 * 60 * 60 * 1000,
        },
    })
)

const { dbHealthCheck } = require("./db/index.js")




//openai setup
const OpenAI = require("openai").default;
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});


//summarize funtion
async function summarizeText(text){
    let bulletCount;

    const wordCount = text.trim().split(/\s+/).length;

    //compute target bullet count
    if(wordCount <= 500){
        bulletCount = 11;
    }
    else if(wordCount <= 1000){
        bulletCount = 18;
    }
    else{
        bulletCount = 25;
    }

    //build instructions and include text
    const instructions = `Summarize into two sections: Key Ideas and Important Dates/Formulas/Deadlines. 
    
    Key Ideas: 
    • Use fancy bullet points (•) and limit up to ${bulletCount} bullets in total. The point is to reduce the text while keeping all main ideas.
    • Keep bullets short (max ~15 words).

    Important Dates/Formulas/Deadlines:
    • Use fancy bullet points (•)
    • If no important dates, formulas, deadlines are found, write "None found."

    Text to summarize:
    ${text}
    `;

    //call openai and return a string
    try{
        const response = await openai.responses.create({
            model: "gpt-4.1-mini",
            input: instructions
        });

        return response.output_text;
    }
    catch(error){
        throw error;
    }
}


app.get("/health", function(req,res){
    res.json({status: "ok"});
});



app.post("/api/notes", async function(req, res){

    //blcokes unathenticated users
    if(!req.session.userId){
        return res.status(401).json({ error: "Login required."});
    }

    const title = (req.body.title || "").trim();
    const text = (req.body.text || "").trim();
    const summary = (req.body.summary || "").trim();

    if(!title || !text){
        return res.status(400).json({error: "Title and Text are required"});
    }

    if(!req.session || !req.session.userId){
        return res.status(401).json({ error: "Login required to save."})
    }

    //save notes tied to loggin-in user
    const r = await pool.query(
        `INSERT INTO notes(user_id, title, original_text, summary)
        VALUES ($1, $2, $3, $4)
        RETURNING note_id, title, summary, created_at`,
        [req.session.userId, title, text, summary]
    );

    res.status(201).json(r.rows[0]);
});


// History of ALL notes (id, title, createdAt, textPreview)
app.get("/api/notes", async function(req,res){

    if(!req.session || !req.session.userId){
        return res.status(401).json({ error: "Login required to view saved notes"});
    }

    const r = await pool.query(
        `SELECT note_id, title, summary, created_at
        FROM notes
        WHERE user_id = $1
        ORDER BY created_at DESC`,
        [req.session.userId]
    );

    const result = r.rows.map(function(n){
        return{
            note_id: n.note_id,
            title: n.title,
            created_at: n.created_at,
            preview: n.summary.length > 80 ? n.summary.slice(0,80) + "..." : n.summary,
            summary: n.summary,
        };
    });
    res.json(result);
});

app.get("/api/notes/:id", async function(req,res){

    if(!req.session | !req.session.userId){
        return res.status(401).json({ error: "Login required"});
    }
    //red.params.id gets the :id from the url
    const id = Number(req.params.id);

    if(!Number.isFinite(id)){
        return res.status(400).json({ error: "Invalid note id" });
    }

    const r = await pool.query(
        `SELECT note_id, title, summary, created_at
        FROM notes
        WHERE note_id = $1 AND user_id = $2`,
        [id, req.session.userId]
    );

    if(r.rows.length === 0){
        return res.status(404).json({ error: "Note not found"});
    }
   

    res.json(r.rows[0]);
});

//summarizer for non-logged in users
app.post("/api/summarize", async function (req,res){
    const title = (req.body.title || "").trim();
    const text = (req.body.text || "").trim();

    if(!title || !text){
        return res.status(400).json({ error: "Title and Text are required"});
    }

    try{
        const summary = await summarizeText(text);
        //return just summary (public)
        return res.json({ summary: summary });
    }
    catch(error){
        console.error("OpenAi error:", error);
        return res.status(500).json({ error: "Summary unavailable", detail: error.message});
    }
});

app.get("/api/whoami", function(req,res){
    //responds with jSON describing current session state
    res.json({
        //!! converts value into true/false boolean
        //req.session is created by express-session middleware
        hasSession: !!req.session,

        //if user exist in session, convert it to a Number
        //sometimes values are stored as strings
        userId: req.session.userId ? Number(req.session.userId) : null,
    });
});

app.get("/api/saved/:id", async function (req,res){
    
    //if not logged in cannot view saved notes
    if(!req.session || !req.session.userId){
        return res.status(401).json({ error: "Login required."});
    }

    //convert the URL parameter into a Number
    const noteId = Number(req.params.id);
    //if conversion fails, return 400 Bad Request
    if(!Number.isFinite(noteId)){
        return res.status(400).json({ error: "Invalid note id"});
    }

    //query note that belongs to this user only
    const r = await pool.query(
        `SELECT note_id, title, summary, created_at
        FROM notes
        WHERE note_id = $1 AND user_id = $2`,
        [noteId, req.session.userId]
    );

    //if nothing is returned, either note doesn't exist or isn't theirs
    if(r.rows.length === 0) {
        return res.status(404).json({ error: "Note not found"});
    }

    //return the note object
    res.json(r.rows[0]);
});



dbHealthCheck()
.then((r) => console.log("DB OK:", r))
.catch((event) => console.error("DB FAIL: ", event))

const authRouter = require("./routes/auth.js");
console.log("authRouter type:", typeof authRouter);
app.use("/api/auth", authRouter);


app.listen(3000, function(){
    console.log("Server running on port 3000")
});


