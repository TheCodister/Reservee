import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home, History, Schedule, APIsExample, Login } from "./Pages";
import { NavBar } from "./Components";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <div className="content">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/History" element={<History />} />
            <Route path="/Schedule/:restaurant_id" element={<Schedule/>} />
            <Route path="/APIsExample" element={<APIsExample />} />
            <Route exact path="/Login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
