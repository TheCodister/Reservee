import "./NavBar.css";
import { Link } from "react-router-dom";
const NavBar = () => {
  return (
    <nav className="navbar">
      <img src="./Images/Logo.png" alt="image" />
      <div className="navbar-button">
        <div className="navbar-butt">
          <img src="./Images/home-select.png" alt="Icon" />
          <Link to="/">
            <p>Home</p>
          </Link>
        </div>
        <div className="navbar-butt">
          <img src="./Images/chart.png" alt="Icon" />
          <p>Reminder</p>
        </div>
        <div className="navbar-butt">
          <img src="./Images/documents.png" alt="Icon" />
          <Link to="/History">
            <p>History</p>
          </Link>
        </div>
        <div className="navbar-butt">
          <img src="./Images/user.png" alt="Icon" />
          <p>Account</p>
        </div>
        <div className="navbar-butt">
          <img src="./Images/logout.png" alt="Icon" />
          <p>Log out</p>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
