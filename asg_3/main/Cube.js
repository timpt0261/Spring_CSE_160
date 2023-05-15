// Credit: Aaron Brunckhurst-Fust in Hall of Fame
// https://people.ucsc.edu/~dbrunckh/CSE160-Worldv8/world.html
class Cube {
    constructor() {
        this.type = 'cube';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;
        this.transparency = 1.0;
        this.matrix = new Matrix4();
        this.buffer = null;
        this.uvBuffer = null;
        this.textureNum = 44;

        this.setVertices();
        this.setUvs();
    }

    // took some code here from the lab3, this is a MUCH better way to to it
    setVertices() {
        // prettier-ignore
        this.vertices = new Float32Array([
            //FRONT
            -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5,
            -0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5,
            //LEFT
            -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5,
            -0.5, 0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5,
            //RIGHT
            0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5,
            0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5,
            //TOP
            -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
            -0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5,
            //BACK
            0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, 0.5, -0.5,
            -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5,
            //BOTTOM
            -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5,
            -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5
        ]);
    }

    setUvs() {
        // prettier-ignore
        this.uvs = new Float32Array([
            // FRONT
            0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1,
            // LEFT
            0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1,
            // RIGHT
            0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1,
            // TOP
            1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0,
            // BACK
            0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0,
            // BOTTOM
            0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1,
        ]);
    }

    drawTriangle(vertices) {
        var n = 3; // The number of vertices

        // Create a buffer object
        var vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) {
            console.log('Failed to create the buffer object');
            return -1;
        }

        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        // Write date into the buffer object
        //gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);

        gl.drawArrays(gl.TRIANGLES, 0, n);
    }

    render() {
        var rgba = this.color;

        // pass the selected texture number
        gl.uniform1i(u_whichTexture, this.textureNum);

        // Pass the color of a circle to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // Pass the transparency of a circle
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        if (this.buffer === null) {
            // Create a buffer object
            this.buffer = gl.createBuffer();
            if (!this.buffer) {
                console.log("Failed to create the buffer object");
                return -1;
            }
        }

        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

        // Assign the buffer object to aPosition variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

        // Enable the assignment to aPosition variable
        gl.enableVertexAttribArray(a_Position);

        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);


        if (this.uvBuffer === null) {
            // Create a buffer object
            this.uvBuffer = gl.createBuffer();
            if (!this.uvBuffer) {
                console.log("Failed to create the uvBuffer object");
                return -1;
            }
        }

        // Bind the uvBuffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);

        // Write date into the uvBuffer object
        gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.DYNAMIC_DRAW);

        // Assign the uvBuffer object to aPosition variable
        gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

        // Enable the assignment to aPosition variable
        gl.enableVertexAttribArray(a_UV);

        gl.drawArrays(gl.TRIANGLES, 0, this.uvs.length / 2);



        // // draw front
        // drawTriangle3DUV([ -0.5,-0.5,-0.5,   -0.5,0.5,-0.5,   0.5,0.5,-0.5 ], [0,0,  0,1,  1,1]);
        // drawTriangle3DUV([ -0.5,-0.5,-0.5,   0.5,-0.5,-0.5,   0.5,0.5,-0.5 ], [0,0,  1,0,  1,1]);

        // // draw right
        // drawTriangle3DUV([ 0.5,-0.5,-0.5,   0.5,0.5,0.5,   0.5,0.5,-0.5 ], [1,0,  0,1,  1,1]);
        // drawTriangle3DUV([ 0.5,-0.5,-0.5,   0.5,0.5,0.5,   0.5,-0.5,0.5 ], [1,0,  0,1,  1,1]);

        // // draw left
        // drawTriangle3DUV([ -0.5,-0.5,-0.5,   -0.5,0.5,0.5,   -0.5,0.5,-0.5 ], [1,0,  0,1,  1,1]);
        // drawTriangle3DUV([ -0.5,-0.5,-0.5,   -0.5,0.5,0.5,   -0.5,-0.5,0.5 ], [1,0,  0,1,  1,1]);

        // // draw back
        // drawTriangle3DUV([ -0.5,-0.5,0.5,   -0.5,0.5,0.5,   0.5,-0.5,0.5 ], [1,0,  0,1,  1,1]);
        // drawTriangle3DUV([ 0.5,0.5,0.5,   -0.5,0.5,0.5,   0.5,-0.5,0.5 ], [1,0,  0,1,  1,1]);

        // // make top slightly darker
        // gl.uniform4f(u_FragColor, rgba[0] *0.8, rgba[1] *0.8, rgba[2] *0.8, rgba[3]);
        // // draw top
        // drawTriangle3DUV([ 0.5,0.5,0.5,   -0.5,0.5,-0.5,   0.5,0.5,-0.5 ], [1,0,  0,1,  1,1]);
        // drawTriangle3DUV([ 0.5,0.5,0.5,   -0.5,0.5,-0.5,   -0.5,0.5,0.5 ], [1,0,  0,1,  1,1]);

        // // make bottom darker
        // gl.uniform4f(u_FragColor, rgba[0] *0.5, rgba[1] *0.5, rgba[2] *0.5, rgba[3]);

        // // draw bottom
        // drawTriangle3DUV([ -0.5,-0.5,-0.5,   0.5,-0.5,0.5,   0.5,-0.5,-0.5 ], [1,0,  0,1,  1,1]);
        // drawTriangle3DUV([ -0.5,-0.5,-0.5,   0.5,-0.5,0.5,   -0.5,-0.5,0.5 ], [1,0,  0,1,  1,1]);
    }
}