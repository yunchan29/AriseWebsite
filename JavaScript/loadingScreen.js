document.addEventListener("DOMContentLoaded", function () {
    // Display loading screen
    showLoadingScreen();

    // Fetch data from the database
    fetchDataFromDatabase()
        .then((data) => {
            // Process your data here
            console.log("Data fetched:", data);

            // Hide loading screen
            hideLoadingScreen();
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
