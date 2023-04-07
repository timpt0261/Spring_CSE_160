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