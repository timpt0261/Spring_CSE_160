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
let g_headAngles = [0,0,0];
let g_headAnimation = false;

//Octo body
let g_tentacleAngle_001 = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
let g_tentacleAngle_002 = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
let g_tentacleAngle_003 = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
let g_tentacleAngle_004 = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];

let g_tentacleAnimation_001 = [[false, false, false], [false, false, false], [false, false, false], [false, false, false]];
let g_tentacleAnimation_002 = [[false, false, false], [false, false, false], [false, false, false], [false, false, false]];
let g_tentacleAnimation_003 = [[false, false, false], [false, false, false], [false, false, false], [false, false, false]];
let g_tentacleAnimation_004 = [[false, false, false], [false, false, false], [false, false, false], [false, false, false]];




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

    //Head
    document.getElementById("tentacle_head_001_x").addEventListener("mousemove",function(){g_headAngles[0] = this.value; renderAllShapes();})
    document.getElementById("tentacle_head_001_y").addEventListener("mousemove", function () { g_headAngles[1] = this.value; renderAllShapes();})
    document.getElementById("tentacle_head_001_z").addEventListener("mousemove", function () { g_headAngles[2] = this.value; renderAllShapes();})
    
    // Tentacle 1
    document.getElementById("tentacle_base_001_x").addEventListener("mousemove", function () { g_tentacleAngle_001[0][0] = this.value; renderAllShapes(); })
    document.getElementById("tentacle_base_001_y").addEventListener("mousemove", function () { g_tentacleAngle_001[0][1] = this.value; renderAllShapes(); })
    document.getElementById("tentacle_base_001_z").addEventListener("mousemove", function () { g_tentacleAngle_001[0][2] = this.value; renderAllShapes(); })

    document.getElementById("tentacle_segment1_001_x").addEventListener("mousemove", function () { g_tentacleAngle_001[1][0] = this.value; renderAllShapes(); })
    document.getElementById("tentacle_segment1_001_y").addEventListener("mousemove", function () { g_tentacleAngle_001[1][1] = this.value; renderAllShapes(); })
    document.getElementById("tentacle_segment1_001_z").addEventListener("mousemove", function () { g_tentacleAngle_001[1][2] = this.value; renderAllShapes(); })

    document.getElementById("tentacle_segment2_001_x").addEventListener("mousemove", function () { g_tentacleAngle_001[2][0] = this.value; renderAllShapes(); })
    document.getElementById("tentacle_segment2_001_y").addEventListener("mousemove", function () { g_tentacleAngle_001[2][1] = this.value; renderAllShapes(); })
    document.getElementById("tentacle_segment2_001_z").addEventListener("mousemove", function () { g_tentacleAngle_001[2][2] = this.value; renderAllShapes(); })
    
    document.getElementById("tentacle_tail_001_x").addEventListener("mousemove", function () { g_tentacleAngle_001[3][0] = this.value; renderAllShapes(); })
    document.getElementById("tentacle_tail_001_y").addEventListener("mousemove", function () { g_tentacleAngle_001[3][1] = this.value; renderAllShapes(); })
    document.getElementById("tentacle_tail_001_z").addEventListener("mousemove", function () { g_tentacleAngle_001[3][2] = this.value; renderAllShapes(); })

    // Tentacle 2
    document.getElementById("tentacle_base_002_x").addEventListener("mousemove", function () { g_tentacleAngle_002[0][0] = this.value; renderAllShapes(); })
    document.getElementById("tentacle_base_002_y").addEventListener("mousemove", function () { g_tentacleAngle_002[0][1] = this.value; renderAllShapes(); })
    document.getElementById("tentacle_base_002_z").addEventListener("mousemove", function () { g_tentacleAngle_002[0][2] = this.value; renderAllShapes(); })

    document.getElementById("tentacle_segment1_002_x").addEventListener("mousemove", function () { g_tentacleAngle_002[1][0] = this.value; renderAllShapes(); })
    document.getElementById("tentacle_segment1_002_y").addEventListener("mousemove", function () { g_tentacleAngle_002[1][1] = this.value; renderAllShapes(); })
    document.getElementById("tentacle_segment1_002_z").addEventListener("mousemove", function () { g_tentacleAngle_002[1][2] = this.value; renderAllShapes(); })

    document.getElementById("tentacle_segment2_002_x").addEventListener("mousemove", function () { g_tentacleAngle_002[2][0] = this.value; renderAllShapes(); })
    document.getElementById("tentacle_segment2_002_y").addEventListener("mousemove", function () { g_tentacleAngle_002[2][1] = this.value; renderAllShapes(); })
    document.getElementById("tentacle_segment2_002_z").addEventListener("mousemove", function () { g_tentacleAngle_002[2][2] = this.value; renderAllShapes(); })

    document.getElementById("tentacle_tail_002_x").addEventListener("mousemove", function () { g_tentacleAngle_002[3][0] = this.value; renderAllShapes(); })
    document.getElementById("tentacle_tail_002_y").addEventListener("mousemove", function () { g_tentacleAngle_002[3][1] = this.value; renderAllShapes(); })
    document.getElementById("tentacle_tail_002_z").addEventListener("mousemove", function () { g_tentacleAngle_002[3][2] = this.value; renderAllShapes(); })

    // Tentacle 3
    document.getElementById("tentacle_base_003_x").addEventListener("mousemove", function () { g_tentacleAngle_003[0][0] = this.value; renderAllShapes(); })
    document.getElementById("tentacle_base_003_y").addEventListener("mousemove", function () { g_tentacleAngle_003[0][1] = this.value; renderAllShapes(); })
    document.getElementById("tentacle_base_003_z").addEventListener("mousemove", function () { g_tentacleAngle_003[0][2] = this.value; renderAllShapes(); })

    document.getElementById("tentacle_segment1_003_x").addEventListener("mousemove", function () { g_tentacleAngle_003[1][0] = this.value; renderAllShapes(); })
    document.getElementById("tentacle_segment1_003_y").addEventListener("mousemove", function () { g_tentacleAngle_003[1][1] = this.value; renderAllShapes(); })
    document.getElementById("tentacle_segment1_003_z").addEventListener("mousemove", function () { g_tentacleAngle_003[1][2] = this.value; renderAllShapes(); })

    document.getElementById("tentacle_segment2_003_x").addEventListener("mousemove", function () { g_tentacleAngle_003[2][0] = this.value; renderAllShapes(); })
    document.getElementById("tentacle_segment2_003_y").addEventListener("mousemove", function () { g_tentacleAngle_003[2][1] = this.value; renderAllShapes(); })
    document.getElementById("tentacle_segment2_003_z").addEventListener("mousemove", function () { g_tentacleAngle_003[2][2] = this.value; renderAllShapes(); })

    document.getElementById("tentacle_tail_003_x").addEventListener("mousemove", function () { g_tentacleAngle_003[3][0] = this.value; renderAllShapes(); })
    document.getElementById("tentacle_tail_003_y").addEventListener("mousemove", function () { g_tentacleAngle_003[3][1] = this.value; renderAllShapes(); })
    document.getElementById("tentacle_tail_003_z").addEventListener("mousemove", function () { g_tentacleAngle_003[3][2] = this.value; renderAllShapes(); })

    // Tentacle 4
    document.getElementById("tentacle_base_004_x").addEventListener("mousemove", function () { g_tentacleAngle_004[0][0] = this.value; renderAllShapes(); })
    document.getElementById("tentacle_base_004_y").addEventListener("mousemove", function () { g_tentacleAngle_004[0][1] = this.value; renderAllShapes(); })
    document.getElementById("tentacle_base_004_z").addEventListener("mousemove", function () { g_tentacleAngle_004[0][2] = this.value; renderAllShapes(); })

    document.getElementById("tentacle_segment1_004_x").addEventListener("mousemove", function () { g_tentacleAngle_003[1][0] = this.value; renderAllShapes(); })
    document.getElementById("tentacle_segment1_004_y").addEventListener("mousemove", function () { g_tentacleAngle_003[1][1] = this.value; renderAllShapes(); })
    document.getElementById("tentacle_segment1_004_z").addEventListener("mousemove", function () { g_tentacleAngle_003[1][2] = this.value; renderAllShapes(); })

    document.getElementById("tentacle_segment2_004_x").addEventListener("mousemove", function () { g_tentacleAngle_003[2][0] = this.value; renderAllShapes(); })
    document.getElementById("tentacle_segment2_004_y").addEventListener("mousemove", function () { g_tentacleAngle_003[2][1] = this.value; renderAllShapes(); })
    document.getElementById("tentacle_segment2_004_z").addEventListener("mousemove", function () { g_tentacleAngle_003[2][2] = this.value; renderAllShapes(); })

    document.getElementById("tentacle_tail_004_x").addEventListener("mousemove", function () { g_tentacleAngle_003[3][0] = this.value; renderAllShapes(); })
    document.getElementById("tentacle_tail_004_y").addEventListener("mousemove", function () { g_tentacleAngle_003[3][1] = this.value; renderAllShapes(); })
    document.getElementById("tentacle_tail_004_z").addEventListener("mousemove", function () { g_tentacleAngle_003[3][2] = this.value; renderAllShapes(); })

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
    
    // Draw the body Cube
    // var body = new Cube();
    // body.color = [1.0,0.0,0.0,1.0];
    // body.matrix.translate(-.25,-.75,0.0);
    // body.matrix.rotate(-5,1,0,0);
    // body.matrix.scale(0.5,.3,.5);
    // body.render();

    // // Yellow Cube
    // var yellow = new Cube();
    // yellow.color = [1,1,0,1];
    // yellow.matrix.setTranslate(0,-0.5,0.0);
    // yellow.matrix.rotate(-5,1,0,0);
    // yellow.matrix.rotate(-g_yellowAngle,0,0,1);
    // var yellowCoordinatesMat = new Matrix4(yellow.matrix);
    // yellow.matrix.scale(0.25,0.7,0.5);
    // yellow.matrix.translate(-.5,0,0);
    // yellow.render();

    // // magenta box
    // var magenta = new Cube();
    // magenta.color = [1,0,1,1];
    // magenta.matrix = yellowCoordinatesMat;
    // magenta.matrix.translate(0,.65,0);
    // magenta.matrix.rotate(g_magentaAngle,0,0,1);
    // magenta.matrix.scale(.3,.3,.3);
    // magenta.matrix.translate(-.5,0,-0.001);
    // magenta.render();


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

