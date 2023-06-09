// Credit: Aaron Brunckhurst-Fust in Hall of Fame
// https://people.ucsc.edu/~dbrunckh/CSE160-Worldv8/world.html

// Vertex shader program
var VSHADER_SOURCE =
    `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotationMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix  * u_ViewMatrix * u_GlobalRotationMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = a_Normal;
    v_VertPos = u_ModelMatrix * a_Position;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform vec4 u_FragColor;

  uniform sampler2D u_SamplerN;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform int u_whichTexture;
  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos;
  varying vec4 v_VertPos;
  uniform bool u_lightOn;

  // Define the spotlight properties
  uniform bool u_spotlightOn;
  uniform vec3 u_spotlightPos;
  uniform vec3 u_spotlightDirection;
  uniform float u_spotlightAngle;
  uniform vec3 u_spotlightColor;
  uniform float u_spotlightIntensity;

  void main() {
    if(u_whichTexture == -3){
        gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0); // Use Normal
    }
    else if(u_whichTexture == -2){
        gl_FragColor = u_FragColor; // Use color
    }
    else if(u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV, 1.0, 1.0); // Use UV Debug color
    }
    else if(u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV); // Use texture0
    }
    else if(u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV); // Use texture1
    }
    else if(u_whichTexture == 2) {
      gl_FragColor = texture2D(u_Sampler2, v_UV); // Use texture2
    }
    else if(u_whichTexture == 3) {
      vec3 brown = vec3(0.38, 0.14, 0.01);
      vec3 color = mix(vec3(v_UV, 1.0), brown, 0.9); // Use brown color mixer
      gl_FragColor = vec4(color, 1.0);
    }  
    else if(u_whichTexture == 8) {
      vec3 white = vec3(0.8, 0.9, 0.8);
      vec3 color = mix(vec3(v_UV, 1.0), white, 0.9); // Use white color mixer
      gl_FragColor = vec4(color, 1.0);
    }
    else {
      gl_FragColor = vec4(1,.2,.2,1); // Error 
    }

    vec3 lightVector = u_lightPos - vec3(v_VertPos);
    float r = length(lightVector);

    // N dot L 
    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);
    float nDotL = max(dot(N, L), 0.0);

    // Reflection
    vec3 R = reflect(-L, N);

    // Eye
    vec3 E = normalize(u_cameraPos - vec3(v_VertPos));

    // Specular 
    float specular = pow(max(dot(E, R), 0.0), 64.0) * 0.8;

    vec3 diffuse = vec3(1.0, 1.0, 0.9) * vec3(gl_FragColor) * nDotL * 0.7;
    vec3 ambient = vec3(gl_FragColor) * 0.2;

    // Apply spotlight if it is turned on
    if (u_lightOn && u_spotlightOn) {
      // Calculate the vector from the current fragment to the spotlight position
      vec3 spotlightVector = u_spotlightPos - vec3(v_VertPos);

      // Calculate the distance from the current fragment to the spotlight
      float spotlightDistance = length(spotlightVector);

      // Calculate the direction from the current fragment to the spotlight
      vec3 spotlightDirection = normalize(spotlightVector);

      // Calculate the angle between the spotlight direction and the fragment's normal
      float spotlightAngle = acos(dot(N, -spotlightDirection));

      // Check if the fragment is within the spotlight cone
      if (spotlightDistance < r && spotlightAngle < u_spotlightAngle) {
        // Calculate the falloff factor based on the angle
        float falloff = smoothstep(0.0, u_spotlightAngle, spotlightAngle);

        // Calculate the spotlight intensity based on the distance
        float intensity = (u_spotlightIntensity / (spotlightDistance * spotlightDistance));

        // Apply the spotlight color and intensity to the final color
        vec3 spotlightColor = u_spotlightColor * intensity;
        gl_FragColor.rgb *= (falloff * spotlightColor);
      }
    }

    // Apply the lighting calculation without the spotlight
    if (u_lightOn && !u_spotlightOn) {
      if (u_whichTexture == 0) {
        gl_FragColor = vec4(specular + diffuse + ambient, 1.0);
      } else {
        gl_FragColor = vec4(diffuse + ambient, 1.0);
      }
    }
  }`;


