import "./BuyPaper.css";
import React, { useState } from "react";
import { ReturnButton, PlusButton } from "../../Components";
const BuyPaper = () => {
  const [amount, setAmount] = useState(0);
  return (
    <div className="buypaper">
      <div className="buypaper-title">
        <h1>Mua giấy</h1>
        <ReturnButton />
      </div>
      <div className="buypaper-action">
        <div className="buypaper-picture">
          <img src="./Images/raphael_paper.svg" />
        </div>
        <div className="buypaper-button">
          <div onClick={() => setAmount(amount - 100)}>
            <PlusButton value="-100" />
          </div>
          <div onClick={() => setAmount(amount - 10)}>
            <PlusButton value="-10" />
          </div>
          <div onClick={() => setAmount(amount - 1)}>
            <PlusButton value="-1" />
          </div>
          <h1 className="buypaper-value">{amount}</h1>
          <div onClick={() => setAmount(amount + 1)}>
            <PlusButton value="+1" />
          </div>
          <div onClick={() => setAmount(amount + 10)}>
            <PlusButton value="+10" />
          </div>
          <div onClick={() => setAmount(amount + 100)}>
            <PlusButton value="+100" />
          </div>
        </div>
        <div className="buypaper-purchase">
          <h1>Mua giấy</h1>
        </div>
      </div>
    </div>
  );
};

export default BuyPaper;
