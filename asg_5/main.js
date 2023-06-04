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
const roomWidth = 8;
const roomHeight = 4;
const roomDepth = 8;

const floorGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth);
const wallGeometry = new THREE.PlaneGeometry(roomWidth, roomHeight);

// Create materials for the room
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc });

// Create meshes for the room
const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
floorMesh.rotation.x = -Math.PI / 2; // Rotate the floor to be horizontal
scene.add(floorMesh);

const wallMesh1 = new THREE.Mesh(wallGeometry, wallMaterial);
wallMesh1.position.y = roomHeight / 2;
wallMesh1.position.z = -roomDepth / 2;
scene.add(wallMesh1);

const wallMesh2 = new THREE.Mesh(wallGeometry, wallMaterial);
wallMesh2.position.y = roomHeight / 2;
wallMesh2.position.z = roomDepth / 2;
wallMesh2.rotation.y = Math.PI;
scene.add(wallMesh2);

// Create bottle geometry
const bottleGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 6);
const bottleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const bottle = new THREE.Mesh(bottleGeometry, bottleMaterial);
bottle.position.y = 0.5; // Adjust the bottle's position to be above the floor
scene.add(bottle);

// Set initial camera position and look at the bottle
camera.position.set(0, 1, 5);
camera.lookAt(bottle.position);

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
