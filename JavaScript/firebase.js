// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

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

fetchAndDisplayMembers();

// Register member function
async function registerMember() {
  console.log("Registering member...");

  const email = document.getElementById('email').value;
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const yearSection = document.getElementById('yearSection').value;

  // Validate input fields
  if (!validate_email(email) || !validate_field(firstName) || !validate_field(lastName) || !validate_field(yearSection)) {
    alert("Invalid input. Please check your details.");
    return;
  }

  const photoInput = document.getElementById('photo');
  const photoFile = photoInput.files[0];

  if (!photoFile) {
    alert("Please upload a photo.");
    return;
  }

  // Read the file and convert it to a data URL
  const reader = new FileReader();

  reader.onloadend = async function () {
    // Save user data to Firestore
    const userRef = collection(db, 'members');
    const userData = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      yearSection: yearSection,
      photo: reader.result, // Save the photo as a data URL
    };

    try {
      console.log("Adding document to Firestore:", userData);
      const docRef = await addDoc(userRef, userData);

      var myModal = new bootstrap.Modal(document.getElementById('myModal'));
      myModal.show();

      // Fetch and display members after registration
      const members = await fetchMembers();
      displayMembers(members);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to save user data. Please try again.");
    }
  };

  reader.readAsDataURL(photoFile);
}

// Register admin function
async function registerAdmin() {
  const email = document.getElementById('adminEmail').value;
  const password = document.getElementById('adminPassword').value;

  // Validate input fields
  if (!validate_email(email) || !validate_password(password)) {
    alert("Invalid Email or Password");
    return;
  }

  // Auth
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save admin data to Firestore
    const adminRef = collection(db, 'admins');
    const adminData = {
      email: email,
      // Add more admin fields as needed
    };

    await addDoc(adminRef, adminData);

    // Perform any additional admin-related tasks if needed

    // Example: Redirect to admin dashboard
    window.location.href = "/admin-dashboard";
  } catch (error) {
    console.error("Error adding admin document: ", error);
    alert("Failed to save admin data. Please try again.");
  }
}

// Log in admin function
async function logInAdmin() {
  const email = document.getElementById('adminEmail').value;
  const password = document.getElementById('adminPassword').value;

  // Validate input fields
  if (!validate_email(email) || !validate_password(password)) {
    alert("Invalid Email or Password");
    return;
  }

  // Auth
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Perform any additional admin-related tasks if needed

    // Example: Redirect to admin dashboard
    window.location.href = "adminPage.html";
  } catch (error) {
    console.error("Error during login: ", error);
    alert("Invalid email or password. Please try again.");
  }
}

// Log out admin function
async function logOutAdmin() {
  // Auth
  try {
    await signOut(auth);

    // Sign-out successful.
    alert("Logged out successfully!");
    window.location.href = "index.html"; // Redirect to the home page or any other desired page after logout
  } catch (error) {
    // An error happened.
    console.error("Error during logout: ", error);
    alert("Failed to log out. Please try again.");
  }
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

// Fetch and display members function
async function fetchAndDisplayMembers() {
  try {
    const members = await fetchMembers();
    displayMembers(members);
  } catch (error) {
    console.error("Error fetching and displaying members: ", error);
  }
}

// Fetch members function
async function fetchMembers() {
  try {
    const membersCollection = collection(db, 'members');
    const membersSnapshot = await getDocs(membersCollection);
    const membersList = [];

    membersSnapshot.forEach((doc) => {
      const memberData = doc.data();
      // Add the document ID to the memberData
      memberData.id = doc.id;
      membersList.push(memberData);
    });

    return membersList;
  } catch (error) {
    console.error("Error fetching members: ", error);
    throw error;
  }
}

// Display members function
function displayMembers(members) {
  const membersContainer = document.getElementById('membersContainer');

  // Check if membersContainer is null or undefined
  if (!membersContainer) {
    console.error('Members container not found.');
    return;
  }

  // Clear existing content
  membersContainer.innerHTML = '';

  // Check if members exist
  if (members.length === 0) {
    console.log('No members to display.');
    return;
  }

  // Display each member
  members.forEach((member) => {
    const memberDiv = document.createElement('div');
    const memberId = member.id;
    memberDiv.innerHTML = `
        <p>Email: ${member.email}</p>
        <p>Name: ${member.firstName} ${member.lastName}</p>
        <p>Year/Section: ${member.yearSection}</p>
        <img style="max-width:150px; border-radius:12px; margin:10px;" src="${member.photo}" alt="Member Photo"><br>
        <button class="btn btn-primary">Edit</button>
        <button class="btn btn-primary delete-btn" data-member-id="${memberId}">Delete</button>
        <hr>
    `;
    membersContainer.appendChild(memberDiv);

    // Add click event listener for the "Delete" button
    const deleteButton = memberDiv.querySelector('.delete-btn');
    deleteButton.addEventListener('click', () => deleteMember(memberId));
  });
}

// Function to delete a member
async function deleteMember(memberId) {
  console.log("Deleting member with ID:", memberId);

  if (!memberId) {
    console.error("Invalid memberId:", memberId);
    alert("Invalid memberId. Please try again.");
    return;
  }

  // Ask for confirmation before deletion
  const isConfirmed = confirm("Are you sure you want to delete this member?");

  if (!isConfirmed) {
    console.log("Deletion cancelled by user.");
    return;
  }

  const memberRef = doc(db, 'members', memberId);

  try {
    await deleteDoc(memberRef);
    console.log('Document successfully deleted!');
    // Fetch and display members after deletion
    const members = await fetchMembers();
    displayMembers(members);
  } catch (error) {
    console.error('Error deleting document: ', error);
    alert('Failed to delete member. Please try again.');
  }
}

