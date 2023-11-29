import "./PrintMenu.css";
import { ReturnButton, Popup } from "../../Components";
import { useState } from "react";
import { Link } from "react-router-dom";
const Print = () => {
  const [buttonPopup, setButtonPopup] = useState(false);
  return (
    <div className="print">
      <Popup trigger={buttonPopup} setTrigger={setButtonPopup} />
      <div className="print-title">
        <h1>In</h1>
      </div>
      <div className="print-window">
        <img src="./Images/Group 36.png" alt="printwindow" />
      </div>
      <div className="print-button">
        <Link to="/">
          <h1>In</h1>
        </Link>
        <h1 onClick={() => setButtonPopup(true)}>Hủy in</h1>
      </div>
    </div>
  );
};

export default Print;
