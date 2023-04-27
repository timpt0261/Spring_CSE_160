class Sphere {
    constructor(radius) {
      this.type = "sphere";
      this.radius = radius;
      this.color = [1,1,1,1];
      this.vertices = [];
      this.indices = [];
      this.matrix = new Matrix4();
    }
  
    render() {
      const t = (1.0 + Math.sqrt(5.0)) / 2.0;
      const s = 1.0 / Math.sqrt(t * t + 1);
      const vertices = [
        -s, 0.0, t * s,
         s, 0.0, t * s,
        -s, 0.0, -t * s,
         s, 0.0, -t * s,
         0.0, -t * s, -s,
         0.0, -t * s,  s,
         0.0,  t * s, -s,
         0.0,  t * s,  s,
         t * s, -s, 0.0,
        -t * s, -s, 0.0,
        -t * s,  s, 0.0,
         t * s,  s, 0.0,
        0.0, -s, -t * s,
        0.0, -s,  t * s,
        0.0,  s, -t * s,
        0.0,  s,  t * s,
        -t * s, 0.0, -s,
        -t * s, 0.0,  s,
         t * s, 0.0, -s,
         t * s, 0.0,  s,
        -s, -t * s, 0.0,
         s, -t * s, 0.0,
        -s,  t * s, 0.0,
         s,  t * s, 0.0
      ];
  
      const indices = [
        0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11, 1, 5, 9,
        5, 11, 4, 11, 10, 2, 10, 7, 6, 7, 1, 8, 3, 9, 4, 3, 4, 2,
        3, 2, 6, 3, 6, 8, 3, 8, 9, 4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1
      ];
  
      // Scale and store the vertices
      for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i] * this.radius;
        const y = vertices[i+1] * this.radius;
        const z = vertices[i+2] * this.radius;
        this.vertices.push(x, y, z);
        }

        // Create triangles using indices
        for (let i = 0; i < indices.length; i += 3) {
        const a = indices[i];
        const b = indices[i+1];
        const c = indices[i+2];
        const triangleVertices = [
        this.vertices[a*3], this.vertices[a*3+1], this.vertices[a*3+2],
        this.vertices[b*3], this.vertices[b*3+1], this.vertices[b*3+2],
        this.vertices[c*3], this.vertices[c*3+1], this.vertices[c*3+2]
        ];
        this.indices.push(i, i+1, i+2);
        drawTriangle3d(triangleVertices); // assuming this function is available in the scope
    }
  }

  createIcosphere(numVertices) {
    // Define the initial icosahedron vertices and indices
    const vertices = [    [0, 1, phi], [0, -1, phi], [0, 1, -phi], [0, -1, -phi],
      [1, phi, 0], [-1, phi, 0], [1, -phi, 0], [-1, -phi, 0],
      [phi, 0, 1], [-phi, 0, 1], [phi, 0, -1], [-phi, 0, -1]
    ];
    const indices = [    [0, 1, 8], [0, 1, 10], [0, 4, 8], [0, 4, 5], [0, 5, 10],
      [2, 3, 9], [2, 3, 11], [2, 6, 9], [2, 6, 7], [2, 7, 11],
      [1, 8, 9], [1, 10, 11], [3, 9, 10], [3, 11, 8], [4, 5, 6],
      [4, 6, 7], [4, 7, 8], [5, 6, 9], [5, 10, 11], [7, 8, 11]
    ];
  
    // Subdivide the icosahedron
    for (let i = 0; i < 3; i++) {
      const newVertices = [];
      const newIndices = [];
      for (let j = 0; j < indices.length; j++) {
        const v1 = vertices[indices[j][0]];
        const v2 = vertices[indices[j][1]];
        const v3 = vertices[indices[j][2]];
        const v12 = normalize(midpoint(v1, v2));
        const v23 = normalize(midpoint(v2, v3));
        const v31 = normalize(midpoint(v3, v1));
        const i1 = newVertices.push(v1, v12, v31) - 1;
        const i2 = newVertices.push(v2, v23, v12) - 1;
        const i3 = newVertices.push(v3, v31, v23) - 1;
        newIndices.push([i1, i2, i3], [i1+1, i2+1, i3+1], [i1+2, i2+2, i3+2], [i1, i1+2, i3+1], [i2, i2+1, i1+1], [i3, i3+1, i2+2], [i1+2, i2+1, i3+2], [i1+1, i2+2, i3]);
      }
      vertices.push(...newVertices);
      indices = newIndices;
    }
  
    // Convert vertices to 3D coordinates and return
    return vertices.map(v => {
      const x = v[0] * radius;
      const y = v[1] * radius;
      const z = v[2] * radius;
      return [x, y, z];
    }).slice(0, numVertices);
  }
  
  // Helper function to calculate the midpoint
  
}
  