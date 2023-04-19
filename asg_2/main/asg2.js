// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program

var VSHADER_SOURCE =`
    attribute vec4 a_Position;
    uniform float u_Size;
    void main() {
      gl_Position = a_Position;
      gl_PointSize = u_Size;
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

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Global Variables for UI elements
let g_Clear;
let g_SelectedStroke = POINT;
let g_selectedType = POINT;

let g_SelectedColor = [1.0,1.0,1.0,1.0];
let g_SelectedSize = 1;
let g_SegmentCount = 10;

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

    // Get the Storage location of u_Size
    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
        console.log('Failed to get the storage location of u_Size');
        return;
    }
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
    document.getElementById("size").addEventListener("mouseup", function(){ g_SelectedSize = this.value;});

    // Segements slider e
    document.getElementById("segments").addEventListener("mouseup", function(){g_SegmentCount = this.value;});

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

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // var len = g_ShapesList.length;
    // for (var i = 0; i < len; i++) {
    //     g_ShapesList[i].render();
    // }

    // Draw a test Triangle
    drawTriangle3d([-1.0,0.0,0.0,  -0.5,-1.0,0.0, 0.0,0.0,0.0] );

    // Draw a cube 
    var body = new Cube();
    body.color = [1.0,0.0,0.0,1.0];
    body.render();

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

