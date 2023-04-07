// DrawRectangle.js
function main() {
    let center = 200; //center of the canvas
    var canvas = document.getElementById('example');
    var ctx = canvas.getContext('2d');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a black color
    ctx.fillRect(0, 0, 400, 400); // Fill a rectangle with the color
   handleDrawEvent();
   handleDrawEvent();
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
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a black color
    ctx.fillRect(0, 0, 400, 400); // Fill a rectangle with the color

    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, canvas.height/2);
    ctx.lineTo(center + v.elements[0] * 20,center-v.elements[1] *20);
    ctx.stroke();
}

function handleDrawEvent()
{
    let v = new Vector3([0,0,0]);
    var canvas = document.getElementById('example');
    var ctx = canvas.getContext('2d');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }
    // Clear canvas
    const draw = document.getElementById("draw");
    draw.onclick = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a black color
        ctx.fillRect(0, 0, 400, 400); // Fill a rectangle with the color
        console.log("Clearing Canvas")

        // Read values 
        const input = document.querySelector("input");
        
        const x_value = document.getElementById("x-coor");
        const y_value = document.getElementById("y-coor");
        
        v = new Vector3([x_value.value, y_value.value, 0]);
        // Draw vector
        drawVector(v, "red");
    }
    
}