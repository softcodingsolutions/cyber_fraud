import React, { useState, useEffect, useRef } from "react";
import { Wheel } from "react-custom-roulette";
import "./App.css";
import "./output.css"
import SpinSound from "./Assets/spinsound.mp3"
import Notification from "./Assets/notification.mp3"
import heading from "./Assets/heading.png"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FetchUserCount from "./FetchUserCount"
import { db, set } from "./firebase";
import { doc, updateDoc, increment } from "firebase/firestore";
import { getDoc, setDoc } from "firebase/firestore";
import newbg from "./Assets/newbg.mp4"
import Footer from "./Assets/Footer.png"
import LoginPage from "./Login Page/LoginPage";
import Dashboard from "./Dashboard/Dashboard";
import Form from "./Form/Form"
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const App = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [disablespin, setdisablespin] = useState(false)
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [messageIndex, setMessageIndex] = useState(-1);
  const [betterLuck, setBetterLuck] = useState(false);
  const [showSpinCount, setShowSpinCount] = useState(false);
  const [spinCount, setSpinCount] = useState(() => Number(localStorage.getItem("filmansh-spin-count")) || 0);
  const spinSound = useRef(new Audio(SpinSound));
  const notiSound = useRef(new Audio(Notification));
  const [showposter, setshowposter] = useState(false)
  const [jackpot, setjackpot] = useState(false)
  const [wait, setwait] = useState(false)
  const [date, setdate] = useState("")
  const MySwal = withReactContent(Swal);


  const today = new Date();
  const formattedToday = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;

  useEffect(() => {
    const storedCount = localStorage.getItem("filmansh-spin-count");
    const storedDate = localStorage.getItem("filmash-spin-date");
    if (storedDate === formattedToday) {
      if (storedCount !== null) {
        setSpinCount(Number(storedCount));
      } else {
        localStorage.setItem("filmansh-spin-count", "0");
        localStorage.setItem("filmash-spin-date", formattedToday)
        setSpinCount(0);
      }
    } else {
      localStorage.setItem("filmansh-spin-count", "0");
      localStorage.setItem("filmash-spin-date", formattedToday)
      setSpinCount(0);
    }
  }, []);

  const messages = [
    "Bank Alert: Your A/C XXXXX010525 is debited ₹2500.",
    "Bank Alert: Your A/C XXXXX010525 balance is ₹0.",
    "Don't worry! Your balance is safe. Our upcoming Gujarati movie 'શસ્ત્ર' based on Cyber Fraud releasing on 01/05/2025.Watch the trailer below!"
  ];

  const data = [
    { option: "WIN ₹500", style: { backgroundColor: "#d1071f", textColor: "#ffffff" } },
    { option: "WIN ₹1000", style: { backgroundColor: "#ffbd59", textColor: "#ffffff" } },
    { option: "WIN TICKETS", style: { backgroundColor: "#d1071f", textColor: "#ffffff" } },
    { option: "WIN ₹1500", style: { backgroundColor: "#ffbd59", textColor: "#ffffff" } },
    { option: "WIN ₹2000", style: { backgroundColor: "#d1071f", textColor: "#ffffff" } },
    { option: "LOSE", style: { backgroundColor: "#ffbd59", textColor: "#ffffff" } },
  ]

  const increaseSpinCount = () => {
    const current = localStorage.getItem("filmansh-spin-count");
    const newCount = current ? Number(current) + 1 : 1;
    localStorage.setItem("filmansh-spin-count", newCount.toString());
    setSpinCount(newCount);
  };


  const handleSpinClick = async () => {
    if (mustSpin) return;
    if (spinCount >= 3) {
      MySwal.fire({
        icon: 'info',
        title: 'Pls Try Again after 24 hours.',
        text: 'You have reached the maximum number of spins allowed.\nThank you for participating!',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        allowEscapeKey: false
      }).then(() => {
        window.close();
      });
      return;
    }

    setSpinCount(spinCount + 1)
    increaseSpinCount()
    await incrementUserCount();
    setwait(true)
    setdisablespin(true)
    const currentHour = new Date().getHours();
    const isRestrictedTime = true
    let shouldDisableTickets = true;
    const docRef = doc(db, "Winners", "winner");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const winnerData = docSnap.data();
      if (winnerData?.date === formattedToday) {
        if (winnerData?.winnerCount >= 25) {
          shouldDisableTickets = true;
        }
      } else {
        await setDoc(docRef, {
          date: formattedToday,
          winnerCount: 0
        });
      }
    } else {
      await setDoc(docRef, {
        date: formattedToday,
        winnerCount: 0
      });
    }
    const availableOptions = (shouldDisableTickets || isRestrictedTime)
      ? data.filter(item => item.option !== "WIN TICKETS")
      : data;

    const userCountRef = doc(db, "UserCount", "1o5A6ZxsWRHJDwJu98yd");
    const userCountSnap = await getDoc(userCountRef);

    let userCount = 0;
    if (userCountSnap.exists()) {
      userCount = await userCountSnap.data().UserCount || 0;
    }
    let newPrizeNumber;
    const canShowJackpot = (userCount % 50 === 0) && !shouldDisableTickets && !isRestrictedTime;
    if (canShowJackpot) {
      newPrizeNumber = 2;
    } else {
      newPrizeNumber = Math.floor(Math.random() * availableOptions.length);
    }

    const selectedOption = availableOptions[newPrizeNumber];
    const originalIndex = data.findIndex(item => item.option === selectedOption.option)

    if (selectedOption.option === "WIN TICKETS") {
      await updateDoc(docRef, {
        winnerCount: increment(1),
      });
    }

    spinSound.current.currentTime = 0;
    spinSound.current.loop = true;
    spinSound.current.play();
    setPrizeNumber(originalIndex);
    setSpinCount(prev => prev + 1);
    setMustSpin(true);
    setdisablespin(false)
    setwait(false)
  };

  const incrementUserCount = async () => {
    const count = doc(db, "UserCount", "1o5A6ZxsWRHJDwJu98yd");
    await updateDoc(count, {
      UserCount: increment(1)
    }).then(() => {
    }).catch((error) => {
    })
  };

  useEffect(() => {
    notiSound.current.onended = () => {
      notiSound.current.currentTime = 0;
    };
  }, []);


  const handleStopSpinning = () => {
    spinSound.current.pause();
    setwait(false)
    setMustSpin(false);

    notiSound.current.currentTime = 0;

    if (data[prizeNumber].option === "WIN TICKETS") {
      setTimeout(() => {
        notiSound.current.play();
        setjackpot(true);
      }, 1000);
      return
    }


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
      return () => clearTimeout(timer);
    }
  }, [messageIndex]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="app-container">
            <div className={`background-overlay whitespace-pre-wrap
              ${messageIndex < messages.length - 1 ? "clear" : "clear"}`}></div>

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
                  <div className="poster-container">
                    <div className="poster-background"></div>
                    <a href="https://youtu.be/C2aMLRioxE4?autoplay=1" style={{ textDecoration: "none" }}>
                      <button className="poster-button">
                        <span>
                          <svg
                            height="18px"
                            width="18px"
                            version="1.1"
                            id="Layer_1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 461.001 461.001"
                            fill="#000000"
                          >
                            <g id="SVGRepo_iconCarrier">
                              <g>
                                <path
                                  style={{ fill: "#F61C0D" }}
                                  d="M365.257,67.393H95.744C42.866,67.393,0,110.259,0,163.137v134.728 c0,52.878,42.866,95.744,95.744,95.744h269.513c52.878,0,95.744-42.866,95.744-95.744V163.137 C461.001,110.259,418.135,67.393,365.257,67.393z M300.506,237.056l-126.06,60.123c-3.359,1.602-7.239-0.847-7.239-4.568V168.607 c0-3.774,3.982-6.22,7.348-4.514l126.06,63.881C304.363,229.873,304.298,235.248,300.506,237.056z"
                                />
                              </g>
                            </g>
                          </svg>
                        </span>
                        &nbsp;Watch Trailer
                      </button>
                    </a>
                  </div>
                </>
              )

            }

            {!showposter && !jackpot && (
              <>
                <div className="no-scrollbar">
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
                      spinDuration={1}
                      pointerProps={{
                        style: {
                          top: "-20px",
                          right: "50px",
                          rotate: "-30deg",
                        }
                      }}
                    />
                    <button className="spin-button .spin-button::before" onClick={handleSpinClick} disabled={disablespin}>
                      {wait ? "Wait" : "Spin"
                      }
                    </button>
                  </div>
                  <img src={Footer} alt="Footer" className="footer-image" />
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
                          src="https://www.youtube.com/embed/C2aMLRioxE4"
                          title="Shastra - Official Trailer"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                        <button className="close-button" onClick={() => setShowPopup(false)}>Close</button>
                        <p className="my-2">
                          📞 Think Before You Click,Report Cyber Frauds at 1930.
                        </p>
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

            {jackpot && (
              <>
                <div>
                  <Form onClose={() => { setjackpot(false); setshowposter(true) }} />
                </div>
              </>
            )}

          </div>
        } />
        <Route path="/usercount" element={<FetchUserCount />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
