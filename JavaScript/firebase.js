
// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getFirestore, collection, getDocs, getDoc, doc, deleteDoc, updateDoc,addDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";


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
const storage = getStorage(app); // Add this line to get the storage service

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
    try {
      const userRef = collection(db, 'members');
      const userData = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        yearSection: yearSection,
        photo: reader.result,
      };

      console.log("Adding document to Firestore:", userData);
      const docRef = await addDoc(userRef, userData);

       // Clear input fields after successful registration
       document.getElementById('email').value = '';
       document.getElementById('firstName').value = '';
       document.getElementById('lastName').value = '';
       document.getElementById('yearSection').value = '';
       document.getElementById('photo').value = '';

      var myModal = new bootstrap.Modal(document.getElementById('myModal'));
      myModal.show();

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

document.addEventListener("DOMContentLoaded", function () {
  const membersContainer = document.getElementById('membersContainer');

  if (membersContainer) {
      membersContainer.addEventListener('click', function (event) {
          if (event.target.tagName === 'IMG') {
              const imageSrc = event.target.src;
              showLargerImage(imageSrc);
          }
      });
  }

  const closeModalButton = document.getElementById('closeModalButton');

  if (closeModalButton) {
      closeModalButton.addEventListener('click', closeModal);
  }
});

function showLargerImage(imageSrc) {
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');

  modalImage.src = imageSrc;
  modal.style.display = 'block';
}

