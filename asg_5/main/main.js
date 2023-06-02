// // Create the scene, camera, and renderer
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// // Create a geometry (cube) and material
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// // Position the camera
// camera.position.z = 5;

// // Create an animation loop
// function animate() {
//     requestAnimationFrame(animate);

//     // Rotate the cube
//     cube.rotation.x += 0.01;
//     cube.rotation.y += 0.01;

//     // Render the scene with the camera
//     renderer.render(scene, camera);
// }

// // Start the animation loop
// animate();


// // Import required Three.js modules
// import * as THREE from 'three';

// Create the scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create booth geometry
const boothGeometry = new THREE.BoxGeometry(1, .5, 2);
const boothMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
const booth = new THREE.Mesh(boothGeometry, boothMaterial);

// Add booth to the scene
scene.add(booth);

// Create lightbulb
const lightbulbGeometry = new THREE.SphereGeometry(0.1, 16, 16);
const lightbulbMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const lightbulb = new THREE.Mesh(lightbulbGeometry, lightbulbMaterial);
lightbulb.position.set(0, 1, 1); // Position the lightbulb above the booth

// Add lightbulb to the scene
scene.add(lightbulb);

// Create ambient light
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Create a point light
const pointLight = new THREE.PointLight(0xffffff, 0.3);
pointLight.position.set(0, 1, 1); // Position the lightbulb above the booth

// Add point light to the scene
scene.add(pointLight);

// Function to animate the scene
function animate() {
    requestAnimationFrame(animate);

    // Rotate the booth
    booth.rotation.y += 0.01;

    // Render the scene
    renderer.render(scene, camera);
}

// Call animate function to start rendering
animate();
