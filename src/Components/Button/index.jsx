import "./Button.css";
import { Link } from "react-router-dom";
const Button = (props) => {
  const name = props.name;
  const icon = props.icon;
  const address = props.address;
  return (
    <Link to={address}>
      <div className="button">
        <div className="button-icon">
          <img src={icon} alt="Icon" />
        </div>
        <h1>{name}</h1>
      </div>
    </Link>
  );
};

export default Button;
