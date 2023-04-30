class Octopus {
    constructor(headSize, bodySize) {
      // Create the head
      this.head = new Icosphere();
      this.head.color = [1, 0.75, 0, 1];
      this.head.matrix.setTranslate(0, 0, 0);
      this.head.matrix.scale(headSize, 1, headSize);
  
      // Create the eyes
      const eyeSize = headSize / 12;
      this.eye1 = new Icosphere();
      this.eye1.color = [0, 0, 0, 1];
      this.eye1.matrix.setTranslate(0.3 * headSize / bodySize, 0.3 * headSize / bodySize, 1.3 * headSize / bodySize);
      this.eye1.matrix.scale(eyeSize, eyeSize, eyeSize);
  
      this.eye2 = new Icosphere();
      this.eye2.color = [0, 0, 0, 1];
      this.eye2.matrix.setTranslate(-0.3 * headSize / bodySize, 0.3 * headSize / bodySize, 1.3 * headSize / bodySize);
      this.eye2.matrix.scale(eyeSize, eyeSize, eyeSize);
  
      // Create the arms
      const armBaseSize = bodySize / 5;
      const armJointSize = bodySize / 8;
      const armEndSize = bodySize / 6;
      const armLength = bodySize / 2;
      this.arm1 = this.createArm(armBaseSize, armJointSize, armEndSize, 1, 0, 0, armLength);
      this.arm2 = this.createArm(armBaseSize, armJointSize, armEndSize, -1, 0, 0, armLength);
      this.arm3 = this.createArm(armBaseSize, armJointSize, armEndSize, 0, 0, 1, armLength);
      this.arm4 = this.createArm(armBaseSize, armJointSize, armEndSize, 0, 0, -1, armLength);
    }
  
    createArm(baseSize, jointSize, endSize, x, y, z, length) {
      const arm = {};
  
      // Create the base
      arm.base = new Cube();
      arm.base.color = [0.5, 0.5, 0.5, 1];
      arm.base.matrix.setTranslate(x * length, -0.7, z * length);
      arm.base.matrix.rotate(-90, 1, 0, 0);
      arm.base.matrix.scale(baseSize, baseSize, baseSize);
  
      // Create the joints
      arm.joint1 = new Cube();
      arm.joint1.color = [0.7, 0, 0, 1];
      arm.joint1.matrix = new Matrix4(arm.base.matrix);
      arm.joint1.matrix.translate(0, -0.4 * baseSize / jointSize, 0);
      arm.joint1.matrix.scale(jointSize, jointSize, jointSize);
  
      arm.joint2 = new Cube();
      arm.joint2.color = [0.8, 0.7, 0.7, 1];
      arm.joint2.matrix = new Matrix4(arm.joint1.matrix);
      arm.joint2.matrix.translate(0, -0.4 * jointSize / endSize, 0);
      arm.joint2.matrix.scale(endSize, endSize, endSize);
      // Create the arm segment
      arm.segment = new Cube();
      arm.segment.color = [0.5, 0.5, 0.5, 1];
      arm.segment.matrix = new Matrix4(arm.joint2.matrix);
      arm.segment.matrix.translate(0, -0.4 * jointSize / endSize, 0);
      arm.segment.matrix.scale(endSize, endSize, endSize);
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
    
        // Render the arms
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
