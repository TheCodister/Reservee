import "./History.css";
import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import Button from '@mui/material/Button';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
// import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
// import { IconButton, Rating } from "@mui/material";
// import ReviewPopup from "./ReviewPopup";

const Notification = ({ message, onClose }) => (
  <div className="notification">
    <p>{message}</p>
    <button onClick={onClose}>Close</button>
  </div>
);

const History = ({ customerID }) => {
  
  const [tableHistory, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reviewData, setReviewData] = useState([]);
  const [comment, setComment] = useState("");
  const [notification, setNotification] = useState(null);
  const reservationsPerPage = 5;

  useEffect(() => {
    axios.get('http://localhost:3000/reservations')
      .then(response => {
        setHistory(response.data);
        //console.log(response.data);

        response.data.forEach(reservation => {
          axios.get(`http://localhost:3000/ratings/${reservation.customer_id}`)
            .then(responsee => {
              setReviewData(prevReviewData => ({
                ...prevReviewData,
                [reservation.customer_id]: responsee.data,
              }));
              // console.log(responsee.data);
            })
            .catch(error => {
              // console.error(error);
            });
        });
      })
      .catch(error => {
        // console.error(error);
      });
  }, []);

  // useEffect(() => {
  //   // This useEffect will run whenever reviewData changes
  //   console.log("Review data updated:", reviewData);
  // }, [reviewData]);

  const filteredReservations = tableHistory.filter((reservation) => {

    const isWithinDateRange =
      (!startDate && !endDate) ||
      (reservationDate >= startTimestamp && reservationDate <= endTimestamp);


    const isMatchingCustomer = reservation.customer_id === parseInt(customerID);


    return isWithinDateRange && isMatchingCustomer;
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

  // useEffect(() => {
  //   console.log('Selected Reservation 2:', selectedReservation);
  // }, [selectedReservation]);
  

  

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
      return 1;
    }
  };

  const getCommentForReservation = (customerResId, reservationID) => {
    const reviewsForCustomer = reviewData[customerResId] || [];
    const matchingReview = reviewsForCustomer.find((review) => review.reservation_id === reservationID);

    if (matchingReview && matchingReview.comment.trim() !== '') {
      return matchingReview.comment;
    } else {
      return 'NoComment';
    }
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };
  const addComment = async () => {
    try {
      //console.log("Selected Reservation:", selectedReservation);
  
      const {id: reservation_id, customer_id, rating } = selectedReservation;
      const { id: rating_id } = rating || {};
  
      const stars = getStarsForReservation(customer_id);
  
      const commentData = {
        reservation_id: reservation_id,
        stars: stars,
        comment: comment,
      };

      
  
      // console.log("Sending request with payload:", commentData);
      // console.log("ratingid0 ", rating_id);
  
      let response;
  
      if (rating_id) {
        response = await axios.put(`http://localhost:3000/ratings/`, {commentData, rating_id: rating_id});
      } else {
        response = await axios.post(`http://localhost:3000/ratings`, commentData);
      }
  
      // console.log("Comment added/updated successfully:", response.data);
      window.location.reload();
      handleCloseReviewForm();
    } catch (error) {
      // console.error("Error adding/updating comment:", error);
  
      if (error.response) {
        // console.error("Server responded with an error:", error.response.data);
      } else if (error.request) {
       // console.error("No response received from the server");
      } else {
        //console.error("Error setting up the request", error.message);
      }
  
      // Log specific error related to PUT or POST request
      if (error.config.method === "put" || error.config.method === "post") {
       // console.error(`Error in ${error.config.method.toUpperCase()} request:`, error.message);
      }
  
      handleCloseReviewForm();
    }
  };

  const handleAddReviewButtonClick = (reservation) => {
    setSelectedReservation(reservation);
    console.log(reservation);
    const hasReview = reviewData[reservation]?.length > 0;
    console.log(reviewData[reservation]);
    if (hasReview) {
      setNotification("Already has a review for this reservation");
    } else {
      setIsReviewFormOpen(true);
    }
  };

  const closeNotification = () => {
    setNotification(null);
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
            <th>Review</th>
          </tr>
        </thead>
        <tbody>
          {currentReservations
            .filter((reservation) => reservation.customer_id === parseInt(customerID))
            .map((reservation) => (
              <tr
                key={reservation.id}
                onClick={() => handleRowClick(reservation)} // Navigate to a route based on reservation ID
                style={{ cursor: 'pointer' }}
              >
                <td>{reservation.date}</td>
                <td>{reservation.time}</td>
                <td>{reservation.seat_number}</td>
                <td>{reservation.fname}</td>
                <td>{reservation.phone_number}</td>
                <td>{reservation.email}</td>
                <td><Button
                    variant="contained"
                    className="btn-add-review"
                    onClick={() => handleAddReviewButtonClick(reservation)}
                  >
                    Add Review
                  </Button></td>
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
              Comment: {getCommentForReservation(selectedReservation.customer_id, selectedReservation.id) !== 'NoComment' ? (
                getCommentForReservation(selectedReservation.customer_id, selectedReservation.id)
              ) : (
                <input
                  className="comment-input"
                  type="text"
                  placeholder="Enter your comment here"
                  value={comment}
                  onChange={handleCommentChange}
                />
              )}
              {getCommentForReservation(selectedReservation.customer_id, selectedReservation.id) === 'NoComment' && (
                <button className="add-comment-button" onClick={addComment}>Add Comment</button>
              )}
            </p>
            <button className="close-modal" onClick={handleCloseReviewForm}>Close</button>
          </div>
        </div>
      )}

      {notification && (
        <Notification message={notification} onClose={closeNotification} />
      )}


      <div className="pagination">
        <Button
          sx={{ borderRadius: "20px" }}
          variant="contained"
          // startIcon={<AddCircleOutlineIcon sx={{ color: "white"}}/>}
          onClick={handlePrevPage} disabled={currentPage === 1}
        >
          Previous Page
        </Button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <Button
          sx={{ borderRadius: "20px" }}
          variant="contained"
          onClick={handleNextPage} disabled={currentPage === totalPages}
        >
          Next Page
        </Button>
      </div>
    </div>
  );
};

export default History;
