
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getFirestore, collection, getDocs, getDoc, doc, deleteDoc, updateDoc,addDoc, setDoc} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
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


const app = initializeApp(firebaseConfig);


const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


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

// Add keypress event listener for the "Enter" key
document.addEventListener('DOMContentLoaded', function () {
  const adminPasswordInput = document.getElementById('adminPassword');

  adminPasswordInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      // "Enter" key is pressed, trigger the login function
      logInAdmin();
    }
  });
});


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
            <p>Program/Course: ${member.yearSection}</p>
            
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
    <label class="form-label" for="firstName">First Name:</label>
    <input type="text" id="firstName" class="form-control" name="firstName" value="${memberData.firstName}" required>

    <label for="lastName">Last Name:</label>
    <input type="text" id="lastName" class="form-control" name="lastName" value="${memberData.lastName}" required>

    <label for="email">Email:</label>
    <input type="email" id="email" class="form-control" name="email" value="${memberData.email}" required>

    <label for="yearSection">Year/Section:</label>
    <input type="text" id="yearSection" class="form-control" name="yearSection" value="${memberData.yearSection}" required>

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


//fetchHeader

// Fetch header content function
async function fetchHeaderContent() {
  try {
    console.log('Fetching header content...');
    const headerDoc = await getDoc(doc(db, 'header', 'headerDocument'));
    
    if (headerDoc.exists()) {
      const headerData = headerDoc.data();
      console.log('Header data:', headerData);
      updateHeaderContent(headerData);
    } else {
      console.error("Header document not found.");
    }
  } catch (error) {
    console.error("Error fetching header content: ", error);
  }
}


// Update header content function
function updateHeaderContent(headerData) {
  const dynamicHeader = document.getElementById('dynamicHeader');
  if (dynamicHeader) {
    dynamicHeader.innerHTML = `
    <div class="container-fluid w-100 vh-100 d-flex flex-column justify-content-center align-items-left text-white fs-4">
    <div class="headerContainer container-fluid">
    <img class="img-fluid" src="${headerData.imageUrl}" class="headerImage" style="width:20rem; border-radius:20px; max-height:40rem;  box-shadow: #3a02dd 0 10px 20px -10px;" alt="header_logo">
      <div class="headerWrap">
      <div class="headerTitle">
        <h2 class="cursiveFont">${headerData.title}</h2>
      </div>
   
      <p>${headerData.description}</p>
      <button class="button-34"><a href=#news>Check out now!</a></button>
      </div>
      </div>
      </div>
    `;
  } else {
    console.error("Dynamic header container not found.");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  console.log('DOM content loaded.');
  fetchHeaderContent(); // Ensure this is called
});




// Input Form for Update Header Content Function

// Add event listener to the form for updating header
document.getElementById('headerForm').addEventListener('submit', function (event) {
  event.preventDefault();

  // Get values from the form
  const title = document.getElementById('titleInput').value;
  const description = document.getElementById('descriptionInput').value;

  const imageInput = document.getElementById('imageInput');
  const imageFile = imageInput.files[0];

  // Update header content in Firestore
  updateHeaderInFirestore(title, description, imageFile);
});

// Function to update header content in Firestore
async function updateHeaderInFirestore(title, description, imageFile) {
  try {
    const headerDocRef = doc(db, 'header', 'headerDocument');

    // Check if an image file is provided
    let imageUrl = null;
    if (imageFile) {
      const storageRef = ref(storage, 'headerImages/' + imageFile.name);
      const task = uploadBytes(storageRef, imageFile);

      // Wait for the upload to complete and get the download URL
      const snapshot = await task;
      imageUrl = await getDownloadURL(snapshot.ref);
    }

    const headerData = {
      title: title,
      description: description,
      imageUrl: imageUrl,
    };

    await setDoc(headerDocRef, headerData, { merge: true });
    console.log('Header content updated successfully!');
    alert('Header content updated successfully!');
  } catch (error) {
    console.error('Error updating header content:', error);
    // Handle error appropriately
  }
}

// Fetch and display header content function
async function fetchAndDisplayHeaderContent() {
  try {
    const headerDoc = await getDoc(doc(db, 'header', 'headerDocument'));
    if (headerDoc.exists()) {
      const headerData = headerDoc.data();
      updateHeaderContent(headerData);
    } else {
      console.error("Header document not found.");
    }
  } catch (error) {
    console.error("Error fetching header content: ", error);
  }
}

// Call the fetchAndDisplayHeaderContent function to initially load header content
fetchAndDisplayHeaderContent();


