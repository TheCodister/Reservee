import "./History.css";
import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";

const History = () => {
  const [tableHistory, setTableHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const reservationsPerPage = 5;

  useEffect(() => {
    fetch("/api/history")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setTableHistory(data))
      .catch((error) => console.error("Error fetching history:", error));
  }, []);

  const fetchReservationDetails = async (reservationId) => {
    try {
      const response = await fetch(`/api/history/${reservationId}`);
      if (!response.ok) {
        throw new Error(`Error fetching reservation details: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching reservation details");
    }
  };

  const fetchAndShowDetails = async (reservationId) => {
    try {
      const details = await fetchReservationDetails(reservationId);
      console.log("Reservation Details:", details);
      // Here, you can update the state or display the details as needed
    } catch (error) {
      console.error("Error fetching reservation details:", error);
    }
  };

  const filteredReservations = tableHistory.filter((reservation) => {
    if (!startDate && !endDate) return true;

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
    setCurrentPage(1);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setCurrentPage(1);
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
            <th>Time</th>
            <th>Seat Number</th>
            <th>Full Name</th>
            <th>Phone Number</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {currentReservations.map((reservation) => (
            <tr
              key={reservation.id}
              onClick={() => fetchAndShowDetails(reservation.id)}
            >
              <td>{reservation.date}</td>
              <td>{reservation.time}</td>
              <td>{reservation.seat_number}</td>
              <td>{reservation.full_name}</td>
              <td>{reservation.phone_number}</td>
              <td>{reservation.email}</td>
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
