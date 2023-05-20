
class Sphere {
    constructor() {
        this.type = 'sphere';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        // this.buffer = null;
        // this.uvBuffer = null;
        // this.normalBuffer = null;
        this.textureNum = -2;
        this.verts32 = new Float32Array([]);

        // this.setVertices();
        // this.setUvs();
        // this.setNormals();
    }

    // setVertices() {
    //     const latitudeBands = 30;
    //     const longitudeBands = 30;
    //     const radius = 0.5;

    //     const vertices = [];

    //     for (let latNumber = 0; latNumber <= latitudeBands; latNumber++) {
    //       const theta = (latNumber * Math.PI) / latitudeBands;
    //       const sinTheta = Math.sin(theta);
    //       const cosTheta = Math.cos(theta);

    //       for (let longNumber = 0; longNumber <= longitudeBands; longNumber++) {
    //         const phi = (longNumber * 2 * Math.PI) / longitudeBands;
    //         const sinPhi = Math.sin(phi);
    //         const cosPhi = Math.cos(phi);

    //         const x = cosPhi * sinTheta;
    //         const y = cosTheta;
    //         const z = sinPhi * sinTheta;

    //         vertices.push(radius * x, radius * y, radius * z);
    //       }
    //     }

    //     this.vertices = new Float32Array(vertices);
    //   }

    // setUvs() {
    //     const latitudeBands = 30;
    //     const longitudeBands = 30;

    //     const uvs = [];
    //     for (let latNumber = 0; latNumber <= latitudeBands; latNumber++) {
    //         for (let longNumber = 0; longNumber <= longitudeBands; longNumber++) {
    //             const u = longNumber / longitudeBands;
    //             const v = latNumber / latitudeBands;
    //             uvs.push(u, v);
    //         }
    //     }

    //     this.uvs = new Float32Array(uvs);
    // }

    // setNormals() {
    //     const latitudeBands = 30;
    //     const longitudeBands = 30;

    //     const normals = [];
    //     for (let latNumber = 0; latNumber <= latitudeBands; latNumber++) {
    //         const theta = (latNumber * Math.PI) / latitudeBands;
    //         const sinTheta = Math.sin(theta);
    //         const cosTheta = Math.cos(theta);

    //         for (let longNumber = 0; longNumber <= longitudeBands; longNumber++) {
    //             const phi = (longNumber * 2 * Math.PI) / longitudeBands;
    //             const sinPhi = Math.sin(phi);
    //             const cosPhi = Math.cos(phi);

    //             const x = cosPhi * sinTheta;
    //             const y = cosTheta;
    //             const z = sinPhi * sinTheta;

    //             normals.push(x, y, z);
    //         }
    //     }

    //     this.normals = new Float32Array(normals);
    // }

    render() {
        var rgba = this.color;

        // pass the selected texture number
        gl.uniform1i(u_whichTexture, this.textureNum);

        // Pass the color of a circle to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // Pass the transparency of a circle
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        var d = Math.PI / 10;
        var dd = Math.PI / 10;
        var uv = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        for (var t = 0; t < Math.PI; t += d) {
            for (var r = 0; r < (2 * Math.PI); r += d) {
                var p1 = [Math.sin(t) * Math.cos(r), Math.sin(t) * Math.sin(r), Math.cos(t)];

                var p2 = [Math.sin(t + dd) * Math.cos(r), Math.sin(t + dd) * Math.sin(r), Math.cos(t + dd)];
                var p3 = [Math.sin(t) * Math.cos(r + dd), Math.sin(t) * Math.sin(r + dd), Math.cos(t)];
                var p4 = [Math.sin(t + dd) * Math.cos(r + dd), Math.sin(t + dd) * Math.sin(r + dd), Math.cos(t + dd)];

                var v = [];
                var uv = [];
                v = v.concat(p1); uv = uv.concat([0, 0]);
                v = v.concat(p2); uv = uv.concat([0, 0]);
                v = v.concat(p4); uv = uv.concat([0, 0]);

                gl.uniform4f(u_FragColor, 1, 0, 0, 1);
                drawTriangle3DUVNormal(v, uv, v);

                v = []; uv = [];
                v = v.concat(p1); uv = uv.concat([0, 0]);
                v = v.concat(p4); uv = uv.concat([0, 0]);
                v = v.concat(p3); uv = uv.concat([0, 0]);

                gl.uniform4f(u_FragColor, 1, 1, 1, 1);
                drawTriangle3DUVNormal(v, uv, v);


            }
        }

        // if (this.buffer === null) {
        //     // Create a buffer object
        //     this.buffer = gl.createBuffer();
        //     if (!this.buffer) {
        //         console.log("Failed to create the buffer object");
        //         return -1;
        //     }
        // }

        // // Bind the buffer object to target
        // gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

        // // Write date into the buffer object
        // gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

        // // Assign the buffer object to aPosition variable
        // gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

        // // Enable the assignment to aPosition variable
        // gl.enableVertexAttribArray(a_Position);

        // gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);


        // if (this.uvBuffer === null) {
        //     // Create a buffer object
        //     this.uvBuffer = gl.createBuffer();
        //     if (!this.uvBuffer) {
        //         console.log("Failed to create the uvBuffer object");
        //         return -1;
        //     }
        // }

        // // Bind the uvBuffer object to target
        // gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);

        // // Write date into the uvBuffer object
        // gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.DYNAMIC_DRAW);

        // // Assign the uvBuffer object to aPosition variable
        // gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

        // // Enable the assignment to aPosition variable
        // gl.enableVertexAttribArray(a_UV);

        // gl.drawArrays(gl.TRIANGLES, 0, this.uvs.length / 2);


        // if (this.normalBuffer === null) {
        //     // Create a buffer object
        //     this.normalBuffer = gl.createBuffer();
        //     if (!this.normalBuffer) {
        //         console.log("Failed to create the normalBuffer object");
        //         return -1;
        //     }
        // }

        // // Bind the uvBuffer object to target
        // gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);

        // // Write date into the uvBuffer object
        // gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.DYNAMIC_DRAW);

        // // Assign the uvBuffer object to aPosition variable
        // gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);

        // // Enable the assignment to aPosition variable
        // gl.enableVertexAttribArray(a_Normal);

        // gl.drawArrays(gl.TRIANGLES, 0, this.normals.length / 3);
    }

}