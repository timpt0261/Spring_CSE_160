class Sphere {
  constructor(radius) {
    this.type = "sphere";
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();

    const t = (1 + Math.sqrt(5)) / 2;
    this.vertices = [
      // top half
      0, 1.618, 1.618, 0.618, 1, 2.618,
      0.618, 1, 2.618, -0.618, 1, 2.618,
      -0.618, 1, 2.618, 0, 1.618, 1.618,
      0, 1.618, 1.618, -0.618, 1, 2.618,
      -0.618, 1, 2.618, -1.618, 0.618, 1,
      -1.618, 0.618, 1, -0.618, 1, 2.618,
      // bottom half
      0, -1.618, -1.618, 0.618, -1, -2.618,
      0.618, -1, -2.618, -0.618, -1, -2.618,
      -0.618, -1, -2.618, 0, -1.618, -1.618,
      0, -1.618, -1.618, -0.618, -1, -2.618,
      -0.618, -1, -2.618, -1.618, -0.618, -1,
      -1.618, -0.618, -1, -0.618, -1, -2.618,
      // side faces
      0, 1.618, 1.618, 1.618, 0.618, 1,
      0, 1.618, 1.618, 1.618, -0.618, 1,
      0, 1.618, 1.618, -1.618, 0.618, 1,
      0, 1.618, 1.618, -1.618, -0.618, 1,
      0, -1.618, -1.618, 1.618, -0.618, -1,
      0, -1.618, -1.618, 1.618, 0.618, -1,
      0, -1.618, -1.618, -1.618, -0.618, -1,
      0, -1.618, -1.618, -1.618, 0.618, -1,
      1.618, 0.618, 1, 1.618, -0.618, -1,
      1.618, 0.618, 1, 1.618, 0.618, -1,
      -1.618, 0.618, 1, -1.618, -0.618, -1,
      -1.618, 0.618, 1, -1.618, 0.618, -1
    ];
  }

  // Render this shape
  render() {
    var rgba = this.color;

    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.DYNAMIC_DRAW);

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);

    gl.deleteBuffer(vertexBuffer);
  }

  // createSphereVertices(radius, latitudeBands, longitudeBands) {
  //   var vertices = [];
  //   for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
  //     var theta = latNumber * Math.PI / latitudeBands;
  //     var sinTheta = Math.sin(theta);
  //     var cosTheta = Math.cos(theta);

  //     for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
  //       var phi = longNumber * 2 * Math.PI / longitudeBands;
  //       var sinPhi = Math.sin(phi);
  //       var cosPhi = Math.cos(phi);

  //       var x = cosPhi * sinTheta;
  //       var y = cosTheta;
  //       var z = sinPhi * sinTheta;

  //       vertices.push(radius * x);
  //       vertices.push(radius * y);
  //       vertices.push(radius * z);
  //     }
  //   }
  //   return vertices;
  // }
}

