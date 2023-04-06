// DrawRectangle.js
function main() {
    let v1 =  new Vector3([100,100,0]);
    drawVector(v1,"red");
}

function drawVector(v, color)
{
    let xoff = 20;
    let yoff = 20;
    let lw = 15;
    var canvas = document.getElementById('example');
    var ctx = canvas.getContext('2d');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a black color
    ctx.fillRect(0, 0, 400, 400); // Fill a rectangle with the color

    ctx.strokeStyle = color;
    ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, canvas.height/2);
    ctx.lineTo(v[0] + xoff, v[1] + yoff);
    ctx.stroke();
    console.log("Here");
}