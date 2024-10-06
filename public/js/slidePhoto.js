const images = [
    "/images/army.jpg",
    "/images/air_force.jpg",
    "/images/navy.jpg"
];

let currentImageIndex = 0;

// Function to change the image every 3 seconds
function changeImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length; // Cycle through images
    document.getElementById("mainImage").src = images[currentImageIndex]; // Change the image
}

// Change the image every 3 seconds
setInterval(changeImage, 3000);