const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let a_Normal;
let u_ModelMatrix;
let u_FragColor;
let u_whichTexture;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotationMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_lightPos;
let u_cameraPos;
let u_lightOn;

// New Uniform Variables
let u_spotlightOn;
let u_spotlightPos;
let u_spotlightDirection;
let u_spotlightAngle;
let u_spotlightColor;
let u_spotlightIntensity;

let g_shapesList = [];
let g_spawnPoint = [2, 4, 0];
let g_image = null;
let g_mouseOnCanvas = false;
let g_globalRotationAngle_horizontal = 0;
let g_globalRotationAngle_vertial = 0;
let g_selectedType = POINT;
let g_data = 0;
let g_walkingSpeed_base = 1.5;
let g_walkingSpeed = 1.5;
let g_rotationSpeed = 60.5;
let g_mouse_rotation_speed = 1;

let g_animationsEnabled = true;
let g_playSpecialAnimation = false;
let g_armAngle = 0;
let g_armAngle_two = 0;
let g_tireAngle = 0;
let g_groundOffset = 0;
let g_animationAngle = 0;

let g_legBaseBonus = 0;
let g_legMidBonus = 0;

let g_startTime = performance.now() / 1000.0;
let g_seconds = performance.now() / 1000.0 - g_startTime;
let g_last_x = 0;
let g_deltaTime = 0;
let groundWidth = 16;
let groundLength = 16;
let groundColors = [];
let groundColorsOffset = 0;
let max_samples = 100;
let g_grounded = false;
let g_consumptionEnabled = true;
let g_cheater = false;
let g_winner = false;
let g_winnerPoint = [];

var g_camera = new Camera();

let g_max_view_down = 90;
let g_max_view_up = 90;

let g_gravity = 8;
let g_max_gravity = 8;
let g_jump_volocity = 5;

let g_normalOn = false;
let g_lightOn = true;
let g_lightPos = [3, 2, 2];

// New Global Variables for Spotlight
let g_spotlightOn = false;
let g_spotlightPos = [0, 0, 0];
let g_spotlightDirection = [0, 0, -1];
let g_spotlightAngle = 45;
let g_spotlightColor = [1, 1, 1];
let g_spotlightIntensity = 1;



let is_dead = false;
let timeSurvived = 0;

var velocity = new Vector3([0, 0, 0]); //(horizontal, forward, vertical)
var rotational_velocity = new Vector3([0, 0, 0]); //(horizontal, forward, vertical)

function setupGroundColors() {
    for (y = 0; y < groundLength; y++) {
        var curRow = [];
        for (x = 0; x < groundWidth; x++) {
            curRow.push([0.1 + (x / 10), 0.1 + (y / 10), 0.1, 1.0]);
        }
        groundColors.push(curRow);
    }
}

function setupWebGL() {
    // Retrieve <canvas> element
    canvas = document.getElementById('display');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return false;
    }

    //gl = getWebGLContext(canvas);
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    gl.enable(gl.DEPTH_TEST);
    //gl.depthFunc(gl.LEQUAL)
    //gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
}

