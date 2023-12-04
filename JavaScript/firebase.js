// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
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

// Wait for the DOM to load before attaching the click event
document.addEventListener("DOMContentLoaded", function () {
  const btnMain = document.getElementById("btnMain");
  const btnAdminLogin = document.getElementById("btnAdminLogin");
  const btnAdmin = document.getElementById("btnAdmin");
  const btnAdminLogout = document.getElementById("btnAdminLogout");

  if (btnMain) {
    btnMain.addEventListener("click", registerMember);
  }

  if (btnAdminLogin) {
    btnAdminLogin.addEventListener("click", logInAdmin);
  }

  if (btnAdmin) {
    btnAdmin.addEventListener("click", registerAdmin);
  }

  if (btnAdminLogout) {
    btnAdminLogout.addEventListener("click", logOutAdmin);
  }
});

// Register member function
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

// Register admin function
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

      // Save admin data to Firestore
      const adminRef = collection(db, 'admins');
      const adminData = {
        email: email,
        // Add more admin fields as needed
      };

      addDoc(adminRef, adminData)
        .then(() => {
          // Perform any additional admin-related tasks if needed

          // Example: Redirect to admin dashboard
          window.location.href = "/admin-dashboard";
        })
        .catch((error) => {
          console.error("Error adding admin document: ", error);
          alert("Failed to save admin data. Please try again.");
        });

    })
    .catch(function (error) {
      var error_message = error.message;
      console.log(error_message);
      alert(error_message);
    });
}

// Log in admin function
function logInAdmin() {
  const email = document.getElementById('adminEmail').value;
  const password = document.getElementById('adminPassword').value;

  // Validate input fields
  if (!validate_email(email) || !validate_password(password)) {
    alert("Invalid Email or Password");
    return;
  }

  // Auth
  signInWithEmailAndPassword(auth, email, password)
    .then(function (userCredential) {
      var user = userCredential.user;

      // Perform any additional admin-related tasks if needed

      // Example: Redirect to admin dashboard
      window.location.href = "adminPage.html";
    })
    .catch(function (error) {
      var error_message = error.message;
      console.log(error_message);
      alert(error_message);
    });
}

// Log out admin function
function logOutAdmin() {
  // Auth
  signOut(auth)
    .then(function () {
      // Sign-out successful.
      alert("Logged out successfully!");
      window.location.href = "index.html"; // Redirect to the home page or any other desired page after logout
    })
    .catch(function (error) {
      // An error happened.
      console.error("Error during logout: ", error);
      alert("Failed to log out. Please try again.");
    });
}

// Validation functions
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
