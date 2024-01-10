import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home, History, Schedule, APIsExample, Login } from "./Pages";
import { NavBar } from "./Components";
import "./App.css";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [hasLogin, setHasLogin] = useState(false);
  return (
    <Router>
      <div className="App">
        <NavBar hasLogin={hasLogin}/>
        <div className="content">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/History" element={<History />} />
            <Route path="/Schedule/:restaurant_id" element={<Schedule/>} />
            <Route path="/APIsExample" element={<APIsExample />} />
            <Route exact path="/Login" element={<Login isLogin={isLogin} setIsLogin={setIsLogin}/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
