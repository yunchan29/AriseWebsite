// index.js

// Import necessary Firebase modules
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDde8OK0fHYx01cwk-QPB0LzIECoRL6K0w",
    authDomain: "arise-esports.firebaseapp.com",
    projectId: "arise-esports",
    storageBucket: "arise-esports.appspot.com",
    messagingSenderId: "546807423163",
    appId: "1:546807423163:web:bea33e7c6f45672a45c99e",
    measurementId: "G-EY02T4CGX4"
  };

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Get a reference to the database
const database = getDatabase(app);