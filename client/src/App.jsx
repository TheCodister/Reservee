import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { Home, History, Schedule, APIsExample, Login } from "./Pages";
import { NavBar } from "./Components";
import { Snackbar, Alert } from "@mui/material";

import "./App.css";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [hasLogin, setHasLogin] = useState(getCookie('userID') !== null);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("error");
  const [alertMessage, setAlertMessage] = useState("");
 
   /* make cookie when need to get customer id*/
   const setCookie = (name, value, days) => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + days);

  // Set SameSite=Strict attribute
  const cookieOptions = {
    expires: expirationDate.toUTCString(),
    path: '/',
    secure: true,
    SameSite: 'Strict',
  };

  const cookieValue = `${name}=${value}; ${serializeCookieOptions(cookieOptions)}`;
  document.cookie = cookieValue;
};

// Helper function to serialize cookie options
const serializeCookieOptions = (options) => {
  return Object.entries(options)
    .map(([key, value]) => `${key}=${value}`)
    .join('; ');
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

  function deleteCookie(cookieName) {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };

  return (
    <Router>
      <div className="App">
        <NavBar hasLogin={hasLogin} setHasLogin={setHasLogin} deleteCookie={deleteCookie}/>
        <div className="content">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/History" element={<History customerID={getCookie('userID')}/>} />
            <Route path="/Schedule/:restaurant_id" element={<Schedule getCookie={getCookie} hasLogin={hasLogin}/>} />
            <Route path="/APIsExample" element={<APIsExample />} />
            <Route exact path="/Login" element={<Login setOpenAlert={setOpenAlert} setAlertSeverity={setAlertSeverity} setAlertMessage={setAlertMessage} hasLogin={hasLogin} setHasLogin={setHasLogin} isLogin={isLogin} setIsLogin={setIsLogin} setCookie={setCookie} getCookie={getCookie}/>} />
          </Routes>
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
    </Router>
  );
}

export default App;
