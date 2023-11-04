// firebase.js
document.getElementById('testing').textContent="Javascript is working!";

// Import necessary Firebase modules
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-analytics.js";
  import { getAuth } from "firebase/auth";
  import { getFirestore } from "firebase/firestore";
  import { getDatabase } from "firebase/database";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDde8OK0fHYx01cwk-QPB0LzIECoRL6K0w",
    authDomain: "arise-esports.firebaseapp.com",
    projectId: "arise-esports",
    storageBucket: "arise-esports.appspot.com",
    messagingSenderId: "546807423163",
    appId: "1:546807423163:web:bea33e7c6f45672a45c99e",
    measurementId: "G-EY02T4CGX4"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const database = getDatabase(app);

//Set up register function

function register(){
  email=document.getElementById('email').value;
  password=document.getElementById('email').value;
  console.log(email);
}

// Validate input fields
if(validate_email(email)== false || validate_password(password)==false){
  alert("Invalid Email or Password");
  return;
}

//auth
auth.createUserWithEmailAndPass(email, password)
  .then(function(){
var user=auth.currentUser;
//Add user to database
    var database_ref=database.ref();
    // create user _data
    var user_data={
      email:email, 
      password:password,
    }
alert('User Created');
  })
  .catch(function(error){
     var error_code=error.code;
     var error_message=error_message;

     alert(error_message);
  })

  database_ref.child('users/'+ user.uid).set(user_data)


function validate_email(email){
  expression=/^[^@]+@\w+(\.\w+)+\w$/.test(str);
  if(expression.test(email)==true){
    return true;
  }else{
      return false;
    }
}

function validate_password(password){
  if(password<6){
    return false;
  }  else{
    return true;
  }
}

function validate_field(field){
  if(field==null){
    return false;
  } if(field.length<=0){
    return false
  } else{
    return true;
  }
}