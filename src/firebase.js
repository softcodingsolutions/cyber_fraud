import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child, update } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_apiKey,
    authDomain: process.env.REACT_APP_authDomain,
    projectId: process.env.REACT_APP_projectId,
    storageBucket: process.env.REACT_APP_storageBucket,
    messagingSenderId: process.env.REACT_APP_messagingSenderId,
    appId: process.env.REACT_APP_appId
};

console.log(firebaseConfig)

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, ref, set, get, child, update };