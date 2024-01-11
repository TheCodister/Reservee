import "./History.css";
import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
// import Popup from "./Popup";

const History = ({customerID}) => {
  const [tableHistory, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reviewData, setReviewData] = useState(null);
  const reservationsPerPage = 5;

  useEffect(() => {
    axios.get('http://localhost:3000/reservations')
      .then(response => {
        setHistory(response.data);
        console.log(response.data);


        axios.get(`http://localhost:3000/ratings/${response.data[0].customer_id}`)
          .then(responsee => {
            setReviewData(responsee.data);
            console.log(responsee.data);
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const filteredReservations = tableHistory.filter((reservation) => {
    if (!startDate && !endDate) return true; // If no date range is set, show all reservations

    const reservationDate = new Date(reservation.date).getTime();
    const startTimestamp = startDate ? new Date(startDate).getTime() : 0;
    const endTimestamp = endDate ? new Date(endDate).getTime() : Infinity;

    return reservationDate >= startTimestamp && reservationDate <= endTimestamp;
  });

  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = filteredReservations.slice(
    indexOfFirstReservation,
    indexOfLastReservation
  );

  const totalPages = Math.ceil(filteredReservations.length / reservationsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setCurrentPage(1); // Reset to the first page when the date range changes
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setCurrentPage(1); // Reset to the first page when the date range changes
  };
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

  const handleRowClick = (reservation) => {
    setSelectedReservation(reservation);
    setIsReviewFormOpen(true);
  };

  const handleCloseReviewForm = () => {
    setIsReviewFormOpen(false);
    setSelectedReservation(null);
  };
  return (
    <div className="history">
      <div className="history-title">
        <h2>History</h2>
      </div>
      <div className="date-range-container">
      <label htmlFor="dateRange" style={{fontSize:'20px' ,color:"blue"}}>"You can search/view reservation(s) by typing one or more of these"</label><br/>
        <label htmlFor="startDate">Start Date: </label>
        <input

          style={{marginRight:'100px'}}
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => handleStartDateChange(e.target.value)}
        />
        <label htmlFor="endDate">End Date: </label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => handleEndDateChange(e.target.value)}
        />
      </div>
      <table>
        <thead>
        <tr>
            <th>Date</th>
            <th>Timeslots</th>
            <th>People</th>
            <th>Full Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Review</th>
          </tr>
        </thead>
        <tbody>
          {currentReservations.map((reservation) => (
            <tr key={reservation.id}
            onClick={() =>handleRowClick(reservation)} // Navigate to a route based on reservation ID
            style={{ cursor: 'pointer' }}>
              <td>{reservation.date}</td>
              <td>{reservation.time}</td>
              <td>{reservation.seat_number}</td>
              <td>{reservation.fname}</td>
              <td>{reservation.phone_number}</td>
              <td>{reservation.email}</td>
              
            </tr>
          ))}
        </tbody>
      </table>
      {isReviewFormOpen && (
        <div className="review-form">
          <button onClick={handleCloseReviewForm}>Close</button>
          <h2>Review for {selectedReservation.fname}</h2>
          <p>Reservation ID: {selectedReservation.id}</p>
          <p>Date: {selectedReservation.date}</p>
          <p>Time: {selectedReservation.time}</p>
          {reviewData ? (
          <>
            <p>Stars: {reviewData[0].stars}</p>
            <p>Comment: {reviewData[0].comment}</p>
          </>
        ) : (
          <p>No review available</p>
        )}

        </div>
      )}
      
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Prev Page
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next Page
        </button>
      </div>
    </div>
  );
};

export default History;
