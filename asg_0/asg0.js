// DrawRectangle.js
function main() {
    var canvas = document.getElementById('example');
    var ctx = canvas.getContext('2d');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a black color
    ctx.fillRect(0, 0, 400, 400); // Fill a rectangle with the color
   handleDrawEvent();
   handleDrawOperationEvent()
}

function drawVector(v=new Vector3([0,0,0]), color="")
{
    let center = 200; //center of the canvas
    var canvas = document.getElementById('example');
    var ctx = canvas.getContext('2d');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    // Drawing on Canvas
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, canvas.height/2);
    ctx.lineTo(center + v.elements[0] * 20,center-v.elements[1] *20);
    ctx.stroke();
}

function handleDrawEvent()
{
    var canvas = document.getElementById('example');
    var ctx = canvas.getContext('2d');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }
    // Clear canvas
    const draw = document.getElementById("draw");
    draw.onclick = () => {
        console.log("Drawing");
        ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a black color
        ctx.fillRect(0, 0, 400, 400); // Fill a rectangle with the color
        console.log("Clearing Canvas")

        // Read values 
        const x1_value = document.getElementById("x1-coor");
        const y1_value = document.getElementById("y1-coor");
        
        const x2_value = document.getElementById("x2-coor");
        const y2_value = document.getElementById("y2-coor");
        
        let v1 = new Vector3([x1_value.value, y1_value.value, 0]);
        let v2 = new Vector3([x2_value.value, y2_value.value, 0]);

        // Draw vectors
        drawVector(v1, "red");
        drawVector(v2,"blue");
    }
}

function handleDrawOperationEvent()
{
    var canvas = document.getElementById('example');
    var ctx = canvas.getContext('2d');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }
    // Clear canvas
    const draw = document.getElementById("draw_op");
    draw.onclick = () => {
        console.log("Drawing");
        ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a black color
        ctx.fillRect(0, 0, 400, 400); // Fill a rectangle with the color
        console.log("Clearing Canvas")

        // Read values 
        const x1_value = document.getElementById("x1-coor");
        const y1_value = document.getElementById("y1-coor");

        const x2_value = document.getElementById("x2-coor");
        const y2_value = document.getElementById("y2-coor");

        const operation = document.getElementById("operation");
        const scaler = document.getElementById("scaler");

        let v1 = new Vector3([x1_value.value, y1_value.value, 0]);
        let v2 = new Vector3([x2_value.value, y2_value.value, 0]);

        // Draw vectors
        drawVector(v1, "red");
        drawVector(v2, "blue");
        

        switch(operation.value){
            case "add":
                drawVector(v1.add(v2), "green"); 
                break;
            case "sub":
                drawVector(v1.sub(v2), "green");
                break;
            case "mul": 
                drawVector(v1.mul(scaler.value),"green");
                drawVector(v2.mul(scaler.value), "green");
                break;
            case "div":
                drawVector(v1.div(scaler.value), "green");
                drawVector(v2.div(scaler.value), "green");
                break;
            case "ang_btw":
                angleBetween(v1, v2);
                break;
            case "area":
                areaTriangle(v1,v2);
                break;
            case "mag":
                console.log("Magnitude v1: " +v1.magnitude());
                console.log("Magnitude v2: " + v2.magnitude());
                break;
            case "norm":
                drawVector(v1.normalize(), "green");
                drawVector(v2.normalize(), "green");
                break;
        }
    }
}

function angleBetween(v1 = new Vector3([0, 0, 0]), v2 = new Vector3([0, 0, 0]))
{
    let theta = Vector3.dot(v1, v2) / (v1.magnitude() * v2.magnitude()) ; // calculate the angle
    theta = Math.acos(theta);
    theta = theta * 180 / Math.PI;
    console.log("Angle Between v1 anf v2:" + theta);
    return;
}

function areaTriangle(v1 = new Vector3([0, 0, 0]), v2 = new Vector3([0, 0, 0]))
{
    let cross = Vector3.cross(v1,v2);
    let area = cross.magnitude() * .5; 
    console.log("Area is: " + area);
    return;

}