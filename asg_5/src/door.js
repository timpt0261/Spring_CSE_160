class Door{
    constructor(width,height, step,scene){
        this.width = width;
        this.height = height;
        this.step = step;
        this.scene = scene;

        this.doors = new Map();
    }

    get getWidth() {
        return this.width;
    }

    set setWidth(value) {
        this.width = value;
        this.createRoom();
    }

    get getHeight() {
        return this.height;
    }

    set setHeight(value) {
        this.height = value;
        this.createRoom();
    }

    createDoors(r_width,r_depth) {
        const doorGeometry = new THREE.BoxGeometry(this.width, this.height, .9);
        const doorMaterial = new THREE.MeshToonMaterial({ color: 0x0000ff, flatShading: true });

        const leftDoorCount = Math.floor(r_depth / this.step);
        const rightDoorCount = Math.floor(r_depth / this.step);

        for (let i = 0; i < leftDoorCount; i++) {
            const door = new THREE.Mesh(doorGeometry, doorMaterial);
            door.position.set(-r_width / 2, this.height / 2 - 5, -r_depth / 2 + i * this.step + this.step / 2);
            door.rotation.y = Math.PI / 2;
            scene.add(door);
            let name = "left_door_" + String(i);
            this.doors.set(name,door);

        }

        for (let i = 0; i < rightDoorCount; i++) {
            const door = new THREE.Mesh(doorGeometry, doorMaterial);
            door.position.set(r_width / 2, this.height / 2 - 5, -r_depth / 2 + i * this.step + this.step / 2);
            door.rotation.y = Math.PI / 2;
            scene.add(door);
            let name = "right_door_" + String(i);
            this.doors.set(name, door);
        }
    }

    deleteDoors(){
        const doorCount = Math.floor(r_depth / this.step);

        for(const value in this.door.values()){
            this.scene.remove(value);
        }

        this.doors = null;

    }

    

}