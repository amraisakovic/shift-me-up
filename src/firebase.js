// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCSAXexZjmKGeeVwDSUsv97IGmXB0x9q8Q",
    authDomain: "shift-me-up.firebaseapp.com",
    projectId: "shift-me-up",
    storageBucket: "shift-me-up.firebasestorage.app",
    messagingSenderId: "855745580146",
    appId: "1:855745580146:web:9f3e62ab8b1c0e9494c6eb",
    measurementId: "G-P2YJNLKESM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth, db };