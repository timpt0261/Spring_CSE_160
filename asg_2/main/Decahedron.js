class Decahedron {
  constructor(radius) {
    this.type = "decahedron";
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();

    const verticesAndFaces = this.createDecahedronVertices(radius);
    this.vertices = verticesAndFaces.vertices;
    this.faces = verticesAndFaces.faces;
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

    gl.drawElements(gl.LINES, this.faces.length, gl.UNSIGNED_SHORT, 0);

    gl.deleteBuffer(vertexBuffer);
  }

  createDecahedronVertices(radius) {
    const t = (1 + Math.sqrt(5)) / 2;
    const vertices = [
      // 5 vertices of the top "point" of the decahedron
      0, radius, 0,
      -radius / t, radius / t, -radius / t,
      radius / t, radius / t, -radius / t,
      radius / t, radius / t, radius / t,
      -radius / t, radius / t, radius / t,
      // 5 vertices of the bottom "point" of the decahedron
      0, -radius, 0,
      -radius / t, -radius / t, radius / t,
      radius / t, -radius / t, radius / t,
      radius / t, -radius / t, -radius / t,
      -radius / t, -radius / t, -radius / t,
    ];
    const faces = [
      // top half
      0, 1, 2,
      0, 2, 3,
      0, 3, 4,
      0, 4, 1,
      1, 7, 6,
      1, 6, 2,
      2, 6, 3,
      3, 6, 5,
      3, 5, 4,
      4, 5, 1,
      // bottom half
      5, 6, 7,
      5, 7, 8,
      5, 8, 9,
      5, 9, 4,
      4, 9, 10,
      4, 10, 1,
      1, 10, 11,
      1, 11, 7,
      7, 11, 8,
      8, 11, 10,
      8, 10, 9,
    ];
    return { vertices, faces };
  }
}
