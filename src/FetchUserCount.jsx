import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import React, { useEffect, useState } from "react";
import "./FetchUserCount.css";

function FetchUserCount() {
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const countRef = doc(db, "UserCount", "1o5A6ZxsWRHJDwJu98yd");

    const unsubscribe = onSnapshot(countRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserCount(docSnap.data().UserCount);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  return (
    <div className="background-container">
      <div className="overlay"></div>
      <div className="card">
        <h1>Total Users Spinned The Wheel</h1>
        {!loading ? (
          <p className="user-count">{userCount.toLocaleString()}</p>
        ) : (
          <p className="user-count">Loading...</p>
        )}
      </div>
    </div>
  );
}

export default FetchUserCount;
