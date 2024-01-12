import "./History.css";
import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import Button from '@mui/material/Button';
import { Rating } from "@mui/material";
import { FormModal, AlertDialog } from "../../Components";
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
// import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
// import { IconButton, Rating } from "@mui/material";
// import ReviewPopup from "./ReviewPopup";


const History = ({ customerID }) => {
  
  const [tableHistory, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reviewData, setReviewData] = useState([]);
  const [comment, setComment] = useState("");
  const [star, setStar] = useState(5)
  const [openModifyFormModal, setOpenModifyFormModal] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [canReview, setCanReview] = useState(false)
  const [open, setOpen] = React.useState(false);
  const reservationsPerPage = 5;
  

  useEffect(() => {
    axios.get('http://localhost:3000/reservations')
      .then(response => {
        setHistory(response.data);
        // console.log(response.data);

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
    const reservationDate = new Date(reservation.date).getTime();
    // Split the date string into day, month, and year
    const [day, month, year] = reservation.date.split("-");

    // Create a new Date object with the time set to midnight and the time zone offset
    const convertedDate = new Date(`${year}-${month}-${day}T07:00:00+07:00`);

    const startTimestamp = startDate ? new Date(startDate) : 0;
    const endTimestamp = endDate ? new Date(endDate) : Infinity;

    const isWithinDateRange =
      (!startDate && !endDate) ||
      (convertedDate >= startTimestamp && convertedDate <= endTimestamp);
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


  const handleCloseReviewForm = () => {
    setIsReviewFormOpen(false);
    setSelectedReservation(null);
  };

  const getStarsForReservation = (customerResId, reservationID) => {
    const reviewsForCustomer = reviewData[customerResId] || [];
    const matchingReview = reviewsForCustomer.find((review) => review.reservation_id === reservationID);
    
    if (matchingReview && matchingReview.stars !== -1) {
      return matchingReview.stars;
    } else {
      return -1;
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
  
      // const stars = getStarsForReservation(customer_id, selectedReservation.id);
  
      const commentData = {
        reservation_id: reservation_id,
        stars: star,
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

  // handle reserve confirm modal 
  const handleConfirmModal = async () => {
    const newFormData = {
      ...formData,
      TimeSlot: timeSlots.findIndex((slot) => slot.start === formData.Time) + 1,
    };

    try {
      // Send a POST request to add a new reserve
      const response = await fetch('http://localhost:3000/reservations/reserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customer_id: getCookie('userID'), restaurant_id: restaurant_id, date: newFormData.Date,
                                time: newFormData.Time, timeslot: newFormData.TimeSlot, fname: newFormData.FName , email: newFormData.Email,
                                phone_number: newFormData.Phone, number_of_seats: newFormData.People, note: newFormData.Note }),
      });

      if (response.ok) {
        console.log('Reservation added successfully!');
      } else {
        console.error('Failed to add Reservation:', response.status);
      }
    } catch (error) {
      console.error('Error adding Reservation:', error.message);
    }
    fetchResReserveList();
    setIsModalOpen(false);
  };


  const handleRatingChange = (event, newValue) => {
    setStar(newValue)
  };


  const handleAddReviewButtonClick = (reservation) => {
    const [day, month, year] = reservation.date.split("-");
    const [hours, minutes] = reservation.time.split(':');
    
    const convertedDate = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00+07:00`);
    const currentDate = new Date(); 
    if (currentDate >= convertedDate) {
      setCanReview(true)
    }
    else {
      setCanReview(false)
    }
    setSelectedReservation(reservation);
    setIsReviewFormOpen(true);
  };

  const handleModifyReservation = (reservation) => {
    // TODO
    console.log(reservation)
    setOpenModifyFormModal(true)
  }

  const handleClose = () => {
    setOpen(false); // Close the AlertDialog
  };

  const handleDeleteConfirm = () => {
    setOpen(false); // Close the AlertDialog after confirming logout
    navigate("/Login")
  };

  const handleDeleteReservation = () => {
    // TODO
    setOpen(true);
    
  }

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
            <th>Modify</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {currentReservations
            .filter((reservation) => reservation.customer_id === parseInt(customerID))
            .map((reservation) => {
              // console.log(reservation)
              const [day, month, year] = reservation.date.split("-");
              const [hours, minutes] = reservation.time.split(':');
              
              const convertedDate = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00+07:00`);
              const currentDate = new Date(); 
              
              return (
              <tr key={reservation.id}>
                <td>{reservation.date}</td>
                <td>{reservation.time}</td>
                <td>{reservation.seat_number}</td>
                <td>{reservation.fname}</td>
                <td>{reservation.phone_number}</td>
                <td>{reservation.email}</td>
                <td>
                  <Button
                    variant="contained"
                    className="btn-add-review"
                    onClick={() => handleAddReviewButtonClick(reservation)}
                  >
                    Review
                  </Button>
                </td>
                <td>
                  <Button
                    variant="contained"
                    className="btn-add-review"
                    disabled={(convertedDate < currentDate)}
                    onClick={() => handleModifyReservation(reservation)}
                  >
                    Modify
                  </Button>
                </td>
                <td>
                  <Button
                    variant="contained"
                    className="btn-add-review"
                    disabled={(convertedDate < currentDate)}
                    onClick={() => handleDeleteReservation()}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            )})}
        </tbody>
      </table>

      {/* {openModifyFormModal && 
          <FormModal 
            onConfirm={handleConfirmModal} 
            onClose={handleCloseModal} 
            modalTitle={`Online Reservation`} 
            formData={formData}
            timeSlots={timeSlots}
            setFormData={setFormData}
            selectedDate={selectedDate}
            reserveList={resReserveList}
            restaurant={restaurant}
          />
      } */}
      <AlertDialog title={"Do you want to delete your reservation?"} description={"This action can not be undone"} open={open} handleClose={handleClose} handleConfirm={handleDeleteConfirm} />

      {isReviewFormOpen && canReview && (
        <div className="overlay">
          <div className="modal-content">
            <h2>Review for {selectedReservation.fname}</h2>
            <p>Reservation ID: {selectedReservation.id}</p>
            <p>Date: {selectedReservation.date}</p>
            <p>Time: {selectedReservation.time}</p>
            <p>Stars: {getStarsForReservation(selectedReservation.customer_id, selectedReservation.id) !== -1 ? (
              getStarsForReservation(selectedReservation.customer_id, selectedReservation.id)
            ) : (
              <Rating name="half-rating" value={star} precision={0.5} onChange={handleRatingChange}/>
            )}
            </p>
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

      {isReviewFormOpen && !canReview && (
        <div className="overlay">
          <div className="modal-content">
            <p>You need to visit the restaurant first before making review</p>
            <button className="close-modal" onClick={handleCloseReviewForm}>Close</button>
          </div>
        </div>
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
