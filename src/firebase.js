import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child, update } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyD8nh0Pj2uEl8dvFHW9r8QovKKp9eLgG18",
    authDomain: "cyber-c3aee.firebaseapp.com",
    projectId: "cyber-c3aee",
    storageBucket: "cyber-c3aee.firebasestorage.app",
    messagingSenderId: "198830556900",
    appId: "1:198830556900:web:253629a89ff36d91a34ef1"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, get, child, update };