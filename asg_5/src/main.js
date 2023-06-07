
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


// // GROUND

// const groundGeo = new THREE.PlaneGeometry(10000, 10000);
// const groundMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
// groundMat.color.setHSL(0.095, 1, 0.75);

// const ground = new THREE.Mesh(groundGeo, groundMat);
// ground.position.y = - 33;
// ground.rotation.x = - Math.PI / 2;
// ground.receiveShadow = true;
// scene.add(ground);

// Create Global Spotlight for Room




// Create geometry for the room
let roomWidth = 15;
let roomHeight = 10;
let roomDepth = 100;



const spotlightColor = 0x8C602A;
const spotlightDistance = 30;
const spotlightAngle = Math.PI / 4;

const roomSpotlight = new THREE.SpotLight(0x8C602A);
roomSpotlight.distance = spotlightDistance;
roomSpotlight.angle = spotlightAngle;


let room = new Room(roomWidth,roomHeight,roomDepth,scene);
room.createRoom(true, "../public/textures/floor_texture.jpg", "../public/textures/wall_texture.jpg", "../public/textures/wall_texture.jpg");

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




