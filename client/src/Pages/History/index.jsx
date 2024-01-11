import "./History.css";
import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
// import ReviewPopup from "./ReviewPopup";

const History = ({customerID}) => {
  const [tableHistory, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reviewData, setReviewData] = useState([]);
  const [comment, setComment] = useState("");
  const reservationsPerPage = 5;

  useEffect(() => {
    axios.get('http://localhost:3000/reservations')
      .then(response => {
        setHistory(response.data);
        console.log(response.data);

        response.data.forEach(reservation => {
          axios.get(`http://localhost:3000/ratings/${reservation.customer_id}`)
            .then(responsee => {
              setReviewData(prevReviewData => ({
                ...prevReviewData,
                [reservation.customer_id]: responsee.data,
              }));
              console.log(responsee.data);
            })
            .catch(error => {
              console.error(error);
            });
        });
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    // This useEffect will run whenever reviewData changes
    console.log("Review data updated:", reviewData);
  }, [reviewData]);

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

  const getStarsForReservation = (customerResId) => {
    const reviewsForCustomer = reviewData[customerResId] || [];

    if (reviewsForCustomer.length > 0) {
      const totalStars = reviewsForCustomer.reduce((acc, review) => acc + review.stars, 0);
      const averageStars = totalStars / reviewsForCustomer.length;
      return averageStars.toFixed(1); // Return average stars rounded to 1 decimal place
    } else {
      // Return a flag to indicate no stars
      return 'NoStars';
    }
  };

  const getCommentForReservation = (customerResId) => {
    const reviewsForCustomer = reviewData[customerResId] || [];

    if (reviewsForCustomer.length > 0) {
      const allComments = reviewsForCustomer.map(review => review.comment).join(', ');
      return allComments || 'NoComment';
    } else {

      return 'NoComment';
    }
  };
  const handleCommentChange = (e) => {
    setComment(e.target.value); 
  };
  const addComment = async () => {
    try {
        const { id: rating_id, reservation_id, customer_id } = selectedReservation;

        const stars = getStarsForReservation(customer_id);

        const commentData = {
            reservation_id: reservation_id,
            stars: stars,
            comment: comment,
        };

        let response;

        if (rating_id) {
            // If rating_id exists, it means there is an existing record, so make a PUT request
            response = await axios.put(`http://localhost:3000/ratings`, {
                ...commentData,
                rating_id: rating_id,
            });
        } else {
            // If rating_id does not exist, make a POST request
            response = await axios.post(`http://localhost:3000/ratings`, commentData);
        }

        console.log("Comment added/updated successfully:", response.data);
        // Handle success, maybe update the UI or show a success message
    } catch (error) {
        console.error("Error adding/updating comment:", error);
        // Handle error, show an error message or perform other actions
    }
};

  
  return (
    <div className="history">
      <div className="history-title">
        <h2>History</h2>
      </div>
      <div className="date-range-container">
        <label htmlFor="dateRange" style={{ fontSize: '20px', color: "blue" }}>"You can search/view reservation(s) by typing one or more of these"</label><br />
        <label htmlFor="startDate">Start Date: </label>
        <input

          style={{ marginRight: '100px' }}
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
          </tr>
        </thead>
        <tbody>
          {currentReservations.map((reservation) => (
            <tr key={reservation.id}
              onClick={() => handleRowClick(reservation)} // Navigate to a route based on reservation ID
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
  <div className="overlay">
    <div className="modal-content">
      <h2>Review for {selectedReservation.fname}</h2>
      <p>Reservation ID: {selectedReservation.id}</p>
      <p>Date: {selectedReservation.date}</p>
      <p>Time: {selectedReservation.time}</p>
      <p>Stars: {getStarsForReservation(selectedReservation.customer_id)}</p>
      <p>
      Comment: {getCommentForReservation(selectedReservation.customer_id) !== 'NoComment' ? (
          getCommentForReservation(selectedReservation.customer_id)
        ) : (
          <input 
          type="text" 
          placeholder="Enter your comment here"
          value={comment}
          onChange={handleCommentChange}
          />
          
        )}
        <button onClick={addComment}>Add Comment</button>
      </p>
      <button className="close-modal" onClick={handleCloseReviewForm}>Close</button>
    </div>
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
