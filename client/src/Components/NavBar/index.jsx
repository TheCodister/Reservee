import "./NavBar.css";
import { Link } from "react-router-dom";
const NavBar = ({hasLogin}) => {
  return (
    <nav className="navbar">
      <img src="/./Images/Logo.png" alt="image" />
      <div className="navbar-button">
        <Link to="/">
          <div className="navbar-butt">
            <img src="/./Images/home-select.png" alt="Icon" />
            <p>Home</p>
          </div>
        </Link>
        
        {hasLogin ? (
            <>
              <Link to="/History">
                <div className="navbar-butt">
                  <img src="/./Images/documents.png" alt="Icon" />
                  <p>History</p>
                </div>
              </Link>

              <Link to="/Login">
                <div className="navbar-butt">
                  <img src="/./Images/logout.png" alt="Icon" />
                  <p>Log out</p>
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link to="/Login">
                <div className="navbar-butt">
                  <img src="/./Images/documents.png" alt="Icon" />
                  <p>History</p>
                </div>
              </Link>

              <Link to="/Login">
                <div className="navbar-butt">
                  <img src="/./Images/documents.png" alt="Icon" />
                  <p>Login</p>
                </div>
              </Link>
            </>
          )}
        

        
      </div>
    </nav>
  );
};

export default NavBar;
