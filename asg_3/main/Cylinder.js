class Cylinder {
    constructor(segments) {
        this.type = 'cylinder';
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;
        this.segments = segments;
        this.size = 40;
        this.matrix = new Matrix4();
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
        var xy = this.position;
        var rgba = this.color;

        // Pass the position of a circle to a_Position variable
        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        // Pass the color of a circle to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the transparency of a circle
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        var d = this.size / 200.0; // delta

        let angleStep = 360 / this.segments;

        for (var angle = 0; angle < 360; angle = angle + angleStep) {
            let centerPt = [xy[0], xy[1]];
            let angle1 = angle;
            let angle2 = angle + angleStep;
            let vec1 = [Math.cos(angle1 * Math.PI / 180) * d, Math.sin(angle1 * Math.PI / 180) * d];
            let vec2 = [Math.cos(angle2 * Math.PI / 180) * d, Math.sin(angle2 * Math.PI / 180) * d];

            let pt1 = [centerPt[0] + vec1[0], centerPt[1] + vec1[1]];
            let pt2 = [centerPt[0] + vec2[0], centerPt[1] + vec2[1]];

            let veretices_top = [xy[0], xy[1], 0.5, pt1[0], pt1[1], 0.5, pt2[0], pt2[1], 0.5];
            drawTriangle3D(veretices_top);

            let veretices_bottom = [xy[0], xy[1], -0.5, pt1[0], pt1[1], -0.5, pt2[0], pt2[1], -0.5];
            drawTriangle3D(veretices_bottom);

            // now draw two triangles to connect the top and bottom parts
            drawTriangle3D([pt1[0], pt1[1], -0.5, pt2[0], pt2[1], -0.5, pt2[0], pt2[1], 0.5]);
            drawTriangle3D([pt2[0], pt2[1], 0.5, pt1[0], pt1[1], 0.5, pt1[0], pt1[1], -0.5]);
        }
    }
}