document.addEventListener("DOMContentLoaded", function () {
  // Display loading screen
  showLoadingScreen();

  // Fetch data from the database
  fetchDataFromDatabase()
      .then((data) => {
          // Process your data here
          console.log("Data fetched:", data);

          // Hide loading screen if DOM content is loaded
          if (document.readyState === "complete") {
              hideLoadingScreen();
          } else {
              document.addEventListener("readystatechange", function () {
                  if (document.readyState === "complete") {
                      hideLoadingScreen();
                  }
              });
          }
      })
      .catch((error) => {
          console.error("Error fetching data:", error);

          // Handle errors and hide loading screen
          hideLoadingScreen();
      });
});

function showLoadingScreen() {
  // Show loading screen
  const loadingScreen = document.getElementById("loading-screen");
  loadingScreen.style.display = "flex";
}

function hideLoadingScreen() {
  // Hide loading screen
  const loadingScreen = document.getElementById("loading-screen");
  loadingScreen.style.display = "none";
}

function fetchDataFromDatabase() {
  // Simulate a fetch operation (replace with your actual fetch logic)
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          // Simulating a successful data fetch
          resolve("Database data goes here");
          // If there's an error, use reject(error)
      }, 2000); // Simulating a 2-second fetch time
  });
}
//NEWS
// Reference to the Firestore collection
const newsCollection = collection(db, 'news');

// Reference to the container in which news items will be appended
const newsContainer = document.getElementById('newsContainer');
// Apply styles directly to the container
newsContainer.style.display = 'flex';
newsContainer.style.flexWrap = 'wrap';

// Fetch news data from Firestore
getDocs(newsCollection).then((querySnapshot) => {
  console.log('Fetching news data from Firestore...');
  querySnapshot.forEach((doc) => {
    const newsItem = doc.data();
    createNewsItem(newsItem);
  });
});

// Function to create a news item and append it to the container
function createNewsItem(newsItem) {
  // Create a column div
  const column = document.createElement('div');
  // Apply styles directly using the style property
  column.style.flex = '0 0 33.33%'; // 3 columns in a row
  column.style.maxWidth = '33.33%';
  column.style.padding = '0 5px';

  // Create a link with the news image
  const link = document.createElement('a');
  link.href = newsItem.link; // Replace 'link' with the actual field in your Firestore document
  link.target = '_blank';

  // Create an image element
  const image = document.createElement('img');
  image.className = 'newsImg';
  image.src = newsItem.imageUrl; // Replace 'imageUrl' with the actual field in your Firestore document
  image.alt = '';

  // Apply styles directly to the image
  image.style.marginTop = '15px';
  image.style.verticalAlign = 'middle';
  image.style.width = '80%';

  // Append the image to the link, and the link to the column
  link.appendChild(image);
  column.appendChild(link);

  // Append the column to the news container
  newsContainer.appendChild(column);
}



// Reference to the image upload form
const imageUploadForm = document.getElementById('imageUploadForm');

imageUploadForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const imageTitle = document.getElementById('imageTitle').value;
  const imageFile = document.getElementById('imageFile').files[0];

  if (!imageTitle || !imageFile) {
    alert('Please provide both title and image file.');
    console.warn('Title or image file missing. Aborting image upload.');
    return;
  }

  // Create a unique filename for the image
  const timestamp = new Date().getTime();
  const fileName = `${timestamp}_${imageFile.name}`;

  // Reference to the Storage path where the image will be stored
  const storageRef = ref(storage, `news_images/${fileName}`);

  try {
    // Upload the image to Storage
    await uploadBytes(storageRef, imageFile);

    // Get the download URL of the uploaded image
    const downloadURL = await getDownloadURL(storageRef);

    // Save image details to Firestore Database
    await addDoc(newsCollection, {
      link: '#', // Add the appropriate link
      imageUrl: downloadURL,
    });

    console.log('Image uploaded successfully!');
    alert('Image uploaded successfully!');

    // Clear the form
    imageUploadForm.reset();

    // Fetch and display updated news content
    fetchNews();
  } catch (error) {
    console.error('Error uploading image:', error.message);
    alert('Error uploading image. Please try again.');
  }
});

// Additional check to prevent form submission elsewhere in the code
document.getElementById('imageUploadForm').addEventListener('submit', function (e) {
  e.preventDefault();
});

// Function to fetch and display news from Firestore
async function fetchNews() {
  console.log('Fetching and displaying news...');
  newsContainer.innerHTML = '';

  try {
    const newsCollection = collection(db, 'news');
    const newsSnapshot = await getDocs(newsCollection);

    newsSnapshot.forEach((doc) => {
      const newsItem = doc.data();
      createNewsItem(newsItem);
    });
  } catch (error) {
    console.error('Error fetching news:', error);
  }
}
