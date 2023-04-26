class Decahedron {
    constructor() {
      this.vertices = [];
      this.indices = [];
      this.colors = [];
      this.initVertices();
    }
  
    initVertices() {
      // Vertex coordinates
      const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
      const a = 1 / phi;
      const b = 1 / (phi * phi);
      const vertices = [      [ 0, b, -a ],
        [ b, a, 0 ],
        [ -b, a, 0 ],
        [ 0, b, a ],
        [ 0, -b, a ],
        [ -a, 0, b ],
        [ 0, -b, -a ],
        [ a, 0, -b ],
        [ a, 0, b ],
        [ -a, 0, -b ]
      ];
  
      // Face indices
      const indices = [      [ 0, 1, 2 ],
        [ 0, 2, 3 ],
        [ 0, 3, 4 ],
        [ 0, 4, 1 ],
        [ 1, 7, 2 ],
        [ 2, 6, 3 ],
        [ 3, 9, 4 ],
        [ 4, 5, 1 ],
        [ 5, 7, 1 ],
        [ 6, 7, 5 ],
        [ 6, 8, 3 ],
        [ 8, 9, 3 ],
        [ 5, 8, 6 ],
        [ 5, 9, 8 ],
        [ 7, 6, 2 ],
        [ 9, 5, 4 ],
        [ 8, 6, 5 ],
        [ 9, 4, 3 ]
      ];
  
      // Vertex colors
      const colors = [      [ 1.0, 0.0, 0.0, 1.0 ],
        [ 1.0, 1.0, 0.0, 1.0 ],
        [ 0.0, 1.0, 0.0, 1.0 ],
        [ 0.0, 0.0, 1.0, 1.0 ],
        [ 1.0, 0.0, 1.0, 1.0 ],
        [ 0.0, 1.0, 1.0, 1.0 ],
        [ 1.0, 1.0, 1.0, 1.0 ],
        [ 0.5, 0.5, 0.5, 1.0 ],
        [ 1.0, 0.5, 0.5, 1.0 ],
        [ 0.5, 1.0, 0.5, 1.0 ]
      ];
  
      // Flatten vertex and color arrays
      for (let i = 0; i < indices.length; i++) {
        const face = indices[i];
        for (let j = 0; j < face.length; j++) {
          const vertex = vertices[face[j]];
          this.vertices.push(...vertex);
          const color = colors
        
    }

}