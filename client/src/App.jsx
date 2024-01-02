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

  const [fetchedReserveList, setFetchedReserveList] = useState([
    {CustomerID: 1,
      ReserveID: 1,
      FName:'Peter',
      Phone:'0723144212',
      Email:'sdfa@gmail.com',
      Date:'31/12/2023',
      Time: '09:30',
      People: 2,
      tableNumber: 1,
      Note: '',
      Deposit: 200000,
      TimeSlot: 2},

      {CustomerID: 1,
        ReserveID: 1,
        FName:'Peter',
        Phone:'0723144212',
        Email:'sdfa@gmail.com',
        Date:'31/12/2023',
        Time: '09:30',
        People: 2,
        tableNumber: 3,
        Note: '',
        Deposit: 200000,
        TimeSlot: 2},

      {CustomerID: 1,
        ReserveID: 2,
        FName:'Peter',
        Phone:'0723144212',
        Email:'sdfa@gmail.com',
        Date:'31/12/2023',
        Time: '11:00',
        People: 2,
        tableNumber: 1,
        Note: '',
        Deposit: 200000,
        TimeSlot: 5},

    {CustomerID: 2,
      ReserveID: 2,
      FName:'David',
      Phone:'0912144212',
      Email:'gvc@gmail.com',
      Date:'03/01/2024',
      Time: '10:00',
      People: 3,
      tableNumber: 1,
      Note: '',
      Deposit: 300000,
      TimeSlot: 3},
  ])

  const addReserveRecord = (value) => {
    setFetchedReserveList((prevList) => [...prevList, value]);
  }

  useEffect(()=>{
    console.log("FRL",fetchedReserveList)
  }, [fetchedReserveList])

  const [fetchedReviewList, setFetchedReviewList] = useState([
    {reviewDate: new Date(2023, 1, 1),
      reviewName: "Peter",
      reviewDetail: "Food delicious",
      reviewRating: 4.5}, 

    {reviewDate: new Date(2023, 1, 5),
      reviewName: "David",
      reviewDetail: "Food OK",
      reviewRating: 4.0}
  ])

  const addReviewRecord = (value) => {
    setFetchedReviewList((prevList) => [...prevList, value]);
  }

  return (
    <Router>
      <div className="App">
        <NavBar />
        <div className="content">
          <Routes>
            <Route exact path="/" element={<Home data={dummyData} />} />
            <Route path="/History" element={<History />} />
            <Route path="/Schedule/:restaurant_id" element={<Schedule fetchedReserveList={fetchedReserveList} fetchedReviewList={fetchedReviewList} addReserveRecord={addReserveRecord} addReviewRecord={addReviewRecord}/>} />
            <Route path="/APIsExample" element={<APIsExample />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
