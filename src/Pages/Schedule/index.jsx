import "./Schedule.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarButton } from "../../Components";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
const Schedule = () => {
  return (
    <div className="schedule">
      <div className="schedule-title">
        <h1>RESERVATION SCHEDULE</h1>
      </div>

      <div className="reservation">
        <div className="restaurant info">
          <h2>Phở Hậu</h2>
          <p>Số 250, đường Thành Công, Quận 1, TPHCM</p>
        </div>
        <div className="reservationDate">
          <CalendarButton/>
        </div>
        
        <div className="createReservation">

        </div>

        <table className="reservationTable">

        </table>
      </div>
    </div>
  );
};

export default Schedule;
