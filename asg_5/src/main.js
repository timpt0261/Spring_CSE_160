// Create the scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
scene.background = new THREE.Color().setHSL(0.6, 0, 0);
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

// GROUND

const groundGeo = new THREE.PlaneGeometry(10000, 10000);
const groundMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
groundMat.color.setHSL(0.095, 1, 0.75);

const ground = new THREE.Mesh(groundGeo, groundMat);
ground.position.y = - 33;
ground.rotation.x = - Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Create geometry for the room
let roomWidth = 10;
let roomHeight = 10;
let roomDepth = 100;

let room = createRoom(roomWidth,roomHeight, roomDepth, scene);

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

// GUI for Hemisphere Light
const hemisphereLightFolder = gui.addFolder('Hemisphere Light');
hemisphereLightFolder.addColor(hemiLight, 'color').name('Color');
hemisphereLightFolder.addColor(hemiLight, 'groundColor').name('Ground Color');
hemisphereLightFolder.add(hemiLight, 'intensity', 0, 1).name('Intensity');
hemisphereLightFolder.open();

// GUI for Directional Light
const directionalLightFolder = gui.addFolder('Directional Light');
directionalLightFolder.addColor(dirLight, 'color').name('Color');
directionalLightFolder.add(dirLight, 'intensity', 0, 2).name('Intensity');
directionalLightFolder.add(dirLight.position, 'x', -100, 100).name('X Position');
directionalLightFolder.add(dirLight.position, 'y', -100, 100).name('Y Position');
directionalLightFolder.add(dirLight.position, 'z', -100, 100).name('Z Position');
directionalLightFolder.open();

// GUI for Point Light
const pointLightFolder = gui.addFolder('Point Light');
pointLightFolder.addColor(pointLight, 'color').name('Color');
pointLightFolder.add(pointLight, 'intensity', 0, 2).name('Intensity');
pointLightFolder.add(pointLight.position, 'x', -100, 100).name('X Position');
pointLightFolder.add(pointLight.position, 'y', -100, 100).name('Y Position');
pointLightFolder.add(pointLight.position, 'z', -100, 100).name('Z Position');
pointLightFolder.open();

const room_GUI_Controls = {
    width: roomWidth,
    height: roomHeight,
    depth: roomDepth
};

const roomGUI = new dat.GUI();

const roomDimensions = roomGUI.addFolder("Room DImesions");
roomDimensions.add(room_GUI_Controls, "width", 2, 15).name("Room's Width");
roomDimensions.add(room_GUI_Controls, "height", 2, 15).name("Room's Height");
roomDimensions.add(room_GUI_Controls, "depth", 10, 120).name("Room's Depth");
roomDimensions.open();

roomWidth = room_GUI_Controls.width;
// room = deleteRoom();
room = createRoom(roomWidth, roomHeight, roomDepth, scene);
