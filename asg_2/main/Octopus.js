class Octopus {
    constructor(headSize, bodySize, color) {
      this.color = color;

      //Create Body
      this.body = new Cube();
      this.body.color = this.color;
      this.body.matrix.translate(-0.05, 0.05, -0.06);
      this.body.matrix.scale(.1, .1, .1);
      var bodyCoordinatematrix = new Matrix4(this.body.matrix);


      // Create the head
      this.head = new Icosphere();
      this.head.color = this.color;
      this.head.matrix = bodyCoordinatematrix;
      this.head.matrix.setTranslate(0, .4, 0);
      this.head.matrix.rotate(-g_headAngles[0], 1, 0, 0);
      this.head.matrix.rotate(-g_headAngles[1], 0, 1, 0);
      // this.head.matrix.rotate(-g_headAngles[2], 0, 0, 1);
      var headMatCoordinates = new Matrix4(this.head.matrix);
      this.head.matrix.scale(headSize/3, 1/3, headSize/3);
  
      // Create the eyes
      const eyeSize = headSize/12;
      this.eye1 = new Icosphere();
      this.eye1.color = [0,0,0,1];
      this.eye1.matrix = new Matrix4(headMatCoordinates);
      this.eye1.matrix.translate(0.2 * headSize / bodySize, -0.2 * headSize / bodySize , -.3 * headSize / bodySize);
      this.eye1.matrix.scale(eyeSize, eyeSize, eyeSize);
  
      this.eye2 = new Icosphere();
      this.eye2.color = [0,0,0,1];
      this.eye2.matrix = new Matrix4(headMatCoordinates);
      this.eye2.matrix.translate(-0.2 * headSize / bodySize, -0.2 * headSize / bodySize , -.3 * headSize / bodySize);
      this.eye2.matrix.scale(eyeSize, eyeSize, eyeSize);


  
      // Create the arms
      const armBaseSize = bodySize / 12;
      const armJointSize = bodySize/1.5;
      const armEndSize = bodySize / 6;
      const armLength = bodySize / 2.4;
      this.arm1 = this.createArm(armBaseSize, armJointSize, armEndSize, 0.1, 0, 0, armLength, bodyCoordinatematrix,g_tentacleAngle_001);
      this.arm1.matrix = new Matrix4(this.body.matrix);
      this.arm2 = this.createArm(armBaseSize, armJointSize, armEndSize, -.3, 0, 0, armLength, bodyCoordinatematrix, g_tentacleAngle_002);
      this.arm2.matrix = new Matrix4(this.body.matrix);
      this.arm3 = this.createArm(armBaseSize, armJointSize, armEndSize, 0, 0, 0.3, armLength, bodyCoordinatematrix, g_tentacleAngle_003);
      this.arm3.matrix = new Matrix4(this.body.matrix);
      this.arm4 = this.createArm(armBaseSize, armJointSize, armEndSize, 0, 0, -.1, armLength, bodyCoordinatematrix, g_tentacleAngle_004);
      this.arm4.matrix = new Matrix4(this.body.matrix);

    }
  
    createArm(baseSize, jointSize, endSize, x, y, z, length, matrix, rotateAngle) {
      const arm = {};
  
      // Create the base
      arm.base = new Cube();
      arm.base.color = this.color;
      // arm.base.matrix = matrix;
      arm.base.matrix.translate(x * length, -0.438888, z * length);
      arm.base.matrix.rotate(-90, 1, 0, 0);
      arm.base.matrix.rotate(rotateAngle[0][0], 1, 0, 0);
      arm.base.matrix.rotate(rotateAngle[0][1], 0, 1, 0);
      arm.base.matrix.rotate(rotateAngle[0][2], 0, 0, 1);
      arm.base.matrix.scale(baseSize, baseSize, baseSize+.4);

  
      // Create the joints
      arm.segment1 = new Cube();
      arm.segment1.color = this.color;
      arm.segment1.matrix = new Matrix4(arm.base.matrix);
      arm.segment1.matrix.translate(0, 0, 0);
      arm.segment1.matrix.rotate(rotateAngle[1][0], 1, 0, 0);
      arm.segment1.matrix.rotate(rotateAngle[1][1], 0, 1, 0);
      arm.segment1.matrix.rotate(rotateAngle[1][2], 0, 0, 1);
      arm.segment1.matrix.scale(jointSize, jointSize, jointSize*.4);
      arm.segment1.matrix.translate(.3,.3,-.9001);
   
  
      arm.segment2 = new Cube();
      arm.segment2.color = this.color;
      arm.segment2.matrix = new Matrix4(arm.segment1.matrix);
      arm.segment2.matrix.translate(0.2, 0.2, -.9601);
      arm.segment2.matrix.rotate(rotateAngle[2][0], 1, 0, 0);
      arm.segment2.matrix.rotate(rotateAngle[2][1], 0, 1, 0);
      arm.segment2.matrix.rotate(rotateAngle[2][2], 0, 0, 1);
      arm.segment2.matrix.scale(endSize*3.5, endSize*3.5, endSize + .78);

      // Create the arm tail
      arm.tail = new Cube();
      arm.tail.color = this.color;
      arm.tail.matrix = new Matrix4(arm.segment2.matrix);
      arm.tail.matrix.translate(0.3, 0.3, -.6);
      arm.tail.matrix.rotate(rotateAngle[3][0], 1, 0, 0);
      arm.tail.matrix.rotate(rotateAngle[3][1], 0, 1, 0);
      arm.tail.matrix.rotate(rotateAngle[3][2], 0, 0, 1);
      arm.tail.matrix.scale(endSize*3.5, endSize*3.5, endSize*3.5);
      arm.tail.matrix.scale(1, length, 1);

      return arm;
    }

    render(parentMatrix) {
        const matrix = new Matrix4(parentMatrix);
        matrix.translate(0, -0.5, 0);
        
        // Render the head
        this.head.render();
    
        // Render the eyes
        this.eye1.render();
        this.eye2.render();

        this.body.render();
    
        //Render the arms
        this.renderArm(this.arm1, matrix);
        this.renderArm(this.arm2, matrix);
        this.renderArm(this.arm3, matrix);
        this.renderArm(this.arm4, matrix);
    }
    
    renderArm(arm, parentMatrix) {
        const matrix = new Matrix4(parentMatrix);
        matrix.multiply(arm.base.matrix);
        arm.base.render();
    
        matrix.multiply(arm.segment1.matrix);
        arm.segment1.render();
    
        matrix.multiply(arm.segment2.matrix);
        arm.segment2.render();
    
        matrix.multiply(arm.tail.matrix);
        arm.tail.render();
    }
    

}
