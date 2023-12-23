import "./Schedule.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarButton } from "../../Components";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { FormModal } from "../../Components";
import Button from '@mui/material/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { IconButton, Rating, TextField } from "@mui/material";

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
  reserveList.forEach(({ FName, People, tableNumber, timeSlot }) => {
    if (timeSlot >= startIdx && timeSlot < endIdx) {
      tableData[tableNumber - 1][timeSlot - startIdx - 1] = (
        <div>
          {FName}
          <br />
          People: {People}
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



const Schedule = () => {
  // used data
  const numOfTable = 8;
  const restaurantName = "Phở Hậu";
  const restaurantAddress = "Số 250, đường Thành Công, Quận 1, TPHCM";
  const restaurantDescription = "A path from a point approximately 330 metres east of the most south westerly corner of 17 Batherton Close, Widnes and approximately 208 metres east-south-east of the most southerly corner of Unit 3 Foundry Industrial Estate, Victoria Street, Widnes, proceeding in a generally east-north-easterly direction for approximately 28 metres to a point approximately 202 metres east-south-east of the most south-easterly corner of Unit 4 Foundry Industrial Estate, Victoria Street, and approximately 347 metres east of the most south-easterly corner of 17 Batherton Close, then proceeding in a generally northerly direction for approximately 21 metres to a point approximately 210 metres east of the most south-easterly corner of Unit 5 Foundry Industrial Estate, Victoria Street, and approximately 202 metres east-south-east of the most north-easterly corner of Unit 4 Foundry Industrial Estate, Victoria Street, then proceeding in a generally east-north-east direction for approximately 64 metres to a point approximately 282 metres east-south-east of the most easterly corner of Unit 2 Foundry Industrial Estate, Victoria Street, Widnes and approximately 259 metres east of the most southerly corner of Unit 4 Foundry Industrial Estate, Victoria Street, then proceeding in a generally east-north-east direction for approximately 350 metres to a point approximately 3 metres west-north-west of the most north westerly corner of the boundary fence of the scrap metal yard on the south side of Cornubia Road, Widnes, and approximately 47 metres west-south-west of the stub end of Cornubia Road be diverted to a 3 metre wide path from a point";
  const [formData, setFormData]= useState({
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

  const reserveList1 = [
    {FName: "Alice", People: 2, tableNumber: 1, timeSlot: 1},
    {FName: "David", People: 3, tableNumber: 2, timeSlot: 1},
    {FName: "Bella", People: 4, tableNumber: 1, timeSlot: 2},
    {FName: "Anna", People: 2, tableNumber: 1, timeSlot: 3},
    {FName: "Marry", People: 3, tableNumber: 2, timeSlot: 3},
    {FName: "Clinton", People: 3, tableNumber: 3, timeSlot: 3},
    {FName: "Clinton", People: 3, tableNumber: 4, timeSlot: 3},
    {FName: "Clinton", People: 3, tableNumber: 4, timeSlot: 10},
  ]

  const reserveList2 = [
    {FName: "Alice", People: 2, tableNumber: 2, timeSlot: 1},
    {FName: "David", People: 3, tableNumber: 3, timeSlot: 1},
    {FName: "Bella", People: 4, tableNumber: 4, timeSlot: 2},
    {FName: "Anna", People: 2, tableNumber: 5, timeSlot: 3},
    {FName: "Marry", People: 3, tableNumber: 6, timeSlot: 3},
    {FName: "Clinton", People: 3, tableNumber: 7, timeSlot: 3},
    {FName: "Clinton", People: 3, tableNumber: 8, timeSlot: 3},
    {FName: "Clinton", People: 3, tableNumber: 9, timeSlot: 10},
  ]

  const reserveListByDate = [
    {date: "14/12/2023", record: reserveList1},
    {date: "15/12/2023", record: reserveList2},
  ]
  
  const rating = 4.8; // need computed overall rating
  // Data for current user review
  const [userComment, setUserComment] = useState("")
  const [userRating, setUserRating] = useState(0)
  const reviewObjects = [
    {
      reviewRating: 4.5,
      reviewDate: new Date(2023, 11, 3), // Months are zero-indexed (11 represents December)
      reviewName: "John",
      reviewDetail: "Very delicious"
    },
    {
      reviewRating: 5,
      reviewDate: new Date(2023, 11, 10), // Months are zero-indexed (11 represents December)
      reviewName: "Michael",
      reviewDetail: "Most delicious restaurant"
    },
    {
      reviewRating: 4.5,
      reviewDate: new Date(2023, 11, 12), // Months are zero-indexed (11 represents December)
      reviewName: "Lazy",
      reviewDetail: "Food has unique taste"
    },
    {
      reviewRating: 4,
      reviewDate: new Date(2023, 11, 14), // Months are zero-indexed (11 represents December)
      reviewName: "Levoy",
      reviewDetail: "Food is OK"
    }
  ]

  //end data session

  const [selectedDate, setSelectedDate] = useState(null);
  const currentDate = new Date().toLocaleDateString("en-GB");
  
  const [usedReserveList, setReserveList] = useState(() => {
    const selectedReserve = reserveListByDate.find((entry) => entry.date === currentDate);
    return selectedReserve ? selectedReserve.record : [];
  });

  const [isTruncate, setIsTruncate] = useState(true);
  const [moreOrLess, setMoreOrLess] = useState(true);
  const [displayError, setDisplayError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleSelectedDate = (date) => {
    setSelectedDate(date);
    const formattedDate = date.toLocaleDateString("en-GB");
    setReserveList(() => {
    const selectedReserve = reserveListByDate.find((entry) => entry.date === formattedDate);
    return selectedReserve ? selectedReserve.record : [];
  });
  }

  const updateTruncate = () => {
    setIsTruncate(!isTruncate);
    setMoreOrLess(!moreOrLess);
  }

  const handleCreateButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setFormData({
      ...formData,
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

  const handleConfirmModal = () => {
    console.log(formData)
    setIsModalOpen(false);
  }

  const handleCommentChange = (event) => {
    setUserComment(event.target.value);
  };

  const handleRatingChange = (newValue) => {
    setUserRating(newValue);
  };

  const handleReviewButton = () => {
    if (userComment == "" || userRating == 0) {
      setDisplayError(true);
    }
    else {
      console.log('Comment:', userComment);
      console.log('Rating:', userRating);
      setUserComment("")
      setUserRating(0)
      setDisplayError(false);
    }
  }

  // Generate an array of time slots from 9:00 to 21:00 with 30-minute intervals
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
          <p>{restaurantAddress}</p>
          <p className={isTruncate ? 'truncateText' : 'normalText'}>
            {restaurantDescription}
          </p>
          <p onClick={updateTruncate} className={moreOrLess ? 'displayText' : 'noText'}>Read More</p>
          <p onClick={updateTruncate} className={!moreOrLess ? 'displayText' : 'noText'}>Read Less</p>
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
          />
        }
      
        <TimeTable reserveList={usedReserveList} numOfTable={numOfTable} timeSlots={timeSlots}/>

        <div className="comment">
          <h2>Comment</h2>
          <p><strong>Overall ratings and reviews</strong></p>
          <div style={{display: "flex", alignItems: "center"}}>
            <Rating defaultValue={rating} precision={0.1} readOnly />
            <p style={{marginLeft: "15px"}}>{rating} based on recent ratings</p>
          </div>
          <div style={{display: "flex", flexDirection: "column", marginBottom: "20px"}}>
            <TextField
              id="outlined-textarea"
              label=""
              placeholder="Your comment ..."
              multiline
              value={userComment}
              onChange={handleCommentChange}
              sx={{margin: "20px 0", width: "40%"}}
            />
            <p><strong>Your rating</strong></p>
            <Rating
              name="half-rating"
              value={userRating}
              precision={0.5}
              onChange={(event, newValue) => handleRatingChange(newValue)}
              sx={{ width: 'fit-content' }}
            />
            <div className="sendingReview">
              <Button onClick={handleReviewButton} sx={{width: "fit-content", mr: "10px"}} variant="contained">Send</Button>
              {displayError === true && (
                <p>* Please comment and rate before sending</p>
              )}
            </div>
            
          </div>

          <div style={{marginBottom: "50px"}}>
            <h2>All Reviews</h2>
            {reviewObjects.map((reviewObject, index) => (
              <CustomerReview key={index} reviewObject={reviewObject} />
            ))}
            
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Schedule;
