import "./Schedule.css";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CalendarButton } from "../../Components";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { FormModal } from "../../Components";
import Button from '@mui/material/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { IconButton, Rating, TextField } from "@mui/material";


// Generate reserve table for view
const TimeTable = ({reserveList, numOfTable, timeSlots}) => {
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(timeSlots.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const startIdx = currentPage * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;

  // Generate an empty table with rows and columns
const tableData = Array.from({ length: numOfTable}, () => new Array(itemsPerPage).fill(""));
// Fill the table with data from reserveList
reserveList.forEach((reserve) => {
  if (reserve.TimeSlot >= startIdx && reserve.TimeSlot < endIdx) {
    tableData[reserve.tableNumber - 1][reserve.TimeSlot - startIdx - 1] = (
      <div>
        {reserve.FName}
        <br />
        People: {reserve.People}
      </div>
    );
  }
});

  return (
    <div className="tableWithArrow">
      <IconButton color="primary" onClick={handlePrevPage} disabled={currentPage === 0}>
        <ArrowCircleLeftIcon sx={{fontSize: "1.5em"}}/>
      </IconButton>
      <table className="reserveList">
        <thead>
          <tr>
            {timeSlots.slice(startIdx, endIdx).map((slot, index) => (
              <th className="reserveColumn" key={index}>{`${slot.start} - ${slot.end}`}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((data, colIndex) => (
                <td key={colIndex} className={data === "" ? "noData" : "reserveData"}>
                  {data}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <IconButton color="primary" onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
        <ArrowCircleRightIcon sx={{fontSize: "1.5em"}}/>
      </IconButton>
    </div>
  );
};

// Customer review component
const CustomerReview = ({reviewObject}) => {
  const formattedDate = reviewObject.reviewDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  
  const firstLetter = reviewObject.reviewName.charAt(0);

  return (
    <div className="reviewBox">
      <div className="reviewProfile">
        <p className="reviewIcon">{firstLetter}</p>
        <p className="reviewName">{reviewObject.reviewName}</p>
      </div>

      <div className="reviewContent">
        <div className="ratingAndDate">
          <Rating name="half-rating" defaultValue={reviewObject.reviewRating} precision={0.5} sx={{marginRight: "10px", width: "fit-content"}} readOnly />
          <p>Dined on {formattedDate}</p>
        </div>
        <p>{reviewObject.reviewDetail}</p>
      </div>
    </div>
  )
}

const Schedule = (props) => {
  // fetched data from db
  const {fetchedReserveList, fetchedReviewList, addReserveRecord, addReviewRecord} = props
  const { restaurant_id } = useParams();
  const [ restaurant, setRestaurant ] = useState();
  const [ resReserveList, setResReserveList ] = useState([]);
  const [ resReviewList, setResReviewList ] = useState([]);

  const fetchRestaurant = async () => {
    const url = `http://localhost:3000/restaurants/${restaurant_id}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        console.log("restaurant", data.restaurants)
        setRestaurant(data.restaurants[0]);
      } else {
        console.error('Failed to fetch restaurants:', response.status);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error.message);
    }
  };

  const fetchResReserveList = async () => {
    const url = `http://localhost:3000/reservations/restaurant/${restaurant_id}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        console.log("reservations", data.reservations)
        setResReserveList(data.reservations);
      } else {
        console.error('Failed to fetch reservations:', response.status);
      }
    } catch (error) {
      console.error('Error fetching reservations:', error.message);
    }
  };

  const fetchResReviewList = async () => {
    const url = `http://localhost:3000/ratings/restaurant/${restaurant_id}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        console.log("ratings", data)
        setResReviewList(data);
      } else {
        console.error('Failed to fetch ratings:', response.status);
      }
    } catch (error) {
      console.error('Error fetching ratings:', error.message);
    }
  };

  useEffect(() => {
    // Fetch all restaurant initially
    fetchRestaurant();
  }, []);

  useEffect(() => {
    // Fetch all reserve initially
    fetchResReserveList();
  }, []);

  useEffect(() => {
    // Fetch all review initially
    fetchResReviewList();
  }, []);

  const userName = "Peter"
  const numOfTable = 8;
  const [ restaurantName, setRestaurantName ] = useState(null);
  const [ restaurantAddress, setRestaurantAddress ] = useState(null);
  const [ cuisine, setCuisine ] = useState(null);
  const [ phoneNumber, setPhoneNumber ] = useState(null);
  const [ seatCapacity, setSeatCapaciry ] = useState(null);
  
  useEffect(() => {
    if(restaurant) {
      setRestaurantName(restaurant.name);
      setRestaurantAddress(restaurant.address);
      setCuisine(restaurant.cuisine);
      setPhoneNumber(restaurant.phone_number);
      setSeatCapaciry(restaurant.seat_capacity);
    }
  }, [restaurant]);

  const [reserveList, setReserveList] = useState(fetchedReserveList)

  const [formData, setFormData]= useState({
    CustomerID: 0,
    ReserveID: 0,
    FName:'',
    Phone:'',
    Email:'',
    Date:'',
    Time: '',
    People: 1,
    tableNumber: 1,
    Note: '',
    Deposit: 0,
    TimeSlot: 0
  })
  //end fetched data from db 


  // data for current session 

  // selected date for display corresponding table reservation
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString("en-GB")); 

  // Reservation for selected date (table view change based on this list)
  const [reservationsForSelectedDate, setReservation] = useState(reserveList.filter((formData) => formData.Date === selectedDate));

  // Other things, does not really matter
  const [isModalOpen, setIsModalOpen] = useState(false);

  const calculateOverallRating = (reviews) => {
    if (reviews.length === 0) {
      return 0; // Return 0 if there are no reviews
    }
    const totalRating = reviews.reduce((sum, review) => sum + review.reviewRating, 0);
    return totalRating / reviews.length; // Calculate average rating
  };

  const overallRating = calculateOverallRating(fetchedReviewList);


  // Create button on click
  const handleCreateButtonClick = () => {
    setIsModalOpen(true);
  };

  // Close modal -> set form data to initial value
  const handleCloseModal = () => {
    setFormData({
      CustomerID: 0,
      ReserveID: 0,
      FName:'',
      Phone:'',
      Email:'',
      Date:'',
      Time: '',
      People: 1,
      tableNumber: 1,
      Note: '',
      Deposit: 0,
      TimeSlot: 0
    });

    setIsModalOpen(false);
  };
  
  // Generate an array of time slots from 9:00 to 21:00 with 30-minute intervals
  // Format: timeSlots = [{start: "09:00", end: "9:30"}, {...}]
  const generateTimeSlots = () => {
    const startTime = new Date();
    startTime.setHours(9, 0, 0); // Set start time to 9:00

    const endTime = new Date();
    endTime.setHours(21, 0, 0); // Set end time to 21:00

    const timeSlots = [];

    while (startTime < endTime) {
      const timeSlotStart = new Date(startTime);
      const timeSlotEnd = new Date(startTime.getTime() + 30 * 60 * 1000); // 30 minutes later

      const formatTime = (date) =>
        `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

      timeSlots.push({
        start: formatTime(timeSlotStart),
        end: formatTime(timeSlotEnd),
      });

      startTime.setTime(startTime.getTime() + 30 * 60 * 1000); // Move to the next 30-minute interval
    }

    return timeSlots;
  };

  const timeSlots = generateTimeSlots();

 // On select new date to view reservation 
 const handleSelectedDate = (date) => {
  
   const formattedDate = date.toLocaleDateString("en-GB");
   setSelectedDate(formattedDate)
   setReservation(reserveList.filter((formData) => formData.Date === formattedDate))

 }
 
 // handle reserve confirm modal 
  const handleConfirmModal = async () => {
    const newFormData = {
      ...formData,
      Deposit: formData.People * 100000,
      TimeSlot: timeSlots.findIndex((slot) => slot.start === formData.Time) + 1,
    };

    const updatedReserveList = [...fetchedReserveList, newFormData];
    try {
      // Send a POST request to add a new reserve
      const response = await fetch('http://localhost:3000/reservations/reserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customer_id: formData.CustomerID, restaurant_id: restaurant_id, date: formData.Date,
                                time: formData.Time, timeslot: newFormData.TimeSlot, fname: formData.FName , email: formData.Email,
                                phone_number: formData.Phone, number_of_seats: formData.People, note: formData.Note }),
      });

      if (response.ok) {
        console.log('Reservation added successfully!');
      } else {
        console.error('Failed to add Reservation:', response.status);
      }
    } catch (error) {
      console.error('Error adding Reservation:', error.message);
    }
    setReserveList(updatedReserveList);
    addReserveRecord(newFormData);
    setIsModalOpen(false);
  };

  // Set new value for reservationsForSelectedDate whenever reserveList change
  useEffect(() => {
    setReservation(reserveList.filter((formData) => formData.Date === selectedDate))
  }, [reserveList]);


  return (
    <div className="schedule">
      <div className="headerRestaurant">
      </div>
      <div className="schedule-title">
        <h1>RESERVATION SCHEDULE</h1>
      </div>

      <div className="reservation">
        <div className="restaurantInfo">
          <h2>{restaurantName}</h2>
          <p>Address: {restaurantAddress}</p>
          <p>Main dishes: {cuisine}</p>
          <p>Phone number: {phoneNumber}</p>
          <p>Seat capacity: {seatCapacity}</p>
        </div>

        <div className="reserveCreate">
          <div className="reservationDate">
            <CalendarButton selectedDate={selectedDate} setSelectedDate={setSelectedDate} handleSelectedDate={handleSelectedDate}/>
          </div>
          
          <div className="createReservation">
            <Button 
              sx={{ borderRadius: "20px"}} 
              variant="contained" 
              startIcon={<AddCircleOutlineIcon sx={{ color: "white"}}/>}
              onClick={handleCreateButtonClick} 
            >
              Create
            </Button>
          </div>
        </div>
        {isModalOpen && 
          <FormModal 
            onConfirm={handleConfirmModal} 
            onClose={handleCloseModal} 
            modalTitle={`Online Reservation`} 
            formData={formData}
            timeSlots={timeSlots}
            setFormData={setFormData}
            selectedDate={selectedDate}
            reserveList={reserveList}
          />
        }
      
        <TimeTable reserveList={reservationsForSelectedDate} numOfTable={numOfTable} timeSlots={timeSlots}/>

        <div className="comment">
          <h2>Comment</h2>
          <p><strong>Overall ratings and reviews</strong></p>
          <div style={{display: "flex", alignItems: "center"}}>
            <Rating defaultValue={overallRating} precision={0.1} readOnly />
            <p style={{marginLeft: "15px"}}>{overallRating} based on recent ratings</p>
          </div>
         

          <div style={{marginBottom: "50px"}}>
            <h2>All Reviews</h2>
            {fetchedReviewList.map((reviewObject, index) => (
              <CustomerReview key={index} reviewObject={reviewObject} />
            ))}
            
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Schedule;
