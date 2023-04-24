class Cube {
    constructor() {
        this.type = "cube";
        // this.postion = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        // this.size = 5.0;
        // this.segments = 10;
        this.matrix = new Matrix4();
    }

    // Render this shape
    render() {
        // var xy = this.postion;
        var rgba = this.color;
        // var size = this.size;

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Front of cube
        drawTriangle3d([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0]);
        drawTriangle3d([0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0]);
    }
}