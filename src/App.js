import React, { useState, useEffect, useRef } from "react";
import { Wheel } from "react-custom-roulette";
import "./App.css"; // Import external styles for better handling
import SpinSound from "./Assets/spinsound.mp3"
import Notification from "./Assets/notification.mp3"
import Warning from "./Assets/warning-alarm.mp3"
import Label from "./Assets/labeltext.png"
import Label2 from "./Assets/textlabel2.png"
import Pointer2 from "./Assets/pointer3.png"
import textvideo from "./Assets/text.mp4"
import headung from "./Assets/headung.png"
import heading from "./Assets/heading.png"
import bgvideo from "./Assets/Bgvideo3.mp4"
import bgVideoSq from "./Assets/bg-video-sq.mp4"
import Poster from "./Assets/poster.jpg"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FetchUserCount from "./FetchUserCount"
import { db, ref, get, update } from "./firebase";
import { doc, updateDoc, increment } from "firebase/firestore";
import newbg from "./Assets/newbg.mp4"
import Footer from "./Assets/Footer.png"

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
  const [showposter, setshowposter] = useState(false)

  const messages = [
    "Bank Alert: Your A/C XXXXX180425 is debited ₹2500.",
    "Bank Alert: Your A/C XXXXX180425 balance is ₹0.",
    "Don't worry! Your balance is safe. Our upcoming Gujarati movie 'શસ્ત્ર' based on Cyber Fraud releasing on 18/04/2025. Watch the trailer below!"
  ];

  const data = [
    { option: "WIN ₹500", style: { backgroundColor: "#d1071f", textColor: "#ffffff" } },
    { option: "WIN ₹1000", style: { backgroundColor: "#ffbd59", textColor: "#ffffff" } },
    { option: "JACKPOT", style: { backgroundColor: "#d1071f", textColor: "#ffffff" } },
    { option: "WIN ₹1500", style: { backgroundColor: "#ffbd59", textColor: "#ffffff" } },
    { option: "WIN ₹2000", style: { backgroundColor: "#d1071f", textColor: "#ffffff" } },
    { option: "LOSE", style: { backgroundColor: "#ffbd59", textColor: "#ffffff" } },
  ]

  const handleSpinClick = () => {
    if (!mustSpin) {
      const newPrizeNumber = Math.floor(Math.random() * data.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
      setSpinCount(spinCount + 1);
      incrementUserCount()
      localStorage.setItem("spinCount", spinCount + 1);
      spinSound.current.currentTime = 0;
      spinSound.current.play();
    }
  };

  const incrementUserCount = async () => {
    const count = doc(db, "UserCount", "1o5A6ZxsWRHJDwJu98yd");
    console.log("Incrementing User Count", count)
    await updateDoc(count, {
      UserCount: increment(1)
    }).then(() => {
      console.log("User Count Incremented")
    }).catch((error) => {
      console.log("Error updating User Count:", error)
    })
  };

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


    if (data[prizeNumber].option === "LOSE") {
      setTimeout(() => {
        notiSound.current.play();
        setBetterLuck(true);
      }, 1000);

    } else {
      setTimeout(() => {
        notiSound.current.play();
        setMessageIndex(0);
        setShowPopup(true);
      }, 1000);
    }
  };

  useEffect(() => {
    if (messageIndex === 2) {
      setshowposter(true)
      notiSound.current.pause();
    }

    if (messageIndex >= 0 && messageIndex < messages.length - 1) {
      const timer = setTimeout(() => {
        if (messageIndex < 1) {
          notiSound.current.play();
        }
        setMessageIndex(messageIndex + 1);
      }, 3000);
      // notiSound.current.pause();
      return () => clearTimeout(timer);
    }
  }, [messageIndex]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="app-container">
            <div className={`background-overlay ${messageIndex < messages.length - 1 ? "clear" : "clear"}`}></div>

            {!showposter ?
              (
                <video
                  src={newbg}
                  autoPlay
                  loop
                  playsInline
                  muted
                  className="bg-video"
                />) :
              (
                <>
                  <div className="poster-background">
                  </div>
                </>
              )

            }

            {!showposter && (
              <>
                <div className="title">
                  <img src={heading} alt="heading" className="title-image" />
                </div>
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
                    spinDuration={0.3}
                    pointerProps={{
                      style: {
                        top: "-20px",
                        right: "50px",
                        rotate: "-20deg",
                      }
                    }}
                  // pointerProps={{
                  //   style: {
                  //     position: "absolute",
                  //     top: "-20px",
                  //     right: "50px",
                  //     width: "50px", // Adjust size
                  //     height: "50px",
                  //   },
                  //   children: <img src={Pointer2} alt="Pointer" style={{ width: "100%", height: "100%" }} />
                  // }} 
                  />
                  <button className="spin-button .spin-button::before" onClick={handleSpinClick}>
                    {betterLuck ? "Spin Again" : "Spin"}
                  </button>
                </div>


                <div>
                  <img src={Footer} alt="" width={"100vw"} height={"50px"} className="footer-image" />
                </div>

              </>

            )}

            {showPopup && (
              <div className="popup-overlay">
                <div key={messageIndex} className="animation">
                  <div className="popup-content">
                    <p className="popup-message">⚠️ {messages[messageIndex]}</p>

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
              </div>
            )}

            {betterLuck && (
              <div className="popup-overlay">
                <div key={messageIndex} className="animation">
                  <div className="popup-content">
                    <p className="popup-message">Better Luck Next Time! Spin Again?</p>
                    <button className="close-button" onClick={() => setBetterLuck(false)}>Close</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        } />
        <Route path="/usercount" element={<FetchUserCount />} />
      </Routes>
    </Router>
  );
};

export default App;