function connectVariablesToGLSL() {
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Get the storage location of a_UV
    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (a_UV < 0) {
        console.log('Failed to get the storage location of a_UV');
        return;
    }

    // Get storage Location of a_Normal
    a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
    if (a_Normal < 0) {
        console.log('Failed to get the storage location of a_Normal');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    // Get the storage location of u_lightPos
    u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
    if (!u_lightPos) {
        console.log('Failed to get the storage location of u_lightPos');
        return;
    }

    // Get the storage location of u_lightOn
    u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
    if (!u_lightOn) {
        console.log('Failed to get the storage location of u_lightOn');
        return;
    }

    // Get the storage location of u_cameraPos
    u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
    if (!u_cameraPos) {
        console.log('Failed to get the storage location of u_cameraPos');
        return;
    }

    // Get the storage location of u_whichTexture
    u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
    if (!u_whichTexture) {
        console.log('Failed to get the storage location of u_whichTexture');
        return;
    }

    // Get the storage location of u_ModelMatrix
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    // Get the storage location of u_GlobalRotationMatrix
    u_GlobalRotationMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotationMatrix');
    if (!u_GlobalRotationMatrix) {
        console.log('Failed to get the storage location of u_GlobalRotationMatrix');
        return;
    }

    // Get the storage location of u_ViewMatrix
    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (!u_ViewMatrix) {
        console.log('Failed to get the storage location of u_ViewMatrix');
        return;
    }

    // Get the storage location of u_ProjectionMatrix
    u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    if (!u_ProjectionMatrix) {
        console.log('Failed to get the storage location of u_ProjectionMatrix');
        return;
    }

    // Get the storage location of u_Sampler0
    u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    if (!u_Sampler0) {
        console.log('Failed to get the storage location of u_Sampler0');
        return false;
    }

    // Get the storage location of u_Sampler1
    u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if (!u_Sampler1) {
        console.log('Failed to get the storage location of u_Sampler1');
        return false;
    }

    // Get the storage location of u_Sampler2
    u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
    if (!u_Sampler2) {
        console.log('Failed to get the storage location of u_Sampler2');
        return false;
    }

    // Get the storage location of u_spotlightOn
    u_spotlightOn = gl.getUniformLocation(gl.program, 'u_spotlightOn');
    if (!u_spotlightOn) {
        console.log('Failed to get the storage location of u_spotlightOn');
        return false;
    }

    // Get the storage location of u_spotlightPos
    u_spotlightPos = gl.getUniformLocation(gl.program, 'u_spotlightPos');
    if (!u_spotlightPos) {
        console.log('Failed to get the storage location of u_spotlightPos');
        return false;
    }

    // Get the storage location of u_spotlightDirection
    u_spotlightDirection = gl.getUniformLocation(gl.program, 'u_spotlightDirection');
    if (!u_spotlightDirection) {
        console.log('Failed to get the storage location of u_spotlightDirection');
        return false;
    }

    // Get the storage location of u_spotlightAngle
    u_spotlightAngle = gl.getUniformLocation(gl.program, 'u_spotlightAngle');
    if (!u_spotlightAngle) {
        console.log('Failed to get the storage location of u_spotlightAngle');
        return false;
    }

    // Get the storage location of u_spotlightColor
    u_spotlightColor = gl.getUniformLocation(gl.program, 'u_spotlightColor');
    if (!u_spotlightColor) {
        console.log('Failed to get the storage location of u_spotlightColor');
        return false;
    }

    // Get the storage location of u_spotlightIntensity
    u_spotlightIntensity = gl.getUniformLocation(gl.program, 'u_spotlightIntensity');
    if (!u_spotlightIntensity) {
        console.log('Failed to get the storage location of u_spotlightIntensity');
        return false;
    }

    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
    gl.uniformMatrix4fv(u_ViewMatrix, false, identityM.elements);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, identityM.elements);
}


function initTextures(n) {
    var image0 = new Image(256, 256);
    var image1 = new Image(256, 256);
    var image2 = new Image(256, 256);

    image0.onload = function () { sendTextureToTEXTURE0(image0); }
    image1.onload = function () { sendTextureToTEXTURE1(image1); }
    image2.onload = function () { sendTextureToTEXTURE2(image2); }

    image0.src = '../img/sky_paper.jpg';
    image1.src = '../img/ground.jpg';
    image2.src = '../img/uv_checker.png';


    return true;
}

function sendTextureToTEXTURE0(image0) {
    var texture0 = gl.createTexture();
    if (!texture0) {
        console.log("Failed to create a texture object.");
        return false;
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis.

    gl.activeTexture(gl.TEXTURE0);

    gl.bindTexture(gl.TEXTURE_2D, texture0);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image0);

    gl.uniform1i(u_Sampler0, 0);

    console.log("Finished loading texture0.");
}

function sendTextureToTEXTURE1(image1) {
    var texture1 = gl.createTexture();
    if (!texture1) {
        console.log("Failed to create a texture object.");
        return false;
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis.

    gl.activeTexture(gl.TEXTURE1);

    gl.bindTexture(gl.TEXTURE_2D, texture1);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image1);

    gl.uniform1i(u_Sampler1, 1);

    console.log("Finished loading texture1.");
}

function sendTextureToTEXTURE2(image2) {
    var texture2 = gl.createTexture();
    if (!texture2) {
        console.log("Failed to create a texture object.");
        return false;
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis.

    gl.activeTexture(gl.TEXTURE2);

    gl.bindTexture(gl.TEXTURE_2D, texture2);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image2);

    gl.uniform1i(u_Sampler2, 2);

    console.log("Finished loading texture2.");
}


