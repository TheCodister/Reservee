import "./Home.css";
import { Button } from "../../Components";
const Home = () => {
  return (
    <div className="home">
      <div className="home-title">
        <h1>Trang chủ</h1>
      </div>
      <div className="home-button">
        <Button name="In" icon="./Images/image3.svg" address="/Print" />
        <Button
          name="Lịch sử in"
          icon="./Images/image5.svg"
          address="/History"
        />
        <Button
          name="Mua giấy"
          icon="./Images/raphael_paper.svg"
          address="/BuyPaper"
        />
      </div>
      <h1 className="home-logout">Đăng xuất</h1>
    </div>
  );
};

export default Home;
