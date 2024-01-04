import "./Schedule.css";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
const Schedule = () => {
  const param = useParams();
  const [response, setResponse] = useState({});
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/reservations");
        const responseData = res.data;
        for (var i = 0; i < responseData.length; i++) {
          if (responseData[i].restaurant_id == param.id) {
            setResponse(responseData[i]);
          }
        }
        // Set the filtered data in state
      } catch (err) {
        console.log(err);
      }
    };

    getData();
  }, [param.id]);
  //console.log(response);
  return (
    <div className="schedule">
      <div className="schedule-title">
        <h1>Reservation Schedule of {param.id}</h1>
      </div>
      <div className="schedule_body">
        <h2>Name of customer: {response.date}</h2>
        <h2>Customer name: {response.fname}</h2>
        <h2>Phone number: {response.phone_number}</h2>
      </div>
    </div>
  );
};

export default Schedule;