function clearCanvas() {
    g_shapesList = [];

    renderScene();
}

function convertCoordinatesEventToGL(ev) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

    return ([x, y]);
}

function drawMap(map_2d) {
    var curBlock = new Cube();
    curBlock.color = [1.0, 1.0, 1.0, 1.0];

    for (x = 0; x < 8; x++) {
        for (y = 0; y < 8; y++) {
            if (map_2d[x][y] != 0) {
                curBlock.matrix.setIdentity();
                curBlock.matrix.translate(x - 4, -0.75, y - 4);
                curBlock.render();
            }
        }
    }
}

var g_map = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1]
];

function renderScene() {
    var renderStartTime = performance.now();

    var projMat = new Matrix4();
    projMat.setPerspective(90, canvas.width / canvas.height, 0.1, 200);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

    var viewMat = new Matrix4();
    viewMat.setLookAt(
        g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
        g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2],
        g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]
    );
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

    var currentGlobalRotationMatrix = new Matrix4();
    currentGlobalRotationMatrix.rotate(g_globalRotationAngle_vertial, 1, 0, 0);
    currentGlobalRotationMatrix.rotate(g_globalRotationAngle_horizontal, 0, 1, 0);

    gl.uniformMatrix4fv(u_GlobalRotationMatrix, false, currentGlobalRotationMatrix.elements)

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Pass the light postion to GLSL
    gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);

    // Pass the CameraPos to  GLSL
    gl.uniform3f(u_cameraPos, g_camera.eye.x, g_camera.eye.y, g_camera.eye.z);

    // Pass the light status
    gl.uniform1i(u_lightOn, g_lightOn);


    // Pass the spotlight status and parameters
    gl.uniform1i(u_spotlightOn, g_spotlightOn);
    gl.uniform3f(u_spotlightPos, g_spotlightPos[0], g_spotlightPos[1], g_spotlightPos[2]);
    gl.uniform3f(u_spotlightDirection, g_spotlightDirection[0], g_spotlightDirection[1], g_spotlightDirection[2]);
    gl.uniform1f(u_spotlightAngle, g_spotlightAngle);
    gl.uniform4f(u_spotlightColor, g_spotlightColor[0], g_spotlightColor[1], g_spotlightColor[2], g_spotlightColor[3]);
    gl.uniform1f(u_spotlightIntensity, g_spotlightIntensity);


    if (is_dead) {
        var renderTime_ms = performance.now() - renderStartTime;
        sendTextToHTML("ms: " + Math.floor(renderTime_ms) + "  fps: " + Math.floor((1000.0 / renderTime_ms)), "infoText");
        return;
    }

    var rootMatrix = new Matrix4();
    if (g_animationAngle != 0) {
        rootMatrix.rotate(g_animationAngle, 1, 0, 0);
    }

    var light = new Cube();
    light.color = [0, 0, 2, 1];
    console.log(g_lightPos);
    light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
    light.matrix.scale(.1, .1, .1);
    light.matrix.translate(-.5, -.5, -.5);
    light.render();


    var ground = new Cube();
    ground.color = [1.0, 0.0, 0.0, 1.0];
    ground.textureNum = g_normalOn ? -3 : 0;
    ground.matrix.translate(0, -0.75, 0.0);
    ground.matrix.scale(1.5, 0, 1.5);
    ground.render();

    var skybox = new Cube();
    skybox.color = [1.0, 0.0, 0.0, 1.0];
    skybox.textureNum = g_normalOn ? -3 : 0;
    skybox.matrix.translate(3, 0, 0.0);
    skybox.matrix.scale(8, 8, 8);
    skybox.render();

    var sphere = new Sphere();
    sphere.textureNum = g_normalOn ? -3 : 2;
    sphere.matrix.translate(2, 2, 0);
    sphere.matrix.scale(1.1, 1.1, 1.1);
    sphere.render();

    //drawMap(g_map);
    this.chunk.render(rootMatrix);

    var renderTime_ms = performance.now() - renderStartTime;
    sendTextToHTML("ms: " + Math.floor(renderTime_ms) + "  fps: " + Math.floor((1000.0 / renderTime_ms)), "infoText");

    return;
}

