import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

export default function SavedNotes(){

    //array of notes from server
    const [notes, setNotes] = useState([]);
    //error to show if loading fails
    const [error, setError] = useState("");

    async function loadNotes(){
        try{
            //fetch saved notes from backend
            const response = await fetch("/api/notes", {
                //send session cookies
                credentials:"include",
            })

            const data = await response.json();

            //if server responsed with error code, show error
            if(!response.ok) {
                setError(data.error || "Failed to load notes");
                return;
            }

            //save notes into react state
            setNotes(data);
        }
        catch(error){
            setError("Network error while loading notes")
        }
    }

    //run loadNotes() one time when component loads
    useEffect(function(){
        loadNotes();
    }, []);
    

    return (
        <main className="content">
            <section className="panelCard">
                <div className="space">

                    <div className="label">Saved Notes:</div>

                    {error && <p style={{ color: "red" }}>{error}</p>}

                    {notes.length === 0 && !error && (
                        <p>No saved notes yet!</p>
                    )}

                    {notes.map(function (note){
                        return (
                            
                            <div key= {note.note_id || note.id}
                            style={{ padding: "12px", borderBottom: "1px solid #ddd",

                            }}>
                            <div style={{ fontWeight: "800" }}>
                                <Link to={"/saved/" + note.note_id}>{note.title}</Link>
                            </div>

                            <div style={{ opacity: 0.85 }}>
                                {note.preview || note.textPreview}
                            </div>

                            </div>
                                
                        );
                    })}
                </div>
            </section>
        </main>
    )
}