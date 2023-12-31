import "./History.css";
import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";

const History = () => {
  const [tableHistory, setTableHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reservationsPerPage = 5;

  useEffect(() => {
    fetch("/api/history")
      .then((response) => response.json())
      .then((data) => setTableHistory(data))
      .catch((error) => console.error("Error fetching history:", error));
  }, []);
  
  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = tableHistory.slice(
    indexOfFirstReservation,
    indexOfLastReservation
  );

  const totalPages = Math.ceil(tableHistory.length / reservationsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <div className="history">
      <div className="history-title">
        <h2>History</h2>
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