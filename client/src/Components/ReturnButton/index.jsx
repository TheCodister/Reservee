import { useNavigate } from "react-router-dom";
import "./ReturnButton.css";
const ReturnButton = () => {
  const history = useNavigate();
  return (
    <img
      className="return-button"
      onClick={() => history(-1)}
      src="./Images/Return.svg"
      alt="Icon"
    />
  );
};

export default ReturnButton;
