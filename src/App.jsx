import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { NavBar } from "./Components";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <div className="App">
        <NavBar />
      </div>
    </Router>
  );
}

export default App;
