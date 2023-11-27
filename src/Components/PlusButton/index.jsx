import { useState } from "react";
import "./PlusButton.css";
const PlusButton = (prop) => {
  const number = prop.value;
  return (
    <div className="plusbutton">
      <h1>{number}</h1>
    </div>
  );
};

export default PlusButton;
