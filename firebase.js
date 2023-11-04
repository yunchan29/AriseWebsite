// firebase.js
document.getElementById('testing').textContent=("Javascript is working!");

// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getDatabase} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";
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
const auth=firebase.auth();
const database=firebase.datase();

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
      last_login: Date.now()
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