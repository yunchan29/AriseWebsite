// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getDatabase, ref, set} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

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
const database = getDatabase(app);
//Auth-state listener


// Wait for the DOM to load before attaching the click event
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("btnMain").addEventListener("click", register);
});

// Set up register function
function register() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Validate input fields
  if (!validate_email(email) || !validate_password(password)) {
    alert("Invalid Email or Password");
    return;
  }

  console.log("eyeye")
  // Auth
  createUserWithEmailAndPassword(auth, email, password)
    .then(function (userCredential) {
      var user = userCredential.user;
      
      // // Add user to the database
      //function writeUserData(email, password) {
        //const db = getDatabase();
        //set(ref(db, 'users/' + uid), {
         // email: email,
          //password:password,
          //profile_pic: imageUrl,
       // });
      //}
      // Assuming your modal has an id of "myModal"
var myModal = new bootstrap.Modal(document.getElementById('myModal'));

// Open the modal
myModal.show();

   
  
      // Save user data to the database
    })
    .catch(function (error) {
      var error_code = error.code;
      var error_message = error.message;

      console.log(error_message);
      alert(error_message);
    });
}

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