function updateAnimationAngle() {
    if (g_animationsEnabled) {
        g_armAngle = 45 * Math.sin(g_seconds * 4);
        g_armAngle_two = 45 * Math.sin((g_seconds * 4) + 0.5);
        g_tireAngle = (((g_seconds * g_walkingSpeed / 8.0) % 1)) * 360;
        g_groundOffset += (g_deltaTime * g_walkingSpeed);

        if (g_playSpecialAnimation) {
            g_animationAngle += g_deltaTime * g_walkingSpeed * 20;

            if (g_animationAngle > 360) {
                g_animationAngle = 0;
                g_playSpecialAnimation = false;
                sendTextToHTML("", "otherText");
            }
        }
    }

    // g_lightPos[0] = Math.cos(g_seconds) + 2;
}

function degrees_to_radians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}

function tick() {
    var newSeconds = performance.now() / 1000.0 - g_startTime;
    g_deltaTime = newSeconds - g_seconds;
    g_seconds = newSeconds;

    x_mod = Math.sin(degrees_to_radians(g_globalRotationAngle_horizontal));
    z_mod = Math.cos(degrees_to_radians(g_globalRotationAngle_horizontal));

    var x_change = 0;
    var z_change = 0;

    // forward/backward movment
    z_change += (velocity[1] * g_deltaTime * g_walkingSpeed) * Math.sin(degrees_to_radians(g_globalRotationAngle_horizontal));
    x_change += (velocity[1] * g_deltaTime * g_walkingSpeed) * Math.cos(degrees_to_radians(g_globalRotationAngle_horizontal));

    // left/right movement
    z_change += (velocity[0] * g_deltaTime * g_walkingSpeed) * Math.cos(degrees_to_radians(g_globalRotationAngle_horizontal));
    x_change -= (velocity[0] * g_deltaTime * g_walkingSpeed) * Math.sin(degrees_to_radians(g_globalRotationAngle_horizontal));

    g_camera.eye.elements[0] += z_change;
    g_camera.eye.elements[2] -= x_change;

    g_camera.eye.elements[1] += velocity[2] * g_deltaTime;

    // gravity velocity calculations
    velocity[2] = velocity[2] - (g_deltaTime * g_gravity);
    if (velocity[2] < -g_max_gravity) {
        velocity[2] = -g_max_gravity;
    }

    g_globalRotationAngle_horizontal += rotational_velocity[0] * g_deltaTime * g_rotationSpeed;

    var x = Math.round(g_camera.eye.elements[0]);
    var y = Math.round(g_camera.eye.elements[1]);
    var z = Math.round(g_camera.eye.elements[2]);

    var groundExists_below = this.chunk.blockExists(x, y - 1, z);
    var groundExists_at = this.chunk.blockExists(x, y, z);
    if (groundExists_at) {
        g_camera.eye.elements[1] += 1;
    }
    g_grounded = groundExists_below || groundExists_at;
    if (g_grounded === true) {
        if (velocity[2] < 0) {
            velocity[2] = 0;
        }
    }
    else {
        //velocity[2] = -1;
    }


    //    for(var i = 0; i <3;i++){
    //        if (g_camera.elements[i] === g_winnerPoint[i]){
    //         g_winner = true;
    //        }else{
    //         g_winner = false;
    //        }
    //    }

    //    if(g_winner){
    //         console.log("You escaped the maze");
    //    }

    if (g_camera.eye.elements[1] < -10) {
        console.warn("DEATH!");
        if (!is_dead) {
            is_dead = true;

        }
    }

    if (!is_dead) {
        if (!g_cheater) {
            timeSurvived += g_deltaTime;
        }
    }
    else {
        window.location.reload(true);// reloads page on death
    }

    sendTextToHTML("Time Survived: " + timeSurvived.toFixed(2), "timeSurvivedText");

    updateAnimationAngle();

    renderScene();

    requestAnimationFrame(tick);
}

