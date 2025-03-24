import React, { useState, useEffect } from "react";
import { Wheel } from "react-custom-roulette";

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
    <div style={{ textAlign: "center", padding: "50px", position: "relative" }}>
      
      {/* Background Image with Dynamic Blur */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url('https://img.youtube.com/vi/HbtLgiEMjb4/maxresdefault.jpg?imwidth=686')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: messageIndex < messages.length - 1 ? "blur(20px)" : "blur(0px)", // Strong blur until last message
          transition: "filter 1s ease-in-out",
          zIndex: -2
        }}
      ></div>

      <h2 style={{ color: "blue" }}>Spin the Wheel</h2>
      <p
        onClick={() => setShowSpinCount(!showSpinCount)}
        style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
      >
        Click to View Spin Count
      </p>
      {showSpinCount && <p>Spins Count: {spinCount}</p>}

      {/* Wheel & Spin Button */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative", zIndex: 1 }}>
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
        <button
          onClick={handleSpinClick}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "10px 15px",
            fontSize: "14px",
            backgroundColor: "#fff",
            color: "black",
            fontWeight: "bold",
            border: "none",
            borderRadius: "50%",
            width: "70px",
            height: "70px",
            cursor: "pointer"
          }}
        >
          Spin
        </button>
      </div>

      {/* Popup Messages - Always on Top */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px",
            zIndex: 5
          }}
        >
          <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", textAlign: "center", maxWidth: "80vw" }}>
            <p style={{ fontSize: "18px", marginBottom: "10px", color: "black" }}>
              <span style={{ color: "red", fontSize: "24px", marginRight: "10px" }}>⚠</span>
              {messages[messageIndex]}
            </p>

            {messageIndex === messages.length - 1 && (
              <>
                {/* Trailer in Center */}
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/HbtLgiEMjb4"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ margin: "20px 0" }}
                ></iframe>

                {/* Close Button */}
                <button
                  onClick={() => setShowPopup(false)}
                  style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginTop: "10px"
                  }}
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Better Luck Popup - Always on Top */}
      {betterLuck && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px",
            zIndex: 5
          }}
        >
          <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", textAlign: "center", maxWidth: "80vw" }}>
            <p style={{ fontSize: "18px", marginBottom: "10px" }}>Better Luck Next Time! Spin Again?</p>
            <button
              onClick={() => setBetterLuck(false)}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
