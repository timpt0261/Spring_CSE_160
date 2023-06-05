// Create the scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Create renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Create geometry for the room
const roomWidth = 10;
const roomHeight = 11;
const roomDepth = 60;

const room = createRoom(roomWidth,roomHeight, roomDepth, scene);

// Create bottle geometry
const bottleGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 6);
const bottleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const bottle = new THREE.Mesh(bottleGeometry, bottleMaterial);
bottle.position.y = 0.5; // Adjust the bottle's position to be above the floor
scene.add(bottle);

// Set initial camera position and look at the bottle
camera.position.set(0, 0, -29);
camera.lookAt(bottle.position);

const directionalLight = new THREE.DirectionalLight(0x121212, 0.5);
scene.add(directionalLight);

// Create ambient light
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Create a point light
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(0, 1, 1); // Position the light above the bottle

// Add point light to the scene
scene.add(pointLight);

// Function to animate the scene
function animate() {
    requestAnimationFrame(animate);

    // Update the OrbitControls
    controls.update();

    // Render the scene
    renderer.render(scene, camera);
}

// Call animate function to start rendering
animate();

// Initialize dat.GUI
const gui = new dat.GUI();

// Create object to store GUI controls
const guiControls = {
    backgroundColor: "#ffffff",
    directionalLightColor: "#121212",
};

// Create GUI control for background color
gui.addColor(guiControls, "backgroundColor").name("Background Color").onChange(function (color) {
    renderer.setClearColor(color);
});

// Create GUI control for directional light color
gui.addColor(guiControls, "directionalLightColor").name("Directional Light Color").onChange(function (color) {
    directionalLight.color.set(color);
});
