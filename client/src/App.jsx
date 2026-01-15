import { use, useState, useEffect } from 'react'
import './App.css'

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/esm/Nav'
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import SavedNotes from "./pages/SavedNotes.jsx";
import NoteDetail from "./pages/NoteDetails.jsx";
import { Link } from "react-router-dom";

function App() {

  const [userId, setUserId] = useState(null);

  //ask server "who is currently logged in?"
  async function refreshSession(){
    //send a request to /api/whoami
    //credentials ensure session cookie is sent
    const res = await fetch("/api/whoami", {credentials: "include"});
    //parse the JSON response
    const data = await res.json();
    //if server returns userId, store it in React state
    //else store null (logged out)
    setUserId(data.userId || null);
  }

  //runs things outside rendering
  //this effect runs once when the component mounts
  useEffect(function(){
    //ask the server if user session already exists
    refreshSession();
  }, []);


  useEffect(function(){
    async function run(){
      const res = await fetch("/api/whoami", { credentials: "include"});
      const data = await res.json();
      setUserId(data.userId || null)
    }

    run();
  }, []);


 

  return (
    <div className='appShell'>
      

      <Navbar  variant="dark" expand="md" className="navlayout" fixed="top">
        <Container>
          <Navbar.Brand as={Link} to="/"> Shortly!</Navbar.Brand>
          <Nav className="ms-auto flex-row navlinks">
            <Nav.Link as={Link} to="/">Home |</Nav.Link>     
            <Nav.Link as={Link} to="/saved">Saved Notes |</Nav.Link>

            {userId ? (
              <Nav.Link heref="#"
              onClick={async function(event){
                event.preventDefault();
                await fetch("/api/auth/logout", {
                  method: "POST",
                  credentials: "include"
                });
                setUserId(null);
              }}> Logout </Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/login"> Login</Nav.Link>
            )}

          </Nav>
        </Container>
      </Navbar>
  
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/saved" element={<SavedNotes/>} />
        <Route path="/login" element={<Login onAuth={refreshSession}/>} />
        <Route path="/register" element={<Register onAuth={refreshSession}/>} />
        <Route path="/saved/:id" element={<NoteDetail />} />
      </Routes>


    



    </div>
  );
}

export default App
