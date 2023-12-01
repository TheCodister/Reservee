import "./NavBar.css";
import { Link } from "react-router-dom";
const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-first-section">
        <img src="./Images/HCMUTlogo.png"></img>
        <h1>HCMUT-SPSS</h1>
        <p>NQ</p>
      </div>
      <div className="navbar-second-section">
        <Link to="/">
          <p>Trang chủ</p>
        </Link>
        <p>Hướng dẫn</p>
        <p>Hỗ trợ</p>
        <h2>Số giấy còn lại: 0</h2>
      </div>
    </nav>
  );
};

export default NavBar;
