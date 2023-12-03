// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// Firebase configuration
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
const auth = getAuth(app);
const db = getFirestore(app);

//Auth-state listener

// Wait for the DOM to load before attaching the click event
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("btnMain").addEventListener("click", registerMember);
});

// ... (your existing code)

function registerMember() {
  const email = document.getElementById('email').value;
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const yearSection = document.getElementById('yearSection').value;

  // Validate input fields
  if (!validate_email(email) || !validate_field(firstName) || !validate_field(lastName) || !validate_field(yearSection)) {
    alert("Invalid input. Please check your details.");
    return;
  }

  // Save user data to Firestore
  const userRef = collection(db, 'members');
  const userData = {
    email: email,
    firstName: firstName,
    lastName: lastName,
    yearSection: yearSection,
    // Add more fields as needed
  };

  addDoc(userRef, userData)
    .then(() => {
      var myModal = new bootstrap.Modal(document.getElementById('myModal'));
      myModal.show();
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
      alert("Failed to save user data. Please try again.");
    });
}

// Set up register function for admin login
function registerAdmin() {
  const email = document.getElementById('adminEmail').value;
  const password = document.getElementById('adminPassword').value;

  // Validate input fields
  if (!validate_email(email) || !validate_password(password)) {
    alert("Invalid Email or Password");
    return;
  }

  // Auth
  createUserWithEmailAndPassword(auth, email, password)
    .then(function (userCredential) {
      var user = userCredential.user;

      // Perform any additional admin-related tasks if needed

      // Example: Redirect to admin dashboard
      window.location.href = "/admin-dashboard";
    })
    .catch(function (error) {
      var error_message = error.message;
      console.log(error_message);
      alert(error_message);
    });
}

// ... (your existing functions)


function validate_email(email) {
  var expression = /^[^@]+@\w+(\.\w+)+\w$/;
  return expression.test(email);
}

function validate_password(password) {
  return password.length >= 6;
}

function validate_field(field) {
  return field != null && field.length > 0;
}
