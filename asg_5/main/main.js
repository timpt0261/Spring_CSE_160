// Create the scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create bottle geometry
const bottleGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 6);
const bottleMaterial = new THREE.MeshBasicMaterial({ color: 0xa0fa20 });
const bottle = new THREE.Mesh(bottleGeometry, bottleMaterial);

// Add bottle to the scene
scene.add(bottle);

// Create ambient light
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Create a point light
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(0, 1, 1); // Position the lightbulb above the bottle

// Add point light to the scene
scene.add(pointLight);

// Function to animate the scene
function animate() {
    requestAnimationFrame(animate);

    // Render the scene
    renderer.render(scene, camera);
}

// Call animate function to start rendering
animate();
