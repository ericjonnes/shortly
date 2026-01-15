// express router that lets me group auth-related routes
const express = require("express");
//hashes passwords
const bcrypt = require("bcrypt");
//import database pool to run the SQL queries
const { pool } = require("../db/index.js");

const router = express.Router();

router.post("/me", async function(req, res){

    if(!req.session.userId) {
        return res.json({ user: null });
    }

    //fetch user info from DB using userId
    const r = await pool.query(
        "SELECT user_id, email FROM users WHERE user_id = $1",
        [req.session.userId]
    );

    //if user is not found, treat as logged out
    if(r.rows.length === 0){
        return res.json({ user: null});
    }

    return res.json({ user: r.rows[0] });


})


//register
router.post("/register", async function(req,res){
    //normalize input
    const email = (req.body.email || "") .trim().toLowerCase();
    const password = req.body.password || "";
    const firstName = (req.body.firstName || "").trim();
    const lastName = (req.body.lastName || "").trim();

    //validation
    if(!email.includes("@") || password.length < 8){
        return res.status(400).json({ error: "Use a valid email and 8+ character password."});
    }
    if(!firstName || !lastName){
        return res.status(400).json({ error: "First and last name required."})
    }

    try{
        //hash password
        const passwordHash = await bcrypt.hash(password,10);

        //insert new user into database
        //return gives us new user id immediately
        const r = await pool.query(
            "INSERT INTO users(email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING user_id, email",
            [email,passwordHash, firstName, lastName]
        );

        //save user id into session so they are logged in
        req.session.userId = r.rows[0].user_id;

        //return user object
        return res.status(201).json({ user: r.rows[0] });
    }
    catch(error){
        //23505 = UNIQUE constraint violation
        if(error.code === "23505"){
            return res.status(409).json({ error: "Email already registered." });
        }

        console.error("REGISTER ERROR:", error);
        return res.status(500).json({ error: "Server error"});
    }
});

//login
router.post("/login", async function(req, res){
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password || "";

    //look up user by email
    const r = await pool.query(
        "SELECT user_id, email, password_hash FROM users WHERE email = $1",
        [email]
    );

    //if user not found, credentials are invalid
    if(r.rows.length === 0) {
        return res.status(401).json({ error: "Invalid credentials"});
    }

    const user = r.rows[0];

    //compare input password and stored hash
    const ok = await bcrypt.compare(password, user.password_hash);
    if(!ok) {
        return res.status(401).json({ error: "Invalid credentials"});
    }

    //store user ID in session (login success!)
    req.session.userId = user.user_id;

    //return user info
    return res.json({
        user: {user_id: user.user_id, email: user.email }
    });
});

//logout 
router.post("/logout", function(req,res){
    //remove user session
    req.session.destroy( function(error){
        if(error){
            return res.status(500).json({ error: "Lougout failed"})
        }
        res.clearCookie("connect.sid");
        res.json({ ok: true});
    });
});

module.exports = router;