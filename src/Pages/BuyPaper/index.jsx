import "./BuyPaper.css";
import React, { useState } from "react";
import { ReturnButton, PlusButton } from "../../Components";
const BuyPaper = () => {
  const [amount, setAmount] = useState(0);
  const updateCount = (value) => {
    setAmount((prevCount) => {
      const updatedCount = prevCount + value;
      return updatedCount < 0 ? 0 : updatedCount;
    });
  };
  const navigate = () => {
    if (amount > 0) {
      setAmount(0);
      window,
        open(
          "https://sso.hcmut.edu.vn/cas/login?service=https%3A%2F%2Fbkpay.hcmut.edu.vn%2Fbkpay%2F"
        );
    }
  };
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
          <div onClick={() => updateCount(-100)}>
            <PlusButton value="-100" />
          </div>
          <div onClick={() => updateCount(-10)}>
            <PlusButton value="-10" />
          </div>
          <div onClick={() => updateCount(-1)}>
            <PlusButton value="-1" />
          </div>
          <h1 className="buypaper-value">{amount}</h1>
          <div onClick={() => updateCount(+1)}>
            <PlusButton value="+1" />
          </div>
          <div onClick={() => updateCount(+10)}>
            <PlusButton value="+10" />
          </div>
          <div onClick={() => updateCount(+100)}>
            <PlusButton value="+100" />
          </div>
        </div>
        <div className="buypaper-purchase">
          <h1
            href="http://www.google.com"
            target="_blank"
            onClick={() => navigate()}
          >
            Mua giấy
          </h1>
        </div>
      </div>
    </div>
  );
};

export default BuyPaper;
