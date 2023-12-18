// posts.js
// Import necessary Firebase modules
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore";

// Import Firebase app and db
import { app, db } from "./firebase.js";  // Update the path if needed

// Fetch and display posts function
async function fetchAndDisplayPosts() {
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
                <img style="border-radius:20px; margin:10px;" src="${post.imageUrl}" alt="Post Image"><br>
                <p>Caption: ${post.caption}</p>
                <hr>
            </div>
        `;
        postsContainer.appendChild(postDiv);
    });
}

// Call this function to fetch and display posts on page load
document.addEventListener("DOMContentLoaded", function () {
    fetchAndDisplayPosts();
});

// Export any variables or functions if needed
export { app };
