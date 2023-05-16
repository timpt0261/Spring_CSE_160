// Credit chaGPT
// Creates Icosphere mesh
const X = 0.525731112119133606;
const Z = 0.850650808352039932;

class Icosphere {
    constructor(radius,subdivisions) {
      this.type = "icosphere";
      this.radius = radius;
      this.subdivisions = subdivisions;
      this.color = [1,1,1,1];
      this.verticies = [
        [-X, 0.0, Z],
        [X, 0.0, Z],
        [-X, 0.0, -Z],
        [X, 0.0, -Z],
        [0.0, Z, X],
        [0.0, Z, -X],
        [0.0, -Z, X],
        [0.0, -Z, -X],
        [Z, X, 0.0],
        [-Z, X, 0.0],
        [Z, -X, 0.0],
        [-Z, -X, 0.0]
      ];
      this.indices = [
        [0, 4, 1],
        [0, 9, 4],
        [9, 5, 4],
        [4, 5, 8],
        [4, 8, 1],
        [8, 10, 1],
        [8, 3, 10],
        [5, 3, 8],
        [5, 2, 3],
        [2, 7, 3],
        [7, 10, 3],
        [7, 6, 10],
        [7, 11, 6],
        [11, 0, 6],
        [0, 1, 6],
        [6, 1, 10],
        [9, 0, 11],
        [9, 11, 2],
        [9, 2, 5],
        [7, 2, 11]
      ];
      this.matrix = new Matrix4();
    }
  
    render() {
      var rgba = this.color;
      var verticies = this.verticies;
      var indices = this.indices
      var radius = this.radius;

      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
      

      for(var i=0; i<indices.length;i++){
        const verts_1 = indices[i][0];
        const verts_2 = indices[i][1];
        const verts_3 = indices[i][2]; 

        console.log(verticies[verts_1][0]);

        var triangleCoor = [verticies[verts_1][0], verticies[verts_1][1], verticies[verts_1][2],
                            verticies[verts_2][0], verticies[verts_2][1], verticies[verts_2][2],
                            verticies[verts_3][0], verticies[verts_3][1], verticies[verts_3][2],
                            ];
        if(i==10){
            // Pass the color of a point to FragColor uniform variable
            gl.uniform4f(u_FragColor, rgba[0]*.9,rgba[1]*.9,rgba[2]*.9,rgba[3]);

        }
       drawTriangle3D(triangleCoor);
                         
      }
      
    }
  }


  