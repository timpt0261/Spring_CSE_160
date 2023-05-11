// From 
class Camera {
    constructor() {
        this.eye = new Vector3([0, 0, 0]);
        this.at = new Vector3([0, 0, -100]);
        this.up = new Vector3([0, 1, 0]);
    }

    rotate_horizontal(amount) {
    }

    forward(amount) {
        var f = this.at.sub(this.eye);
        f.normalize();
        f.mul(amount);
        this.at.add(f);
        this.eye.add(f);
    }

    backward() {
        var f = this.eye.subtract(this.at);
        f = f.divide(f.length());
        this.at = this.at.add(f);
        this.eye = this.eye.add(f);
    }

    left() {
        var f = this.eye.set(this.at);
        f = f.div(f.elements.length());
        var s = f.cross(this.up);
        s = s.div(s.elements.length);
        this.at = this.at.add(s);
        this.eye = this.eye.add(s);
    }
}