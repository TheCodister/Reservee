import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { MenuItem } from '@mui/material';
import Button from '@mui/material/Button';
import { useEffect, useState } from "react";
import { format, parseISO } from 'date-fns';

import "./FormModal.css";


const FormModal = ({ onConfirm, onClose, modalTitle, formData, timeSlots, setFormData, reserveList, restaurant}) => {
  const [phoneError, setPhoneError] = useState(false);
  const [tableError, setTableError] = useState(false);
  const [timeError, setTimeError] = useState(true);
  const [maxSeat, setMaxSeat] = useState(restaurant.seat_capacity);
  const [tempDate, setTempDate] = useState('')
  const [filteredTimeSlot, setFilteredTimeSlot] = useState([])
  const handleFormChange = (fieldName, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }));

    if(fieldName === 'Date') {
      if (value != '') {
        setTimeError(false)
      }

      if(value != '' && formData.Time != '') {
        setTableError(false);
      }
    }
    if(fieldName === 'Time') {
      if(value != '' && formData.Date != '') {
        setTableError(false);
      }
    }
  };

  const handleDateChange = (e) => {
    const rawDate = e.target.value; // Capture the date in 'yyyy-mm-dd' format
    console.log("raw date",rawDate);
    setTempDate(rawDate)
    const formattedDate = format(parseISO(rawDate), 'dd-MM-yyyy');
    handleFormChange('Date', formattedDate);
  };

  useEffect(() => {
    if(formData.Date != '' && formData.Time != '') {
      const matchingReserves = reserveList.filter(
        (Reserve) =>
          Reserve.date === formData.Date &&
          Reserve.time === formData.Time 
      );
  
      const sumOfSeatNumbers = matchingReserves.reduce(
        (sum, reserve) => sum + reserve.seat_number,
        0
      );
  
      // Now you have the sumOfSeatNumbers for the matching Reserves
      console.log('Sum of seat numbers:', sumOfSeatNumbers);
      setMaxSeat(restaurant.seat_capacity - sumOfSeatNumbers);
    }
  }, [formData.Date, formData.Time]);

  useEffect(() => {
    handleFormChange('Time', '')
  //   const currentDate = new Date();

  // // Create a Date object for the target time using the current date
  // const targetDate = new Date(currentDate.toDateString() + " " + targetTime);
  const dateString = formData.Date;
  const parts = dateString.split('-');
  const providedDate = new Date(parts[2], parts[1] - 1, parts[0]);
  const currentDate = new Date();
  
  // Compare only the date part (ignore time)
  const isCurrentDate =
    providedDate.getDate() === currentDate.getDate() &&
    providedDate.getMonth() === currentDate.getMonth() &&
    providedDate.getFullYear() === currentDate.getFullYear();

  if (isCurrentDate) {
    setFilteredTimeSlot(timeSlots.filter((slot) => {
      const currentTime = new Date();
      const currentTimeString = `${currentTime.getHours().toString().padStart(2, "0")}:${currentTime
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
      return currentTimeString <= slot.start;
    }))
    
  }
  else {
    setFilteredTimeSlot(timeSlots)
  }
  }, [formData.Date])

  const calculateMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
  
    // Format the date as yyyy-mm-dd for the input element
    const formattedMaxDate = maxDate.toISOString().split('T')[0];
    return formattedMaxDate;
  };

  const calculateMinDate = () => {
    const minDate = new Date();
  
    // Format the date as yyyy-mm-dd for the input element
    const formattedMinDate = minDate.toISOString().split('T')[0];
    return formattedMinDate;
  };

   // State to manage confirmation modal visibility
   const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);

   const handleConfirm = () => {
    // Check if required fields are filled before opening the confirmation modal
    if (formData.FName && formData.Phone && formData.Date && formData.Time && formData.People) {
      // Open the confirmation modal
      setConfirmationModalOpen(true);
    } else {
      // Display an alert if required fields are not filled
      window.alert("Please fill in all required fields");
    }
  };
 
   const handleConfirmModalClose = () => {
     // Close the confirmation modal
     setConfirmationModalOpen(false);
   };

   const handleConfirmModalAccept = () => {
    handleConfirmModalClose();  
    onConfirm();
    onClose();
   }

   const handleConfirmModalDecline = () => {
    handleConfirmModalClose(); 
    onClose();
   }

    return (
      <div className='form_modal'>
        <Modal
        open={true}
        onClose={onClose}
        disablebackdropclick="false"
      >
        <div className="modal open">
          <h2 className="cancel">{modalTitle}</h2>
          {/* Form Fields */}
          <form style={{display:"flex", flexDirection:"column"}}>
            <TextField
              InputProps={{ className: "input_form" }}
              label="Full Name"
              type="text"
              id="FName"
              name="FName"
              value={formData.FName}
              onChange={(e) => handleFormChange("FName", e.target.value)}
              required
            />

            <TextField
              InputProps={{ className: "input_form" }}
              label="Phone"
              type="tel"
              id="Phone"
              name="Phone"
              value={formData.Phone}
              onChange={(e) => {
                handleFormChange("Phone", e.target.value);
                const isValidPhone = /^\d{10}$/.test(e.target.value);
                setPhoneError(!isValidPhone);
              }}
              required
              error={phoneError}
              helperText={phoneError ? 'Invalid phone number (10-digit)' : ''}
            />

            <TextField
              InputProps={{ className: "input_form" }}
              label="Email"
              type="email"
              id="Email"
              name="Email"
              value={formData.Email}
              onChange={(e) => handleFormChange("Email", e.target.value)}
            />

            <TextField
                  InputLabelProps={{ shrink: true, className: 'input_form_label' }}
                  InputProps={{ className: 'input_form' }}
                  label="Date"
                  type="date"
                  id="Date"
                  name="Date"
                  value={tempDate}
                  onChange={handleDateChange}
                  inputProps={{
                    max: calculateMaxDate(), // Set the maximum date dynamically
                    min: calculateMinDate(), // Set the minimum date dynamically
                  }}
                  required
                  
                />



            
            <TextField
              InputProps={{ className: "input_form" }}
              label="Time"
              select
              id="Time"
              name="Time"
              value={formData.Time}
              onChange={(e) => handleFormChange("Time", e.target.value)}
              required
              disabled={timeError}
            >
              {filteredTimeSlot.map((slot) => (
                <MenuItem key={slot.start} value={slot.start}>
                  {slot.start}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              InputProps={{ className: "input_form" }}
              label="Number of People"
              type="number"
              id="People"
              name="People"
              value={formData.People}
              required
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (value > 0  & value <= 99999) {
                  handleFormChange("People", value);
                }
              }}
              disabled={maxSeat === 0}
              error={maxSeat === 0 || formData.People > maxSeat}
              helperText={maxSeat === 0 ? 'No seat available in this time slot' : 
              formData.People > maxSeat ? `Seating overflow. (Max: ${maxSeat})` : ''}
            />


            <TextField
              InputProps={{ className: "input_form" }}
              label="Note"
              multiline
              id="Note"
              name="Note"
              value={formData.Note}
              onChange={(e) => handleFormChange("Note", e.target.value)}
            />

            <div className="Btn">
              <Button
                sx={{ mr: "20px" }}
                variant="contained"
                color="primary"
                onClick={handleConfirm}
                disabled={
                  !(formData.FName && formData.Phone && formData.Date && formData.Time && formData.People
                    && !phoneError && !tableError && !(maxSeat === 0) && !(formData.People > maxSeat))
                }
              >
                Đồng ý
              </Button>
              <Button variant="contained" color="error" onClick={onClose}>
                Hủy bỏ
              </Button>
            </div>
          </form>
        </div>
      </Modal>
      {/* Confirmation Modal */}
      <Modal open={isConfirmationModalOpen} onClose={handleConfirmModalClose}>
        <div className="modal open">
          <h2 className="cancel">Confirmation</h2>
          {/* Display confirmation information */}
          <p>Full Name: {formData.FName}</p>
          <p>Phone: {formData.Phone}</p>
          <p>Email: {formData.Email}</p>
          <p>Restaurant: {restaurant.name}</p>
          <p>Date: {formData.Date}</p>
          <p>Time: {formData.Time}</p>
          <p>People: {formData.People}</p>
          <p>Note: {formData.Note}</p>
          <p>Deposit: {formData.People * 100000} vnđ</p>
          <p>Status: Create at time by user...</p>
          <div className="Btn">
            <button className="confirmBtn" onClick={handleConfirmModalAccept}>Confirm</button>
            <button className="cancelBtn" onClick={handleConfirmModalDecline}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
    );
  };

export default FormModal;