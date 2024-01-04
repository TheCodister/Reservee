import "./Schedule.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CalendarButton } from "../../Components";
import { FormModal } from "../../Components";
import Button from '@mui/material/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { IconButton, Rating } from "@mui/material";
import { format } from 'date-fns';

// Generate reserve table for view
const TimeTable = ({reserveList, numOfTable, timeSlots}) => {
  console.log("TT", reserveList)
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
  if (reserve.timeslot >= startIdx && reserve.timeslot - 1 < endIdx) {
    let checkEnough = false;
    for (let i=0;i<numOfTable;i++) {
      if (!tableData[i][reserve.timeslot - startIdx - 1]) {
        tableData[i][reserve.timeslot - startIdx - 1] = (
          <div>
            Name: {reserve.fname}
            <br />
            People: {reserve.seat_number}
          </div>
        );
        checkEnough = true;
        break;
      }
    }
    if (!checkEnough) {
      const newRow = new Array(itemsPerPage).fill("");
      tableData.push(newRow);
      tableData[numOfTable][reserve.timeslot - startIdx - 1] = (
        <div>
          Name: {reserve.fname}
          <br />
          People: {reserve.seat_number}
        </div>
      );
      numOfTable++;
    }
    
    
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
  
  const firstLetter = "P";

  return (
    <div className="reviewBox">
      <div className="reviewProfile">
        <p className="reviewIcon">{firstLetter}</p>
      </div>

      <div className="reviewContent">
        <div className="ratingAndDate">
          <Rating name="half-rating" defaultValue={reviewObject.stars} precision={0.5} sx={{marginRight: "10px", width: "fit-content"}} readOnly />
          <p>Dined on {reviewObject.date}</p>
        </div>
        <p>{reviewObject.comment}</p>
      </div>
    </div>
  )
}

const Schedule = () => {
  // fetched data from db
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
  
  //end fetched data from db 


  // data for current session 

  // selected date for display corresponding table reservation
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'dd-MM-yyyy'));
  const [formData, setFormData]= useState({
    CustomerID: 0,
    ReserveID: 0,
    FName:'',
    Phone:'',
    Email:'',
    Date:'',
    Time: '',
    People: 1,
    Note: '',
    TimeSlot: 0
  })


  // Reservation for selected date (table view change based on this list)
  const [reservationsForSelectedDate, setReservation] = useState([]);

  useEffect(() => {
    setReservation(resReserveList.filter((record) => record.date === selectedDate))
  }, [resReserveList])
  
  // Other things, does not really matter
  const [isModalOpen, setIsModalOpen] = useState(false);

  const calculateOverallRating = (reviews) => {
    if (reviews.length === 0) {
      return 0; // Return 0 if there are no reviews
    }
    const totalRating = reviews.reduce((sum, review) => sum + review.stars, 0);
    return totalRating / reviews.length; // Calculate average rating
  };

  const overallRating = calculateOverallRating(resReviewList);


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
      Note: '',
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
  const formattedDate = format(date, 'dd-MM-yyyy');
   setSelectedDate(formattedDate)
   setReservation(resReserveList.filter((formData) => formData.date === formattedDate))

 }
 
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
        body: JSON.stringify({ customer_id: newFormData.CustomerID, restaurant_id: restaurant_id, date: newFormData.Date,
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

  // Set new value for reservationsForSelectedDate whenever reserveList change
  useEffect(() => {
    setReservation(resReserveList.filter((formData) => formData.date === selectedDate))
  }, [resReserveList]);


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
            reserveList={resReserveList}
            restaurant={restaurant}
          />
        }
      
        <TimeTable reserveList={reservationsForSelectedDate} numOfTable={numOfTable} timeSlots={timeSlots}/>

        <div className="comment">
          <h2>Comment</h2>
          <p><strong>Overall ratings and reviews</strong></p>
          <div style={{display: "flex", alignItems: "center"}}>
            <Rating name="controlled-rating" value={overallRating} precision={0.1} readOnly />
            <p style={{marginLeft: "15px"}}>{overallRating} based on recent ratings</p>
          </div>
         

          <div style={{marginBottom: "50px"}}>
            <h2>All Reviews</h2>
            {resReviewList.map((reviewObject, index) => (
              <CustomerReview key={index} reviewObject={reviewObject} />
            ))}
            
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Schedule;
