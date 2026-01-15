import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";

export default function Register(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(event){
        event.preventDefault();
        setError("");

        const res = await fetch("/api/auth/register", {
            method: "POST", //send data to server
            headers: { "Content-Type": "application/json"}, //tells server JSON is coming
            credentials: "include", //cookie session
            body: JSON.stringify({ //convert JS object to JSON string
                firstName: firstName,
                lastName: lastName,
                email: email, 
                password: password, }),
        });

        const data = await res.json();
        if(!res.ok){
            setError(data.error || "Registration failed");
            return;
        }

        navigate("/")
            
    }

    return(
        <main className="content">
            <section className="panelCard">
                <div className="space">

                    <div className="label">Register:</div>

                    <form onSubmit={handleSubmit}>

                        <div className="space"></div>

                        
                        <div className="nameRow">

                            <div className="field">
                                <div className="small_label">First Name:</div>
                                <input className="input"
                                placeholder="Enter first name..."
                                value={firstName}
                                onChange={(event) => setFirstName(event.target.value)}
                                />
                            </div>

                            

                            <div className="field">
                                <div className="small_label">Last Name:</div>
                                <input className="input"
                                placeholder="Enter last name..."
                                value={lastName}
                                onChange={(event) => setLastName(event.target.value)}
                                />
                            </div>
                            
                        </div>

                        <div className="space"></div>

                        <div className="small_label">Email:</div>
                        <input className="input"
                        placeholder="Enter email..."
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        />

                        <div className="space"></div>

                        <div className="small_label">Password:</div>
                        <input className="input"
                        type="password"
                        placeholder="Enter password (8+ chars)..."
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        />

                        <div className=" space actions buttonstyling">
                            <button type="submit"
                            style={{background: "green"}}
                            className="roundbutton">Create Account</button>
                        </div>

                        <p style={{fontFamily:"cursive", textAlign:"center"}}>Already have an account?</p>
                        <p style={{fontFamily:"cursive", textAlign:"center"}}>
                            <Link to="/login">Log-in!</Link>
                        </p>
                    </form>

                    {error && <p style={{ color: "red" }}>{error}</p>}
                </div>
            </section>
        </main>
    )
}


    
