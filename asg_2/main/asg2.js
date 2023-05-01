// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program

var VSHADER_SOURCE =`
    attribute vec4 a_Position;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    void main() {
      gl_Position =  u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    }`

// Fragment shader program
var FSHADER_SOURCE =`
    precision mediump float;
    uniform vec4 u_FragColor;  // uniforrm
    void main() {
      gl_FragColor = u_FragColor;
    }`

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;


let g_Clear;
let g_selectedType = POINT;

// Global Variables for UI elements
let g_SelectedColor = [1.0,1.0,1.0,1.0];
let g_SelectedSize = 5;
let g_SegmentCount = 10;
let g_globalAngle = 0;
let g_yellowAngle = 0;
let g_magentaAngle = 0;
let g_yellowAnimation = false;
let g_magentaAnimation = false;

// Octo head
let g_headAngle =0;
let g_eyeAngle_1=0;
let g_eyeAngle_2=0

//Octo body
let g_tentacleAngle_base_001_x = 0;
let g_tentacleAngle_base_001_y = 0;
let g_tentacleAngle_base_001_z = 0;



function setupWebGL()
{
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl" , {preserveDrawingBuffer: true});
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    gl.enable(gl.DEPTH_TEST);
}

function connectVariablesGLSL()
{
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

    // Set inital storage location of u_ModelMatrix
    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

}

function addActionsFromHtmlUI()
{


    // // Button Events
    // document.getElementById("animationYellowOffButton").onclick = function(){g_yellowAnimation = false;};
    // document.getElementById("animationYellowOnButton").onclick = function(){g_yellowAnimation = true;};
    // document.getElementById("animationMagentaOffButton").onclick = function(){g_magentaAnimation = false;};
    // document.getElementById("animationMagentaOnButton").onclick = function(){ g_magentaAnimation = true;};

    // // Color Slider Events
    // document.getElementById("yellowSlider").addEventListener("mousemove", function(){ g_yellowAngle = this.value; renderAllShapes();});
    // document.getElementById("magentaSlider").addEventListener("mousemove", function(){ g_magentaAngle = this.value; renderAllShapes();});

    //Rotate events
    document.getElementById("tentacle_base_001_x").addEventListener("mousemove",function(){g_tentacleAngle_base_001_x = this.value; renderAllShapes();})
    document.getElementById("tentacle_base_001_y").addEventListener("mousemove",function(){g_tentacleAngle_base_001_y = this.value; renderAllShapes();})
    document.getElementById("tentacle_base_001_z").addEventListener("mousemove",function(){g_tentacleAngle_base_001_z = this.value; renderAllShapes();})
    // Size slider events
    canvas.addEventListener("wheel", function(event){ g_globalAngle += event.deltaY * -0.01; renderAllShapes();});

}

function main() 
{
    // Setup Canvas and WebGL
    setupWebGL();
    // Setup GLSL shader programs and connect GLSL variables
    connectVariablesGLSL();  
    
    addActionsFromHtmlUI();

    // // Register function (event handler) to be called on a mouse press
    // canvas.onmousedown = click;
    // canvas.onmousemove = function(ev) {if(ev.buttons == 1) {click(ev)} };
  
    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0, 1, 1.0);
  
    // Sets up all gloabal variables in the document
    requestAnimationFrame(tick);
}

var g_startTime=performance.now()/1000.0;
var g_seconds=performance.now()/1000.0 - g_startTime;

function tick()
{
    // Print some debug information so we know we are running
    g_seconds=performance.now()/1000.0-g_startTime;
    console.log(performance.now());

    // Update Animation Angles
    updateAnimationAngles();

    // Draw Everything
    renderAllShapes();

    // Tell  the browser to update againn when it has time
    requestAnimationFrame(tick);
}
function updateAnimationAngles(){
    if(g_yellowAnimation){
        g_yellowAngle = (45*Math.sin(g_seconds));
    }

    if(g_magentaAnimation){
        g_magentaAngle= (45*Math.sin(3*g_seconds));
    }
}
// Draw every shape that is suppose to be on the Canvas
function renderAllShapes()
{
    var startTime = performance.now();

    // Create a new matrix to hold the global rotation
    var globalRotateM = new Matrix4();
    globalRotateM.setRotate(g_globalAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotateM.elements);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BITs);
    
    var parentMatrix = new Matrix4([1,1,0]);
    var octo = new Octopus(.5,1.1);
    octo.render(parentMatrix);

    var duration = performance.now() - startTime;
    sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration)/10, "numdot");
}


function sendTextToHTML(text, htmlID)
{
    var htmlElm = document.getElementById(htmlID);
    if(!htmlElm){
        console.log("Failed to get" + htmlID + " from HTML");
        return;
    }
    htmlElm.innerHTML = text;
}

