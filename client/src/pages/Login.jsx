import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";


export default function Login(props){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(event){
        event.preventDefault();
        setError("");

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({ email: email, password: password }),
        });

        const data = await res.json();

        if(!res.ok){
            setError(data.error || "Login failed");
            return;
        }

        //check if parent component passed an onAuth function as a prop
        if(props.onAuth){
            //call the function and wait for it to finish
            
            await props.onAuth();
        }

        navigate("/");
    }

    return (


        <main className="content">
            <section className="panelCard">
                <div className="space">

                    

                    <div className="label">Login</div>

                    <form onSubmit={handleSubmit}>

                        <div className="space"></div>
                        
                        <div className="small_label">
                            Enter email:
                        </div>
                        <input className="input"
                        placeholder="Email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        />


                        <div className="space"></div>

                        <div className="small_label">
                            Enter password:
                        </div>
                        <input className="input"
                        placeholder="Password"
                        value={password}
                        type="password"
                        onChange={(event) => setPassword(event.target.value)}
                        />

                        <div className=" space actions buttonstyling" >
                            <button type="submit" 
                            style={{background: "green"}} 
                            className="roundbutton"
                            >Login</button>
                        </div>
                        <p style={{textAlign: "center", fontFamily: "cursive"}}>Dont have an account?</p>
                        <p style={{textAlign: "center", fontFamily: "cursive"}}>
                            <Link to="/register">Sign up!</Link>
                        </p>
                    </form>

                    {error && <p style={{color: "red"}}>error</p>}
                </div>
            </section>
        </main>
    )


}