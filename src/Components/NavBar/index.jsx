import "./NavBar.css";
import { Link } from "react-router-dom";
const NavBar = () => {
  return (
    <nav className="navbar">
      <img src="./Images/Logo.png" alt="image"/>
      <div className="navbar-button">
        <div className="button">
          <img src="./Images/home-select.png" alt="Icon" />
          <p>Home</p>
        </div>
        <div className="button">
          <img src="./Images/chart.png" alt="Icon" />
          <p>Reminder</p>
        </div>
        <div className="button">
          <img src="./Images/documents.png" alt="Icon" />
          <p>History</p>
        </div>
        <div className="button">
          <img src="./Images/user.png" alt="Icon" />
          <p>Account</p>
        </div>
        <div className="button">
          <img src="./Images/logout.png" alt="Icon" />
          <p>Log out</p>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
