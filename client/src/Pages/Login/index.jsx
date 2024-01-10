// Login.jsx

import "./Login.css";
import React, { useEffect, useState } from "react";
import { TextField, Button, MenuItem } from "@mui/material";
import { Snackbar, Alert } from "@mui/material";
import axios from "axios";

const Login = ({isLogin, setIsLogin}) => {
  const [openAlert, setOpenAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("error");
  const [alertMessage, setAlertMessage] = useState("");

  const toggleForm = () => {
    setIsLogin((prevIsLogin) => !prevIsLogin);
    setFormData(isLogin ? loginFormData : signupFormData);
  };

  // Constants for managing form data
  const loginFormData = {
    email: "",
    password: "",
  };

  const signupFormData = {
    email: "",
    password: "",
    fullName: "",
    phone: "",
    gender: "Male",
  };

  const [formData, setFormData] = useState(isLogin ? loginFormData : signupFormData);

  useEffect(() => {
    setFormData(isLogin ? loginFormData : signupFormData);
  }, [isLogin]);

  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };

  /* make cookie when need to get customer id*/
  const setCookie = (name, value, days) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    const cookieValue = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
    document.cookie = cookieValue;
  };
  /*Take cookie*/
  function getCookie(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
  
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i].trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return null;
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Add your login submit logic here
      // Making a POST request using axios
    const response = axios.post('http://localhost:3000/customers/login', {
      email: formData.email,
      password: formData.password
    })
    .then(function (response) {
      console.log(response);
      if(response.data) {
        if(response.data.customerId) {
          setCookie( 'userID', response.data.customerId, 1); 
          console.log('customerid: ', response.data.customerId);
          console.log("Cookie id: ", getCookie('userID'));
          setAlertSeverity("success");
          setAlertMessage("Login successfully!");
          setOpenAlert(true);
        }
        else {
          if(response.data.error) {
            console.log("Login failed", response.data.error);
            setAlertSeverity("error");
            setAlertMessage("Login failed: " + response.data.error);
            setOpenAlert(true);
          }
        }
      }
    })
    .catch(function (error) {
      console.log(error);
      if(error.response.data) {
        console.log("Login failed!", error.response.data);
        setAlertSeverity("error");
        setAlertMessage("Login failed: " + error.response.data.error);
        setOpenAlert(true);
      }
    });
    
        // setCookie( 'userID', response.customerId, 1);  
    console.log("Login form submitted:", formData);
    // Example: Send login request to your server
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    // Add your signup submit logic here
 
    // Making a POST request using axios
    const response = axios.post('http://localhost:3000/customers/signup', {
      name: formData.fullName,
      gender: formData.gender,
      email: formData.email,
      phone_number: formData.phone,
      password: formData.password
    })
    .then(function (response) {
      console.log(response);
      toggleForm();
      if(response.data.message) {
        setAlertSeverity("success");
        setAlertMessage(response.data.message);
        setOpenAlert(true);
      }
    })
    .catch(function (error) {
      console.log("Sign up failed!", error);
      if(error.response.data) {
        console.log("Sign up failed!", error.response.data);
        setAlertSeverity("error");
        setAlertMessage("Sign up failed: " + error.response.data.error);
        setOpenAlert(true);
      }
    });

    console.log("Signup form submitted:", formData);
    // Example: Send signup request to your server
  };

  return (
    <div className="login">
      <div className="login-title">
        <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      </div>
      <div>
        <form className="login-form" onSubmit={isLogin ? handleLoginSubmit : handleSignupSubmit}>
          {/* Use MUI TextField for cleaner form structure */}
          {isLogin ? (
            <>
              <TextField
                label="Email"
                type="text"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                sx={{mb: "10px"}}
              />
              <TextField
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
                sx={{mb: "10px"}}
              />
            </>
          ) : (
            <>
              <TextField
                label="Email"
                type="text"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                sx={{mb: "10px"}}
              />
              <TextField
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
                sx={{mb: "10px"}}
              />
              <TextField
                label="Full Name"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                required
                sx={{mb: "10px"}}
              />
              <TextField
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
                sx={{mb: "10px"}}
              />
              <TextField
                select
                label="Gender"
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                required
                sx={{ mb: '10px', width: "210px" }}
              >
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="NotTell">Not Tell</MenuItem>
              </TextField>
            </>
          )}

          <Button type="submit" variant="contained">
            {isLogin ? "Login" : "Sign Up"}
          </Button>
        </form>
      </div>
      <div className="toggle-form">
        <p onClick={toggleForm}>{isLogin ? "Need an account? Sign Up" : "Already have an account? Login"}</p>
      </div>
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <Alert onClose={handleAlertClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;
