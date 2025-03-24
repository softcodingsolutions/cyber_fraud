import React, { useState, useEffect, useRef } from "react";
import { Wheel } from "react-custom-roulette";
import "./App.css"; // Import external styles for better handling
import SpinSound from "./Assets/spinsound.mp3"
import Notification from "./Assets/notification.mp3"
import Label from "./Assets/labeltext.png"
import Label2 from "./Assets/textlabel2.png"
import Pointer2 from "./Assets/pointer3.png"
import textvideo from "./Assets/text.mp4"
import headung from "./Assets/headung.png"
import bgvideo from "./Assets/Bgvideo.mp4"
// import { db, ref, get, update } from "./firebase";

const App = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [messageIndex, setMessageIndex] = useState(-1);
  const [betterLuck, setBetterLuck] = useState(false);
  const [showSpinCount, setShowSpinCount] = useState(false);
  const [spinCount, setSpinCount] = useState(() => Number(localStorage.getItem("spinCount")) || 0);

  const spinSound = useRef(new Audio(SpinSound));
  const notiSound = useRef(new Audio(Notification));

  const messages = [
    "Bank Alert: Your A/C XXXXX180425 is debited ₹2000.",
    "Bank Alert: Your A/C XXXXX180425 balance is ₹0.",
    "Don't worry! Your balance is safe. Our upcoming Gujarati movie 'Shashtra' releases on 18/04/2025. Watch the trailer below!"
  ];

  const data = [
    { option: "₹50", style: { backgroundColor: "#00a7d6", textColor: "#ffffff" } },
    { option: "₹75", style: { backgroundColor: "#004aad", textColor: "#ffffff" } },
    { option: "JACKPOT", style: { backgroundColor: "#00a7d6", textColor: "#ffffff" } },
    { option: "₹100", style: { backgroundColor: "#004aad", textColor: "#ffffff" } },
    { option: "₹200", style: { backgroundColor: "#00a7d6", textColor: "#ffffff" } },
    { option: "LOSE", style: { backgroundColor: "#004aad", textColor: "#ffffff" } },
  ]

  const handleSpinClick = () => {
    if (!mustSpin) {
      const newPrizeNumber = Math.floor(Math.random() * data.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
      setSpinCount(spinCount + 1);
      // incrementUserCount()
      localStorage.setItem("spinCount", spinCount + 1);
      spinSound.current.currentTime = 0;
      spinSound.current.play();
    }
  };

  // const incrementUserCount = async () => {
  //   const countRef = ref(db, "userCount");
  //   const snapshot = await get(countRef);

  //   let currentCount = snapshot.exists() ? snapshot.val() : 0;

  //   await update(countRef, currentCount + 1);
  // };

  useEffect(() => {
    notiSound.current.onended = () => {
      notiSound.current.currentTime = 0;
    };
  }, []);


  const handleStopSpinning = () => {
    setMustSpin(false);
    spinSound.current.pause();
    // spinSound.current.currentTime = 0; 
    notiSound.current.currentTime = 0;
    notiSound.current.play();

    if (data[prizeNumber].option === "LOSE") {
      setBetterLuck(true);
    } else {
      setMessageIndex(0);
      setShowPopup(true);
    }
  };

  useEffect(() => {
    if (messageIndex >= 0 && messageIndex < messages.length - 1) {
      const timer = setTimeout(() => {
        notiSound.current.currentTime = 0;
        notiSound.current.play();
        setMessageIndex(messageIndex + 1);
      }, 2000);
      // notiSound.current.pause();
      return () => clearTimeout(timer);
    }
  }, [messageIndex]);

  return (
    <div className="app-container">
      <div className={`background-overlay ₹{messageIndex < messages.length - 1 ? "clear" : "clear"}`}></div>

      <video
        src={bgvideo}
        autoPlay
        loop
        muted
        className="bg-video"
      />


      <div className="title">
        <img src={headung} alt="heading" className="title-image" />
      </div>

      {/* <p className="spin-count-toggle" onClick={() => setShowSpinCount(!showSpinCount)}>
        Click to View Spin Count
      </p> */}
      {showSpinCount && <p className="spin-count">Spins Count: {spinCount}</p>}

      <div className="wheel-container">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          onStopSpinning={handleStopSpinning}
          outerBorderColor="#24544e"
          outerBorderWidth={5}
          radiusLineColor="#000"
          radiusLineWidth={2}
          fontSize={18}
          innerRadius={30}
          spinDuration={0.5}
        // pointerProps={{
        //   src: Pointer2,
        //   style: {
        //     width: "180px", // Increased size
        //     height: "180px",
        //     position: "absolute",
        //     top: "-60px", // Adjusted position for size
        //     right: "-50px",
        //     transform: "translateX(-50%) rotate(135deg)", // Increased rotation
        //   }
        // }}


        />


        <button className="spin-button .spin-button::before" onClick={handleSpinClick}>
          {betterLuck ? "Spin Again" : "Spin"}
        </button>
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