function closeModal() {
  const modal = document.getElementById('imageModal');
  modal.style.display = 'none';
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
        <div class="memberConfig">
        <img style="border-radius:20px; margin:10px; cursor: pointer;" src="${member.photo}" alt="Member Photo" onclick="showLargerImage('${member.photo}')"><br>
            <p>Email: ${member.email}</p>
            <p>Name: ${member.firstName} ${member.lastName}</p>
            <p>Year/Section: ${member.yearSection}</p>
            
            <button class="btn btn-primary edit-btn" data-member-id="${memberId}">Edit</button>
            <button class="btn btn-primary delete-btn" data-member-id="${memberId}">Delete</button>
            <hr>
        </div>
      `;
      membersContainer.appendChild(memberDiv);

      // Add click event listener for the "Edit" button
      const editButton = memberDiv.querySelector('.edit-btn');
      editButton.addEventListener('click', () => editMember(memberId));

      // Add click event listener for the "Delete" button
      const deleteButton = memberDiv.querySelector('.delete-btn');
      deleteButton.addEventListener('click', () => deleteMember(memberId));
    });
  }



  async function editMember(memberId) {
    try {
      // Fetch the member data based on memberId
      const memberRef = doc(db, 'members', memberId);
      const memberDoc = await getDoc(memberRef);
  
      if (memberDoc.exists()) {
        const memberData = memberDoc.data();
  
        // Create the edit form div
        const editFormContainer = createEditForm(memberData);
        const editForm = editFormContainer.querySelector('form'); // Declare editForm here
  
        // Add the edit form container to the document body or any other container
        document.getElementById('editMemberContainer').innerHTML = '';
        document.getElementById('editMemberContainer').appendChild(editFormContainer);
  
        // Add submit event listener for the edit form
        editForm.addEventListener('submit', async (event) => {
          event.preventDefault();
  
          // Get updated member data from the form
          const updatedMemberData = {
            firstName: editForm.firstName.value,
            lastName: editForm.lastName.value,
            email: editForm.email.value,
            yearSection: editForm.yearSection.value,
            // Add other fields as needed
          };
  
          // Update the member in the database
          await updateMember(memberId, updatedMemberData);
  
          // Fetch and display members after editing
          const members = await fetchMembers();
          displayMembers(members);
  
          // Clear the edit form container
          document.getElementById('editMemberContainer').innerHTML = '';
        });
      } else {
        console.error("Member not found for editing.");
        alert("Member not found for editing. Please try again.");
      }
    } catch (error) {
      console.error('Error editing member: ', error);
      alert('Failed to edit member. Please try again.');
    }
  }
  
function createEditForm(memberData) {
  const editFormContainer = document.createElement('div');
  editFormContainer.id = 'editFormContainer'; // Optional: Add an ID to the container for styling or other purposes

  const editForm = document.createElement('form');
  editForm.innerHTML = `
    <label for="firstName">First Name:</label>
    <input type="text" id="firstName" name="firstName" value="${memberData.firstName}" required><br>

    <label for="lastName">Last Name:</label>
    <input type="text" id="lastName" name="lastName" value="${memberData.lastName}" required><br>

    <label for="email">Email:</label>
    <input type="email" id="email" name="email" value="${memberData.email}" required><br>

    <label for="yearSection">Year/Section:</label>
    <input type="text" id="yearSection" name="yearSection" value="${memberData.yearSection}" required><br>

    <!-- Add other fields as needed -->

    <button type="submit" class="btn btn-primary">Save</button>
  `;

  // Append the form to the container
  editFormContainer.appendChild(editForm);

  return editFormContainer;
}

// Function to update a member
async function updateMember(memberId, updatedMemberData) {
  const memberRef = doc(db, 'members', memberId);

  try {
    await updateDoc(memberRef, updatedMemberData);
    console.log('Member successfully updated!');
  } catch (error) {
    console.error('Error updating member: ', error);
    throw error;
  }
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


// Call the fetchAndDisplayMembers function to initially load members
fetchAndDisplayMembers();
// Function to open the create post modal
function openCreatePostModal() {
  // Add any additional logic you need here
  if ($('#exampleModal').modal) {
    $('#exampleModal').modal('show');
  } else {
    console.error("Function 'openCreatePostModal' not available in this context.");
    // Handle it as an exception, show an alert, or perform alternative actions
  }
}


  // Function to handle image preview
  function previewImage(input) {
    // ... (your existing code)
  }

  function createPost() {
    var caption = document.getElementById('exampleFormControlTextarea1').value;
    var fileInput = document.getElementById('image-input');
    var file = fileInput.files[0];
  
    if (file && caption) {
      console.log('Caption:', caption);
      console.log('File:', file);
  
      var storage = getStorage(app);
      var storageRef = ref(storage, 'images/' + file.name);
      var task = uploadBytes(storageRef, file);
  
      // Use task.catch to catch any errors during the upload
      task.catch(error => {
        console.error('Error during upload: ', error);
      });
  
      task.then(snapshot => {
        return getDownloadURL(snapshot.ref);
      })
      .then(downloadURL => {
        console.log('Download URL:', downloadURL);
  
        return addDoc(collection(db, 'posts'), {
          caption: caption,
          imageUrl: downloadURL,
          timestamp: new Date(),
        });
      })
      .then(docRef => {
        console.log('Post added with ID: ', docRef.id);
        $('#exampleModal').modal('hide');
        fetchAndDisplayPosts();
      })
      .catch(error => {
        console.error('Error adding post: ', error);
      });
    } else {
      console.log('File or caption is missing.');
    }
  }
  


 
  document.addEventListener("DOMContentLoaded", function () {
    // Attach the createPost function to the "Create post" button
  document.getElementById('create-post-button').addEventListener('click', function() {
    openCreatePostModal();
  });

  });

// Clear preview and alt attribute when the modal is shown
$('#exampleModal').on('shown.bs.modal', function () {
  document.getElementById('image-input').value = ''; // Clear the file input
  document.getElementById('image-preview').src = ''; // Clear the preview
  document.getElementById('image-preview').alt = ''; // Clear the alt attribute
  document.getElementById('exampleFormControlTextarea1').value = ''; // Clear the caption input
});

document.getElementById('upload-post-button').addEventListener('click', function() {
  createPost(); // Call the createPost function when the button is clicked
});

  
// Fetch and display posts function
async function fetchAndDisplayPosts() {
  try {
    const posts = await fetchMembers();
    displayMembers(posts);
} catch (error) {
    console.error("Error fetching and displaying posts: ", error);
}

  try {
    const postsCollection = collection(db, 'posts');
    const postsSnapshot = await getDocs(postsCollection);
    const postsList = [];

    postsSnapshot.forEach((doc) => {
      const postData = doc.data();
      // Add the document ID to the postData
      postData.id = doc.id;
      postsList.push(postData);
    });

    if (postsList.length === 0) {
      console.log('No posts to display.');
    } else {
      console.log('Posts:', postsList); // Log the fetched posts
    }

    displayPosts(postsList);
  } catch (error) {
    console.error("Error fetching posts: ", error);
  }
}


// Call this function to fetch and display posts on page load
document.addEventListener("DOMContentLoaded", function () {
  fetchAndDisplayPosts();
});

// Display posts function
function displayPosts(posts) {
  const postsContainer = document.getElementById('postsContainer');

  // Check if postsContainer is null or undefined
  if (!postsContainer) {
    console.error('Posts container not found.');
    return;
  }

  // Clear existing content
  postsContainer.innerHTML = '';

  // Check if posts exist
  if (posts.length === 0) {
    console.log('No posts to display.');
    return;
  }

  // Display each post
  posts.forEach((post) => {
    const postDiv = document.createElement('div');
    const postId = post.id;
    postDiv.innerHTML = `
      <div class="postConfig">
         <div class="adminProfile">
         <img src="https://cdn1.vectorstock.com/i/1000x1000/36/15/businessman-character-avatar-isolated-vector-12613615.jpg" style="width:40px; border-radius:120%;">
         <h5>Admin</h5>
         </div>
         
          <p style="margin-left:20%;">${post.caption}</p>
          <img style="border-radius:20px; margin:10px;" src="${post.imageUrl}" alt="Post Image"><br>
          <div class="postBtn">
          <a class="btn btn-primary">Like 👍</a>
          <a class="btn btn-success">Comment 💭</a>
          </div>
      </div>
    `;
    postsContainer.appendChild(postDiv);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  fetchAndDisplayPosts();
});


