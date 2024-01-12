import React,{ useEffect, useState } from "react";
import "./NavBar.css";
import { Link } from "react-router-dom";
import AlertDialog from "../AlertDialog";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const NavBar = ({hasLogin, setHasLogin, deleteCookie}) => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate()
  const handleClose = () => {
    setOpen(false); // Close the AlertDialog
  };
  const handleLogout = () => {
    setOpen(true) // Open the AlertDialog
  }

  const handleLogoutConfirm = () => {
    setHasLogin(false);
    deleteCookie('userID');
    setOpen(false); // Close the AlertDialog after confirming logout
    navigate("/Login")
  };

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

                <div className="navbar-butt" onClick={handleLogout}>
                  <img src="/./Images/logout.png" alt="Icon" />
                  <p>Log out</p>
                </div>
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
      <AlertDialog open={open} handleClose={handleClose} handleConfirm={handleLogoutConfirm} />
    </nav>
  );
};

export default NavBar;
