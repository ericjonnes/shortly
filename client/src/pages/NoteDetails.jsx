import { useEffect, useState } from "react";
import { useParams, Link} from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function NoteDetail(){
    const params = useParams();
    const[note, setNote] = useState(null);
    const [error, setError] = useState("");

    async function loadNote(){
        setError("");

        const res = await fetch("/api/notes/" + params.id, {
            credentials: "include",
        });

        const data = await res.json();

        if(!res.ok){
            setError(data.error || "Failed to load note");
            return;
        }

        setNote(data);

    }

    useEffect(function () {
        loadNote();
    }, [params.id])

    return(
        <main className="content">
            <section className="panelCard">
                <div style={{ marginBottom: "12px" }}>
                    <Link to="/saved">Back to Saved Notes</Link>
                </div>

                {error && <p style={{ color: "red"}}>{error}</p>}

                {!error && !note && <p>Loading...</p>}

                {note && (
                    <>
                    <div className="label">{note.title}</div>

                    <div className="summaryText" style={{ marginTop: "12px" }}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {note.summary}
                        </ReactMarkdown>
                    </div>
                    </>
                )}
            </section>
        </main>
    )
}