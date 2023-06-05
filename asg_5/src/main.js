// Create the scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
scene.background = new THREE.Color().setHSL(0.6, 0, 1);
scene.fog = new THREE.Fog(scene.background, 1, 5000);

// Create renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);



// LIGHTS

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
hemiLight.color.setHSL(0.6, 1, 0.6);
hemiLight.groundColor.setHSL(0.095, 1, 0.75);
hemiLight.position.set(0, 50, 0);
scene.add(hemiLight);

const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
scene.add(hemiLightHelper);


const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.color.setHSL(0.1, 1, 0.95);
dirLight.position.set(- 1, 1.75, 1);
dirLight.position.multiplyScalar(30);
scene.add(dirLight);

dirLight.castShadow = true;

dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;

const d = 50;

dirLight.shadow.camera.left = - d;
dirLight.shadow.camera.right = d;
dirLight.shadow.camera.top = d;
dirLight.shadow.camera.bottom = - d;

dirLight.shadow.camera.far = 3500;
dirLight.shadow.bias = - 0.0001;

const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 10);
scene.add(dirLightHelper);

// Create geometry for the room
const roomWidth = 10;
const roomHeight = 10;
const roomDepth = 100;

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


// Initialize dat.GUI
const gui = new dat.GUI();

// Create object to store GUI controls
const room_gui_Controls = {
    roomWidth: roomWidth,
    roomHeight: roomHeight,
    roomDepth: roomDepth,
};

// Create GUI control for room width
gui.add(room_gui_Controls, "roomWidth", 5, 15)
    .name("Room Width")
    .onChange(function (value) {
        roomWidth = value;
        deleteRoom(room);
        room = createRoom(roomWidth, roomHeight, roomDepth, scene);
        animate();
    });

// Create GUI control for room height
gui.add(room_gui_Controls, "roomHeight", 5, 15)
    .name("Room Height")
    .onChange(function (value) {
        roomHeight = value;
        deleteRoom(room);
        room = createRoom(roomWidth, roomHeight, roomDepth, scene);
        animate();
    });

// Create GUI control for room depth
gui.add(room_gui_Controls, "roomDepth", 10, 120)
    .name("Room Depth")
    .onChange(function (value) {
        roomDepth = value;
        deleteRoom(room);
        room = createRoom(roomWidth, roomHeight, roomDepth, scene);
        animate();
        
    });

// Call animate function to start rendering
animate();
