class Octopus {
    constructor(headSize, bodySize) {
      // Create the head
      this.head = new Icosphere();
      this.head.color = [1, 0.75, 0, 1];
      this.head.matrix.setTranslate(0, .4, 0);
      this.head.matrix.scale(headSize/3, 1/3, headSize/3);
  
      // Create the eyes
      const eyeSize = headSize/12;
      this.eye1 = new Icosphere();
      this.eye1.color = [0, 0, 0, 1]
      this.eye1.matrix = new Matrix4(this.head.matrix);
      this.eye1.matrix.setTranslate(0.2 * headSize / bodySize, 0.6 * headSize / bodySize , -.3 * headSize / bodySize);
      this.eye1.matrix.scale(eyeSize, eyeSize, eyeSize);
  
      this.eye2 = new Icosphere();
      this.eye2.color = [0, 0, 0, 1];
      this.eye2.matrix = new Matrix4(this.head.matrix);
      this.eye2.matrix.setTranslate(-0.2 * headSize / bodySize, 0.6 * headSize / bodySize , -.3 * headSize / bodySize);
      this.eye2.matrix.scale(eyeSize, eyeSize, eyeSize);

      //Create Body
      this.body = new Cube();
      this.body.color = [1, 0.75, 0, 1];
      this.body.matrix = new Matrix4(this.head.matrix);
      this.body.matrix.setTranslate(-0.05, 0.05, -0.06);
      this.body.matrix.scale(.1,.1,.1);
  
      // Create the arms
      const armBaseSize = bodySize / 12;
      const armJointSize = bodySize/1.5;
      const armEndSize = bodySize / 6;
      const armLength = bodySize / 2.4;
      this.arm1 = this.createArm(armBaseSize, armJointSize, armEndSize, 0.1, 0, 0, armLength);
      this.arm1.matrix = new Matrix4(this.head.matrix);
      this.arm2 = this.createArm(armBaseSize, armJointSize, armEndSize, -.3, 0, 0, armLength);
      this.arm2.matrix = new Matrix4(this.head.matrix);
      this.arm3 = this.createArm(armBaseSize, armJointSize, armEndSize, 0, 0, 0.3, armLength);
      this.arm3.matrix = new Matrix4(this.head.matrix);
      this.arm4 = this.createArm(armBaseSize, armJointSize, armEndSize, 0, 0, -.1, armLength);
      this.arm4.matrix = new Matrix4(this.head.matrix);

    }
  
    createArm(baseSize, jointSize, endSize, x, y, z, length) {
      const arm = {};
  
      // Create the base
      arm.base = new Cube();
      arm.base.color = [0.5, 0.5, 0.5, 1];
      arm.base.matrix.setTranslate(x * length, -0.438888, z * length);
      arm.base.matrix.rotate(-90, 1, 0, 0);
      arm.base.matrix.scale(baseSize, baseSize, baseSize+.4);

  
      // Create the joints
      arm.joint1 = new Cube();
      arm.joint1.color = [0.7, 0, 0, 1];
      arm.joint1.matrix = new Matrix4(arm.base.matrix);
      arm.joint1.matrix.translate(0, 0, 0);
      arm.joint1.matrix.scale(jointSize, jointSize, jointSize*.4);
      arm.joint1.matrix.translate(.3,.3,-.9001);
  
      arm.joint2 = new Cube();
      arm.joint2.color = [0.8, 0.7, 0.7, 1];
      arm.joint2.matrix = new Matrix4(arm.joint1.matrix);
      arm.joint2.matrix.translate(0.2, 0.2, -.9601);
      arm.joint2.matrix.scale(endSize*3.5, endSize*3.5, endSize + .78);

      // Create the arm segment
      arm.segment = new Cube();
      arm.segment.color = [0.5, 0.5, 0.5, 1];
      arm.segment.matrix = new Matrix4(arm.joint2.matrix);
      arm.segment.matrix.translate(0.3, 0.3, -.6);
      arm.segment.matrix.scale(endSize*3.5, endSize*3.5, endSize*3.5);
      arm.segment.matrix.scale(1, length, 1);

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
    
        matrix.multiply(arm.joint1.matrix);
        arm.joint1.render();
    
        matrix.multiply(arm.joint2.matrix);
        arm.joint2.render();
    
        matrix.multiply(arm.segment.matrix);
        arm.segment.render();
    }
    

}
