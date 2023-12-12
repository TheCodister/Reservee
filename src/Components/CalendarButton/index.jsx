import React, { useState, forwardRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import "react-datepicker/dist/react-datepicker.css";
import "./CalendarButton.css";

const CalendarButton = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    // Set the default selected date to the current date when the component mounts
    setSelectedDate(new Date());
  }, []); // Empty dependency array ensures this effect runs only once

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 7); // Set maxDate to 7 days from the current date

  return (
    <div>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        customInput={<CustomDatePickerInput />}
        placeholderText={<CustomData value={selectedDate} />}
        dateFormat="dd/MM/yyyy"
        minDate={new Date()} // Set the minimum selectable date to the current date
        maxDate={maxDate} // Set the maximum selectable date to 7 days from the current date
      />
    </div>
  );
};

// Prop's value is object -> Can not pass to <p>
// Need to convert to string 
const CustomData = ({ value }) => (
  <div className="IconDate">
    <CalendarMonthIcon />
    <p>{value instanceof Date ? value.toLocaleDateString() : value}</p>
  </div>
);

// Using forwardRef to forward the ref to the underlying button element
const CustomDatePickerInput = forwardRef(({ value, onClick }, ref) => (
  <button ref={ref} onClick={onClick} className="calendarButton">
    {value ? <CustomData value={value} /> : <CalendarMonthIcon />}
  </button>
));

export default CalendarButton;
