import "./NavBar.css";
const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-first-section">
        <img src="./Images/HCMUTlogo.png"></img>
        <h1>HCMUT-SPSS</h1>
        <p>NQ</p>
      </div>
      <div className="navbar-second-section">
        <p>Trang chủ</p>
        <p>Hướng dẫn</p>
        <p>Hỗ trợ</p>
        <p>Số giấy còn lại: 0</p>
      </div>
    </nav>
  );
};

export default NavBar;
