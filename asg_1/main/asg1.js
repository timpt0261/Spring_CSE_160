// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =`
    attribute vec4 a_Position;
    void main() {
      gl_Position = a_Position;
      gl_PointSize = 10.0;
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

let clear;
let mode;

let circle;
let square;
let triangle;

let color;
let size;
let segment;

function setupWebGL()
{
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = getWebGLContext(canvas);
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

}

function setupVariablesFromDocument()
{
    clear = document.getElementById("clear");
    
    circle = document.getElementById("circle");
    square = document.getElementById("square");
    triangle = document.getElementById("triangle");
    
    var red = document.getElementById("red");
    var green = document.getElementById("green");
    var blue = document.getElementById("blue");
    
    // Store color as array 
    color = [red.value,green.value,blue.value];

    size = document.getElementById("size").value;

    segment = document.getElementById("segments").value;


}

function main() 
{
    // Setup Canvas and WebGL
    setupWebGL();
    // Setup GLSL shader programs and connect GLSL variables
    connectVariablesGLSL();    

    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = click;

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Sets up all gloabal variables in the document
    setupVariablesFromDocument()
    clear.onclick = clearDrawing();
    mode = setDrawingMode();
    console.log(mode);
}

var g_points = [];  // The array for the position of a mouse press
var g_colors = [];  // The array to store the color of a point
function click(ev) {
    // Extract the event click and return it in WebGL coordinates
    let [x,y] = convertCoordinatesEventToGL(ev);

    // Store the coordinates to g_points array
    g_points.push([x, y]);
    // Store the coordinates to g_points array
    if (x >= 0.0 && y >= 0.0) {      // First quadrant
        g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
    } else if (x < 0.0 && y < 0.0) { // Third quadrant
        g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
    } else {                         // Others
        g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
    }

    renderAllShapes();    
}

function clearDrawing(ev)
{
    console.log("Clearing");
    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function setDrawingMode()
{
    circle.onclick= () =>
    { 
        console.log("Clicking" + circle.value);
        return circle.value;
    }

    square.onclick= () =>
    {
        console.log("Clicking" + square.value);
        return square.value;
    }

    triangle.onclick= () =>
    {
        console.log("Clicking" + triangle.value);
        return triangle.value;
    }

}

function setShapeColor()
{

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
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = g_points.length;
    for (var i = 0; i < len; i++) {
        var xy = g_points[i];
        var rgba = g_colors[i];

        // Pass the position of a point to a_Position variable
        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // Draw
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}
