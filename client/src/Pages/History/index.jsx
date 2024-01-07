import "./History.css";
import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

const History = () => {
  const [tableHistory, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const reservationsPerPage = 5;

  useEffect(() => {
    // Fetch history on component mount
    axios.get('http://localhost:3000/reservation')
      .then(response => {
        setHistory(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []); // Empty dependency array means this effect runs once after the initial render

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

  return (
    <div className="history">
      <div className="history-title">
        <h2>History</h2>
      </div>
      <div className="date-range-container">
        <label htmlFor="startDate">Start Date: </label>
        <input
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
            <th>Status</th>
            <th>Full Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {currentReservations.map((reservation) => (
            <tr key={reservation.id}>
              <td>{reservation.date}</td>
              <td>{reservation.timeslots}</td>
              <td>{reservation.people}</td>
              <td>{reservation.status}</td>
              <td>{reservation.fullname}</td>
              <td>{reservation.phonenumber}</td>
              <td>{reservation.email}</td>
              <td>{reservation.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
