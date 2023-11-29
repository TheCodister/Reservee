import "./Popup.css";
import { Link } from "react-router-dom";
const Popup = (props) => {
  return props.trigger ? (
    <div className="popup-background">
      <div className="popup-warning">
        <h1>Bạn có muốn hủy in?</h1>
        <div className="popup-warning-button">
          <Link to="/">
            <h2>Có</h2>
          </Link>
          <h2 onClick={() => props.setTrigger(false)}>Không</h2>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
};

export default Popup;
