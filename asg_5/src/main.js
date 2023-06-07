
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

// Create geometry for the room
let roomWidth = 15;
let roomHeight = 10;
let roomDepth = 100;


// Create Global Spotlight for Room
const spotlightColor = 0x8C602A;
const spotlightDistance = 30;
const spotlightAngle = Math.PI / 4;

let roomSpotlight = new THREE.SpotLight(0x8C602A);

roomSpotlight.distance = spotlightDistance;
roomSpotlight.angle = spotlightAngle;


let room = new Room(roomWidth, roomHeight, roomDepth, scene);
const floorURL = "../public/textures/floor_texture.jpg";
const wallURL = "../public/textures/wall_texture.jpg";
const ceilingURL = "../public/textures/wall_texture.jpg"
room.createRoom(true, floorURL, wallURL, ceilingURL);

// Set initial camera position and look at the 
camera.position.set(0, 0, -50);

// Create ambient light
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);



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


const gui = new dat.GUI();

const spotlightParm = {
    color: roomSpotlight.color.getStyle(),
    intensity: roomSpotlight.intensity,
    distance: roomSpotlight.distance,
    angle: roomSpotlight.angle,
    penumbra: roomSpotlight.penumbra,
    decay: roomSpotlight.decay,
    focus: roomSpotlight.shadow.focus,
    shadows: true,
};

// GUI for Spotlight
const spotlightFolder = gui.addFolder('Spotlights');
spotlightFolder.addColor(spotlightParm, 'color').name('Color').onChange(function (val) {
    roomSpotlight.color.setStyle(val);
    room.deleteRoom();
    room.createRoom(true, floorURL, wallURL, ceilingURL);;
});
spotlightFolder.add(spotlightParm, 'intensity', 0, 1).name('Intensity').onChange(function (val) {
    roomSpotlight.intensity = val;
    room.deleteRoom();
    room.createRoom(true, floorURL, wallURL, ceilingURL);;
});
spotlightFolder.add(spotlightParm, 'distance', 0, 200).name('Distance').onChange(function (val) {
    roomSpotlight.distance = val;
    room.deleteRoom();
    room.createRoom(true, floorURL, wallURL, ceilingURL);;
});
spotlightFolder.add(spotlightParm, 'angle', 0, Math.PI / 2).name('Angle').onChange(function (val) {
    roomSpotlight.angle = val;
    room.deleteRoom();
    room.createRoom(true, floorURL, wallURL, ceilingURL);;
});
spotlightFolder.add(spotlightParm, 'penumbra', 0, 1).name('Penumbra').onChange(function (val) {
    roomSpotlight.penumbra = val;
    room.deleteRoom();
    room.createRoom(true, floorURL, wallURL, ceilingURL);;
});
spotlightFolder.add(spotlightParm, 'decay', 0, 2).name('Decay').onChange(function (val) {
    roomSpotlight.decay = val;
    room.deleteRoom();
    room.createRoom(true, floorURL, wallURL, ceilingURL);;
});
spotlightFolder.add(spotlightParm, 'focus', 0, 1).name('Focus').onChange(function (val) {
    roomSpotlight.shadow.focus = val;
    room.deleteRoom();
    room.createRoom(true, floorURL, wallURL, ceilingURL);;
});
spotlightFolder.add(spotlightParm, 'shadows').name('Shadows').onChange(function (val) {
    roomSpotlight.castShadow = val;
    room.deleteRoom();
    room.createRoom(true, floorURL, wallURL, ceilingURL);;
});

spotlightFolder.open();




