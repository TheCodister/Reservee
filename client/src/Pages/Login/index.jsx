// Login.jsx

import "./Login.css";
import React, { useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import axios from "axios";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

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
    const status = axios.get(`http://localhost:8080/customers/login/${formData.email}/${formData.password}`, {    //template only
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log('Fetched Data:', response.data)
          return response.data
        })
        .then((data) => {
          console.log('Fetched Data:', data)
          setCookie( 'userID', data.Customer_id , 1);       
        //   setcookie(getCookie('userID'))
          console.log(getCookie('userID'))
        })  

    console.log("Login form submitted:", formData);
    // Example: Send login request to your server
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    // Add your signup submit logic here
    try {
        // Making a POST request using axios
        const response = axios.post('http://localhost:8080/customers/', formData);  //template only

    } catch (error) {
        console.error('Error posting data:', error);
    }
    toggleForm;
    console.log("Signup form submitted:", formData);
    // Example: Send signup request to your server
  };

  return (
    <div className="login">
      <div className="login-title">
        <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      </div>
      <div className="login-form">
        <form onSubmit={isLogin ? handleLoginSubmit : handleSignupSubmit}>
          {/* Use MUI TextField for cleaner form structure */}
          {isLogin ? (
            <>
              <TextField
                label="Email"
                type="text"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
              <TextField
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
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
              />
              <TextField
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
              />
              <TextField
                label="Full Name"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                required
              />
              <TextField
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
              />
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
    </div>
  );
};

export default Login;
