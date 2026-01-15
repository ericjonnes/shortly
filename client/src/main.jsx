
import './index.css'
import App from './App.jsx'
//bootstrap style
import 'bootstrap/dist/css/bootstrap.min.css';
//allows routing (/login)
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import React from "react";



ReactDOM.createRoot(document.getElementById("root")).render(
  //BrowserRouter wraps the app so <Link> and <Routes> work
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
