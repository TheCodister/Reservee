import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home, History, Schedule, APIsExample } from "./Pages";
import { NavBar } from "./Components";
import "./App.css";

function App() {
  const [dummyData] = useState([
    {
      id: 1,
      name: "Ratatouile",
      des: "Finest dining experience, with luxurious space and European cuisine. Our chef have a 20 years experience and used to work in Michelin star’s restaurant so you can ensure the quality and quantity of our product.",
      link: `/Schedule/1`,
      totalTable: 10,
      totalRemain: 5,
    },
    {
      id: 2,
      name: "Phở Hậu",
      des: "Finest dining experience, with luxurious space and European cuisine. Our chef have a 20 years experience and used to work in Michelin star’s restaurant so you can ensure the quality and quantity of our product.",
      link: `/Schedule/2`,
      totalTable: 10,
      totalRemain: 5,
    },
    {
      id: 3,
      name: "Cơm Tấm Xà Bì Chưởng",
      des: "Finest dining experience, with luxurious space and European cuisine. Our chef have a 20 years experience and used to work in Michelin star’s restaurant so you can ensure the quality and quantity of our product.",
      link: `/Schedule/3`,
      totalTable: 10,
      totalRemain: 5,
    },
    {
      id: 4,
      name: "Gà Rán KFC",
      des: "Finest dining experience, with luxurious space and European cuisine. Our chef have a 20 years experience and used to work in Michelin star’s restaurant so you can ensure the quality and quantity of our product.",
      link: `/Schedule/4`,
      totalTable: 10,
      totalRemain: 5,
    },
    {
      id: 5,
      name: "Bún Đậu nước mắm",
      des: "Finest dining experience, with luxurious space and European cuisine. Our chef have a 20 years experience and used to work in Michelin star’s restaurant so you can ensure the quality and quantity of our product.",
      link: `/Schedule/5`,
      totalTable: 10,
      totalRemain: 5,
    },
    {
      id: 6,
      name: "Cơm chay",
      des: "Finest dining experience, with luxurious space and European cuisine. Our chef have a 20 years experience and used to work in Michelin star’s restaurant so you can ensure the quality and quantity of our product.",
      link: `/Schedule/6`,
      totalTable: 10,
      totalRemain: 5,
    },
  ]);


  return (
    <Router>
      <div className="App">
        <NavBar />
        <div className="content">
          <Routes>
            <Route exact path="/" element={<Home data={dummyData} />} />
            <Route path="/History" element={<History />} />
            <Route path="/Schedule/:restaurant_id" element={<Schedule/>} />
            <Route path="/APIsExample" element={<APIsExample />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
