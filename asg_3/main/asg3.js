// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program

var VSHADER_SOURCE = `
    precision mediump float;
    attribute vec4 a_Position;
    attribute vec2 a_UV;
    varying vec2 v_UV;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjectionMatrix;
    void main() {
      gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix *  u_ModelMatrix * a_Position;
      v_UV  = a_UV;
    }`

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    varying vec2 v_UV;
    uniform vec4 u_FragColor;  
    void main() {
      gl_FragColor = u_FragColor;
      gl_FragColor = vec4(v_UV,1.0,1.0);
    }`

// Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;


let g_Clear;
let g_selectedType = POINT;


function setupWebGL() {
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    gl.enable(gl.DEPTH_TEST);
}

function connectVariablesGLSL() {
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

    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (a_UV < 0) {
        console.log('Failed to get the storage location of a_UV');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    // Get the Storage location of u_ModelMatrix
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    // Get the Storage location of u_GlobalRotateMatrix
    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
        console.log('Failed to get the storage location of u_GlobalRotateMatrix');
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
    

    // Set inital storage location of u_ModelMatrix
    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

}

// Global Variables for UI elements
let g_SelectedColor = [1.0, 1.0, 1.0, 1.0];
let g_SelectedSize = 5;
let g_SegmentCount = 10;
let g_globalAngle = 0;
let g_yellowAngle = 0;
let g_magentaAngle = 0;
let g_yellowAnimation = false;
let g_magentaAnimation = false;

function addActionsFromHtmlUI() {
    // Button Events
    document.getElementById("animationYellowOffButton").onclick = function () { g_yellowAnimation = false; };
    document.getElementById("animationYellowOnButton").onclick = function () { g_yellowAnimation = true; };
    document.getElementById("animationMagentaOffButton").onclick = function () { g_magentaAnimation = false; };
    document.getElementById("animationMagentaOnButton").onclick = function () { g_magentaAnimation = true; };

    // Color Slider Events
    document.getElementById("yellowSlider").addEventListener("mousemove", function () { g_yellowAngle = this.value; renderAllShapes(); });
    document.getElementById("magentaSlider").addEventListener("mousemove", function () { g_magentaAngle = this.value; renderAllShapes(); });

    // Size slider events
    document.getElementById("angleSlider").addEventListener("mousemove", function () { g_globalAngle = this.value; renderAllShapes(); });

}

function main() {
    // Setup Canvas and WebGL
    setupWebGL();
    // Setup GLSL shader programs and connect GLSL variables
    connectVariablesGLSL();

    addActionsFromHtmlUI();

    // // Register function (event handler) to be called on a mouse press
    //canvas.onmousedown = click;
    //canvas.onmousemove = function(ev) {if(ev.buttons == 1) {click(ev)} };

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Sets up all gloabal variables in the document
    requestAnimationFrame(tick);
}

var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;

function tick() {
    // Print some debug information so we know we are running
    g_seconds = performance.now() / 1000.0 - g_startTime;
    //console.log(performance.now());

    // Update Animation Angles
    updateAnimationAngles();

    // Draw Everything
    renderAllShapes();

    // Tell  the browser to update againn when it has time
    requestAnimationFrame(tick);
}
function updateAnimationAngles() {
    if (g_yellowAnimation) {
        g_yellowAngle = (45 * Math.sin(g_seconds));
    }

    if (g_magentaAnimation) {
        g_magentaAngle = (45 * Math.sin(3 * g_seconds));
    }
}
// Draw every shape that is suppose to be on the Canvas
function renderAllShapes() {
    var startTime = performance.now();

    // Pass the matrix to u_Modelmatrix attribute
    var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);


    // Draw the body Cube
    var body = new Cube();
    body.color = [1.0, 0.0, 0.0, 1.0];
    body.matrix.translate(-.25, -.75, 0.0);
    body.matrix.rotate(-5, 1, 0, 0);
    body.matrix.scale(0.5, .3, .5);
    body.render();

    // Yellow Cube
    var yellow = new Cube();
    yellow.color = [1, 1, 0, 1];
    yellow.matrix.setTranslate(0, -0.5, 0.0);
    yellow.matrix.rotate(-5, 1, 0, 0);
    yellow.matrix.rotate(-g_yellowAngle, 0, 0, 1);

    var yellowCoordinatesMat = new Matrix4(yellow.matrix);
    yellow.matrix.scale(0.25, 0.7, 0.5);
    yellow.matrix.translate(-.5, 0, 0);
    yellow.render();

    // magenta box
    var magenta = new Cube();
    magenta.color = [1, 0, 1, 1];
    magenta.matrix = yellowCoordinatesMat;
    magenta.matrix.translate(0, .65, 0);
    magenta.matrix.rotate(g_magentaAngle, 0, 0, 1);
    magenta.matrix.scale(.3, .3, .3);
    magenta.matrix.translate(-.5, 0, -0.001);
    magenta.render();



    var duration = performance.now() - startTime;
    sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(1000 / duration) / 10, "numdot");
}

function sendTextToHTML(text, htmlID) {
    var htmlElm = document.getElementById(htmlID);
    if (!htmlElm) {
        console.log("Failed to get" + htmlID + " from HTML");
        return;
    }
    htmlElm.innerHTML = text;
}