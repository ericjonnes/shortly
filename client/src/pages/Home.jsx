import { use, useState } from 'react'
import '../App.css'
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/esm/Nav'

export default function Home(){

const [title, setTitle] = useState("");
const [notes, setNotes] = useState("");
const [summary, setSummary] = useState("");
const [loading, setLoading] = useState(false);
const [saveMessage, setSaveMessage] = useState("");
const [error, setError] = useState("");


async function handleSave() {
  setSaveMessage("");

  const response = await fetch("/api/notes",{
    method: "POST",
    headers: { "Content-Type": "application/json"},
    credentials: "include",
    body: JSON.stringify({
      title: title,
      text: notes,
      summary: summary,
    }),
  });

  const data = await response.json();

  

  if(!response.ok){
    setSaveMessage(data.error || "Login required to save notes")
    return;
  }

  setSaveMessage("Saved! Note IDL " + (data.note_id || ""));
}


  function handleClear(){
    setTitle("");
    setNotes("");
    setSummary("");
    setError("");
  }

  async function handleSummarize(){
    if(title.trim().length === 0){
      setError("Title is required");
      return;
    }

    if(notes.trim().length === 0){ 
      setError("Notes are required");
      return;
    }

    {/*Start loading and clear previous errors*/}
    setError("");
    setLoading(true);

    try{
      {/*Send request to backend*/}
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        //session cookies
        credentials: "include",
        body: JSON.stringify({
          title: title,
          text: notes,
        }),
      });

      const data = await response.json();

      {/* If response not ok, set error*/}
      if(!response.ok){
        setError(data.error || "An error occurred");
        return;
      }

      {/* Set summary from resposne*/}
      setSummary(data.summary);

    } catch (error){
      setError("Network error. Try again later.");
    }
    finally {
      {/*Stop loading*/}
      setLoading(false);
    }

  }

  return (
    <div className='appShell'>
  


      <main className="content">
        {/* Top */}
        <section className="panelCard">
          <div className="space">
            <div className="label">Title:</div>
            <input type="text" placeholder="Enter Title..."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="input">
            </input>

            <div className="label">Notes:</div>
            <textarea placholder="Enter Notes..." value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="textarea"></textarea>

            <div className="actions buttonstyling">
              <button onClick={handleSummarize} disabled={loading}
              style={{background: loading ? "gray" : "green"}}
              className="roundbutton">
                {loading ? "Summarizing.." : "Summarize"}
              </button>

              <button onClick={handleClear} disabled={loading}
              style={{background: loading ? "lightgray" : "red"}}
              className="roundbutton">
                Clear
              </button>
            </div>

            {error && <p style={{color: "red"}}>{error}</p>}
          </div>
        </section>

        {/* Bottom */}
        <section className="panelCard">
          <div className="space">
            <div className="label">Summary:</div>
            <div className="summaryText">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {summary || "_Your summary will appear here._"}
              </ReactMarkdown>
            </div>

            {summary && (
              <div className="actions buttonstyling">
                <button 
                type="button"
                onClick={handleSave}
                style={{ background: "blue"}}
                className="roundbutton">
                  Save
                </button>

              </div>
            )}

            {saveMessage && <p style={{ textAlign: "center" }}>{saveMessage}</p>}
          </div>
        </section>
      </main>


      



    </div>
  )


}