function resizeImageFromURL(imageURL, outputWidth, outputHeight, callback) {
    var img = new Image();
    img.crossOrigin = "Anonymous"; // Enable cross-origin image loading, if required
    img.onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width = outputWidth;
        canvas.height = outputHeight;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, outputWidth, outputHeight);
        var resizedImage = canvas.toDataURL("image/jpeg");
        // You can replace "image/jpeg" with "image/png" for PNG format

        // Invoke the callback with the resized image source
        callback(resizedImage);
    };
    img.src = imageURL;
}


function addEventListeners() {
    // document.getElementById('consumptionCheckbox').addEventListener('change', function () { g_consumptionEnabled = this.checked; g_cheater = true; timeSurvived = 0; });
    document.getElementById('g_gravity').addEventListener("mousemove", function () { g_gravity = this.value; renderScene(); });
    document.getElementById('normalOn').onclick = function () { g_normalOn = true; }
    document.getElementById('normalOff').onclick = function () { g_normalOn = false; }

    document.getElementById('lightOn').onclick = function () { g_lightOn = true; }
    document.getElementById('lightOff').onclick = function () { g_lightOn = false; }

    document.getElementById('light_x').addEventListener("mousemove", function (ev) { if (ev.button == 0) { g_lightPos[0] = Number(this.value) }; renderScene(); });
    document.getElementById('light_y').addEventListener("mousemove", function (ev) { if (ev.button == 0) { g_lightPos[1] = Number(this.value) }; renderScene(); });
    document.getElementById('light_z').addEventListener("mousemove", function (ev) { if (ev.button == 0) { g_lightPos[2] = Number(this.value) }; renderScene(); });
}

function sendTextToHTML(text, htmlID) {
    var htmlElm = document.getElementById(htmlID);
    if (!htmlElm) {
        console.log("Unable to find element: " + htmlID);
        return;
    }
    htmlElm.innerHTML = text;
}

function keydown(ev) {
    //console.log('keydown: ' + ev.keyCode);
    if (ev.keyCode == 39 || ev.keyCode == 68) { // right arrow
        velocity[0] = 1;
    }
    if (ev.keyCode == 37 || ev.keyCode == 65) { // left arrow
        velocity[0] = -1;
    }

    if (ev.keyCode == 38 || ev.keyCode == 87) { // forward arrow
        velocity[1] = 1;
        //g_camera.forward(1);
    }
    if (ev.keyCode == 40 || ev.keyCode == 83) { // backward arrow
        velocity[1] = -1;
    }

    if (ev.keyCode == 81) { // rotation left (q)
        rotational_velocity[0] = -1;
    }
    if (ev.keyCode == 69) { // rotation right (e)
        rotational_velocity[0] = 1;
    }

    if (ev.keyCode == 16) { // shift
        g_walkingSpeed = g_walkingSpeed_base * 2;
    }

    if (ev.keyCode == 32 && g_grounded) { // jump
        velocity[2] = g_jump_volocity;
    }
}

function keyup(ev) {
    //console.log('keyup: ' + ev.keyCode);
    if (ev.keyCode == 39 || ev.keyCode == 68) { // right arrow
        velocity[0] = 0;
    }
    if (ev.keyCode == 37 || ev.keyCode == 65) { // left arrow
        velocity[0] = 0;
    }

    if (ev.keyCode == 38 || ev.keyCode == 87) { // forward arrow
        velocity[1] = 0;
    }
    if (ev.keyCode == 40 || ev.keyCode == 83) { // backward arrow
        velocity[1] = 0;
    }

    if (ev.keyCode == 81) { // rotation left (q)
        rotational_velocity[0] = 0;
    }
    if (ev.keyCode == 69) { // rotation right (e)
        rotational_velocity[0] = 0;
    }

    if (ev.keyCode == 16) { // shift
        g_walkingSpeed = g_walkingSpeed_base;
    }
}

function mousemove(ev) {
    g_globalRotationAngle_horizontal += ev.movementX * g_mouse_rotation_speed;
    g_globalRotationAngle_vertial += ev.movementY * (g_mouse_rotation_speed / 4);
    if (g_globalRotationAngle_vertial < -g_max_view_up) {
        g_globalRotationAngle_vertial = -g_max_view_up;
    }

    if (g_globalRotationAngle_vertial > g_max_view_down) {
        g_globalRotationAngle_vertial = g_max_view_down;
    }
}

