class Cube {
    constructor() {
        this.type = "cube";
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
    }

    // Render this shape
    render() {
        var rgba = this.color;

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Front of cube
        drawTriangle3dUV([0, 0, 0,  1, 1, 0,  1, 0, 0], [1,0, 0,1, 1,1]);
        drawTriangle3d([0, 0, 0,  0, 1, 0,  1, 1, 0]);

        // Pass the color of a point to FragColor uniform variable
        gl.uniform4f(u_FragColor, rgba[0] * .9, rgba[1] * .9, rgba[2] * .9, rgba[3]);

        // Top of the cube
        drawTriangle3d([0, 1, 0,  0, 1, 1,  1, 1, 1]);
        drawTriangle3d([0, 1, 0,  1, 1, 1,  1, 1, 0]);

        // Right face of cube
        drawTriangle3d([1, 0, 0,  1, 1, 0,  1, 1, 1]);
        drawTriangle3d([1, 0, 0,  1, 1, 1,  1, 0, 1]);

        // Left face of cube
        drawTriangle3d([0, 0, 1, 0, 1, 1, 0, 1, 0]);
        drawTriangle3d([0, 0, 1, 0, 1, 0, 0, 0, 0]);

        // Back face of cube
        drawTriangle3d([0, 0, 1, 1, 0, 1, 1, 1, 1]);
        drawTriangle3d([0, 0, 1, 1, 1, 1, 0, 1, 1]);

        // Bottom face of cube
        drawTriangle3d([0, 0, 1, 1, 0, 1, 1, 0, 0]);
        drawTriangle3d([0, 0, 1, 1, 0, 0, 0, 0, 0]);

    }
}