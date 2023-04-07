// DrawRectangle.js
function main() {
    let v1 = new Vector3([2.25, 2.25,0]);
    drawVector(v1,"red");
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