function performClick(button) {

    var x = Math.round(g_camera.eye.elements[0]);
    var y = Math.round(g_camera.eye.elements[1]);
    var z = Math.round(g_camera.eye.elements[2]);

    //console.log("g_globalRotationAngle_horizontal: " + g_globalRotationAngle_horizontal);
    //console.log("performClick: " + g_camera.eye.elements[0] + ", " + g_camera.eye.elements[1] + ", " + g_camera.eye.elements[2]);
    //console.log("performClick: " + x + ", " + y + ", " + z);

    var rotation_normalized = (g_globalRotationAngle_horizontal) % 360;
    if (rotation_normalized < 0) {
        rotation_normalized = rotation_normalized + 360;
    }
    var direction = Math.round(rotation_normalized / 90);
    var z_offset = 0;
    var x_offset = 0;
    if (direction == 0) {
        z_offset = -1;
    }
    if (direction == 1) {
        x_offset = 1;
    }
    if (direction == 2) {
        z_offset = 1;
    }
    if (direction == 3) {
        x_offset = -1;
    }


    // if (button == 1) { // left click
    //     this.chunk.deleteBlock(x, y, z);
    //     //this.chunk.deleteBlock(x, y-1, z);

    //     this.chunk.deleteBlock(x + x_offset, y, z + z_offset);
    //     this.chunk.deleteBlock(x + x_offset, y - 1, z + z_offset);
    // }

    // if (button == 2) { // right click
    //     //this.chunk.createBlock(x + x_offset, y, z + z_offset, 16);
    //     this.chunk.createBlock(x + x_offset, y, z + z_offset, 2);
    // }
}

function add_blocks_layers(layers, seperation) {
    for (y = 0; y < layers; y++) {
        for (x = 0; x < 32; x++) {
            for (z = 0; z < 32; z++) {
                this.chunk.createBlock(x, y * seperation, z, 1);
            }
        }
    }
}

function add_maze_block() {
    // this.chunk.createBlock(0,7,0,1); // top-left corner
    // this.chunk.createBlock(31, 7, 0, 1); // top-right corner

    // this.chunk.createBlock(0, 7, 31, 1); // bottom-left corner
    // this.chunk.createBlock(31, 7, 31, 1); // bottom-right corner
    const maze = generateMaze(32, 32);

    for (i = 0; i < maze.length; i++) {
        for (j = 0; j < maze[i].length; j++) {
            if (maze[i][j] === "E") {
                g_winnerPoint = [i, 0, j];
                this.chunk.createBlock(i, g_spawnPoint[2] + 3, j, 0);
            }

            if (maze[i][j] === "#") {
                for (k = 0; k < 3; k++) {
                    this.chunk.createBlock(i, g_spawnPoint[2] + k, j, 3);
                }
            }
        }
    }



}

function testMouse(ev) {
    if (ev.button === 0) {// left mouse buttom
        performClick(1);
    }
    else if (ev.button === 2) { // right mouse button
        performClick(2);
    }
}

function main() {

    setupWebGL();

    connectVariablesToGLSL();

    addEventListeners();

    initTextures(0);

    setupGroundColors();

    this.chunk = new Chunk(5, 5, 1, 0, 1);
    // add_maze_block();

    //document.onkeydown = keydown;
    g_camera = new Camera();
    velocity[0] = 0;
    velocity[1] = 0;
    velocity[2] = 0;
    rotational_velocity[0] = 0;
    rotational_velocity[1] = 0;
    rotational_velocity[2] = 0;
    document.body.addEventListener('keydown', keydown);
    document.body.addEventListener('keyup', keyup);
    document.body.onclick = function (ev) { if (ev.button == 0) { performClick(1); } canvas.requestPointerLock(); }
    document.addEventListener('mousedown', testMouse);

    g_camera.eye.elements[0] = g_spawnPoint[0];
    g_camera.eye.elements[2] = g_spawnPoint[1];
    g_camera.eye.elements[1] = g_spawnPoint[2];

    // disable context menu
    window.oncontextmenu = function () { performClick(2); return false; }

    // Register function (event handler) to be called on a mouse press
    // canvas.onmousemove = mousemove;

    // Pass vertex position to attribute variable
    gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    sendTextToHTML("", "otherText");

    requestAnimationFrame(tick);
}
