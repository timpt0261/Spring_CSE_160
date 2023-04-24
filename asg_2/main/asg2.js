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

function setupWebGL()
{
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    // gl = getWebGLContext(canvas);
    gl = canvas.getContext("webgl" , {preserveDrawingBuffer: true});
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
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
    document.getElementById("clear");

    // setup Action Types for Stroke 
    
    // setup Action Types for buttons
    document.getElementById("clear").onclick = function (){g_ShapesList = []; renderAllShapes();};
    document.getElementById("square").onclick = function () { g_selectedType=POINT; };
    document.getElementById("triangle").onclick = function () { g_selectedType=TRIANGLE; };
    document.getElementById("circle").onclick = function () { g_selectedType = CIRCLE; };

    // Slider Events
    document.getElementById("red").addEventListener("mouseup", function(){g_SelectedColor[0] = this.value/100; });
    document.getElementById("green").addEventListener("mouseup", function () { g_SelectedColor[1] = this.value / 100; });
    document.getElementById("blue").addEventListener("mouseup", function () { g_SelectedColor[2] = this.value / 100; });

    // Size slider events
    document.getElementById("angleSlider").addEventListener("mousemove", function(){ g_globalAngle = this.value; renderAllShapes();});

    // Segements slider e
    //document.getElementById("segments").addEventListener("mouseup", function(){g_SegmentCount = this.value;});

}

function main() 
{
    // Setup Canvas and WebGL
    setupWebGL();
    // Setup GLSL shader programs and connect GLSL variables
    connectVariablesGLSL();  
    
    addActionsFromHtmlUI();

    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = click;
    canvas.onmousemove = function(ev) {if(ev.buttons == 1) {click(ev)} };

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    //gl.clear(gl.COLOR_BUFFER_BIT);

    // Sets up all gloabal variables in the document
    renderAllShapes();
}

var g_ShapesList = [];

function click(ev) {
    // Extract the event click and return it in WebGL coordinates
    let [x,y] = convertCoordinatesEventToGL(ev);

    // Create and store the nre point
    let point;

    if(g_selectedType == POINT)
    {
        point = new Point();

    }else if(g_selectedType == TRIANGLE)
    {
        point = new Triangle();
    }else
    {
        point = new Circle();
    }

    point.postion = [x,y];
    point.color = g_SelectedColor.slice();
    point.size = g_SelectedSize;
    if(point.type == "circle"){
        point.segments = g_SegmentCount;
    } 
    g_ShapesList.push(point);
    
    renderAllShapes();    
}

// Extract the event click and return it to WebGL coordinates
function convertCoordinatesEventToGL(ev)
{
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

    return([x,y]);
}

// Draw every shape that is suppose to be on the Canvas
function renderAllShapes()
{
    var startTime = performance.now();

    // Pass the matrix to u_Modelmatrix attribute
    var globalRotMat = new Matrix4().rotate(g_globalAngle,0,1,0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix,false, globalRotMat.elements);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw a test Triangle
    // drawTriangle3d([-1.0,0.0,0.0,  -0.5,-1.0,0.0, 0.0,0.0,0.0] );

    // Draw the body Cube
    var body = new Cube();
    body.color = [1.0,0.0,0.0,1.0];
    body.matrix.translate(-.25,-.5,0.0);
    body.matrix.scale(0.5,1,0.5);
    body.render();

    // Draw left arm
    var leftArm = new Cube();
    leftArm.color = [1,1,0,1];
    leftArm.matrix.setTranslate(.7,0,0.0);
    leftArm.matrix.rotate(45,0,0,1);
    leftArm.matrix.scale(0.25,.7,.5);
    leftArm.render();

    var duration = performance.now() - startTime;
    sendTextToHTML("numdot " + len + " ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration)/10, "numdot");
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

