class Door {
    constructor(width, height, step) {
        this.width = width;
        this.height = height;
        this.step = step;
        this.doors = [];
    }

    get getWidth() {
        return this.width;
    }

    set setWidth(value) {
        this.width = value;
        this.createDoors();
    }

    get getHeight() {
        return this.height;
    }

    set setHeight(value) {
        this.height = value;
        this.createDoors();
    }

    createDoors(r_width, r_depth, useTexture = false, textureUrl = "") {
        const doorGeometry = new THREE.BoxGeometry(this.width, this.height, 0.6);
        let doorMaterial;

        if (useTexture) {
            const texture = new THREE.TextureLoader().load(textureUrl);
            doorMaterial = new THREE.MeshBasicMaterial({ map: texture });
        } else {
            doorMaterial = new THREE.MeshToonMaterial({ color: 0x0000ff, flatShading: true });
        }

        const leftDoorCount = Math.floor(r_depth / this.step);
        const rightDoorCount = Math.floor(r_depth / this.step);

        for (let i = 0; i < leftDoorCount; i++) {
            const door = new THREE.Mesh(doorGeometry, doorMaterial);
            door.position.set(-r_width / 2, this.height / 2 - 5, -r_depth / 2 + i * this.step + this.step / 2);
            door.rotation.y = Math.PI / 2;
            scene.add(door);
            this.doors.push(door);
        }

        for (let i = 0; i < rightDoorCount; i++) {
            const door = new THREE.Mesh(doorGeometry, doorMaterial);
            door.position.set(r_width / 2, this.height / 2 - 5, -r_depth / 2 + i * this.step + this.step / 2);
            door.rotation.y = Math.PI / 2;
            scene.add(door);
            this.doors.push(door);
        }
    }

    openDoors() {
        for (let i = 0; i < this.doors.length; i++) {
            const door = this.doors[i];
            door.userData.originalRotation = door.rotation.clone();
            const targetRotation = door.userData.originalRotation.clone();
            targetRotation.y += Math.PI / 2;

            new TWEEN.Tween(door.rotation)
                .to(targetRotation, 1000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();
        }
    }

    closeDoors() {
        for (let i = 0; i < this.doors.length; i++) {
            const door = this.doors[i];
            const targetRotation = door.userData.originalRotation.clone();

            new TWEEN.Tween(door.rotation)
                .to(targetRotation, 1000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();
        }
    }

    deleteDoors() {
        for (let i = 0; i < this.doors.length; i++) {
            scene.remove(this.doors[i]);
        }
        this.doors = [];
    }
}
