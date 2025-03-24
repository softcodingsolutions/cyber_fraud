import React, { useState, useEffect } from "react";
import { Wheel } from "react-custom-roulette";
import "./App.css"; // Import external styles for better handling

const App = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [messageIndex, setMessageIndex] = useState(-1);
  const [betterLuck, setBetterLuck] = useState(false);
  const [showSpinCount, setShowSpinCount] = useState(false);
  const [spinCount, setSpinCount] = useState(() => Number(localStorage.getItem("spinCount")) || 0);

  const messages = [
    "Bank Alert: Your A/C XXXXX180425 is debited ₹2000.",
    "Bank Alert: Your A/C XXXXX180425 balance is zero.",
    "Don't worry! Your balance is safe. Our upcoming Gujarati movie 'Shashtra' releases on 18/04/2024. Watch the trailer below!"
  ];

  const data = [
    { option: "1000 Win" },
    { option: "2000 Win" },
    { option: "3000 Win" },
    { option: "Better Luck" }
  ];

  const handleSpinClick = () => {
    if (!mustSpin) {
      const newPrizeNumber = Math.floor(Math.random() * data.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
      setSpinCount(spinCount + 1);
      localStorage.setItem("spinCount", spinCount + 1);
    }
  };

  const handleStopSpinning = () => {
    setMustSpin(false);
    if (data[prizeNumber].option === "Better Luck") {
      setBetterLuck(true);
    } else {
      setMessageIndex(0);
      setShowPopup(true);
    }
  };

  useEffect(() => {
    if (messageIndex >= 0 && messageIndex < messages.length - 1) {
      const timer = setTimeout(() => {
        setMessageIndex(messageIndex + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [messageIndex]);

  return (
    <div className="app-container">
      <div className={`background-overlay ${messageIndex < messages.length - 1 ? "blurred" : "clear"}`}></div>

      <h2 className="title">Spin the Wheel</h2>
      <p className="spin-count-toggle" onClick={() => setShowSpinCount(!showSpinCount)}>
        Click to View Spin Count
      </p>
      {showSpinCount && <p className="spin-count">Spins Count: {spinCount}</p>}

      <div className="wheel-container">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          onStopSpinning={handleStopSpinning}
          backgroundColors={["#FF5733", "#33FF57", "#5733FF", "#FFD700"]}
          textColors={["#fff"]}
          outerBorderColor="#000"
          outerBorderWidth={2}
          radiusLineColor="#000"
          radiusLineWidth={2}
          fontSize={18}
          innerRadius={30}
        />
        <button className="spin-button" onClick={handleSpinClick}>Spin</button>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p className="popup-message">⚠ {messages[messageIndex]}</p>
            {messageIndex === messages.length - 1 && (
              <>
                <iframe
                  className="youtube-video"
                  src="https://www.youtube.com/embed/HbtLgiEMjb4"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <button className="close-button" onClick={() => setShowPopup(false)}>Close</button>
              </>
            )}
          </div>
        </div>
      )}

      {betterLuck && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p className="popup-message">Better Luck Next Time! Spin Again?</p>
            <button className="close-button" onClick={() => setBetterLuck(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
