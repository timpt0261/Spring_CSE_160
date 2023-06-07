class Room {
    constructor(width, height, depth) {
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.room = [];
        this.doors = new Door(4, 8, 10);
        this.lamps = new Lamps(roomSpotlight, 10);
  
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

    get getDepth() {
        return this.depth;
    }

    set setDepth(value) {
        this.depth = value;
        this.createRoom();
    }

    createRoom(useTexture = false, floorTexturePath = "", wallTexture_01Path= "", ceilingTexturePath="") {
        const floorGeometry = new THREE.BoxGeometry(this.width, 0.1, this.depth);
        const wallGeometry_01 = new THREE.BoxGeometry(0.1, this.height, this.depth);
        const wallGeometry_02 = new THREE.BoxGeometry(0.1, this.height, this.width);

        let floorMaterial, wallMaterial_01, wallMaterial_02, ceilingMaterial;

        if (useTexture) {
            const textureLoader = new THREE.TextureLoader();
            const floorTexture = textureLoader.load(floorTexturePath);
            const wallTexture_01 = textureLoader.load(wallTexture_01Path);
            const wallTexture_02 = textureLoader.load(wallTexture_01Path);
            const ceilingTexture = textureLoader.load(ceilingTexturePath);

            floorTexture.minFilter = THREE.NearestFilter;
            wallTexture_01.minFilter = THREE.NearestFilter;
            ceilingTexture.minFilter = THREE.NearestFilter;

            floorTexture.wrapS = THREE.RepeatWrapping;
            floorTexture.wrapT = THREE.RepeatWrapping;
            floorTexture.repeat.set(this.width / 10, this.depth / 10);

            wallTexture_01.wrapS = THREE.RepeatWrapping;
            wallTexture_01.wrapT = THREE.RepeatWrapping;
            wallTexture_01.repeat.set(1, this.height / 10);

            wallTexture_02.wrapS = THREE.RepeatWrapping;
            wallTexture_02.wrapT = THREE.RepeatWrapping;
            wallTexture_02.repeat.set(this.width , this.height / 10);

            ceilingTexture.wrapS = THREE.RepeatWrapping;
            ceilingTexture.wrapT = THREE.RepeatWrapping;
            ceilingTexture.repeat.set(this.width / 10, this.depth / 10);

            floorMaterial = new THREE.MeshToonMaterial({ map: floorTexture, flatShading: true });
            wallMaterial_01 = new THREE.MeshToonMaterial({ map: wallTexture_01, flatShading: true });
            wallMaterial_02 = new THREE.MeshToonMaterial({ map: wallTexture_02, flatShading: true });
            ceilingMaterial = new THREE.MeshToonMaterial({ map: ceilingTexture, flatShading: true });
        } else {
            floorMaterial = new THREE.MeshToonMaterial({ color: 0x808080, flatShading: true });
            wallMaterial_01 = new THREE.MeshToonMaterial({ color: 0xcccccc, flatShading: true });
            wallMaterial_02 = new THREE.MeshToonMaterial({ color: 0xcccccc, flatShading: true });
            ceilingMaterial = new THREE.MeshToonMaterial({ color: 0xffffff, flatShading: true });
        }

        const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
        floorMesh.position.y = -this.height / 2;
        scene.add(floorMesh);

        const ceilingMesh = new THREE.Mesh(floorGeometry, ceilingMaterial);
        ceilingMesh.position.y = this.height / 2;
        scene.add(ceilingMesh);

        const frontWall = new THREE.Mesh(wallGeometry_02, wallMaterial_01);
        frontWall.position.z = this.depth / 2 - 0.05;
        frontWall.rotation.y = Math.PI / 2;
        scene.add(frontWall);

        const backWall = new THREE.Mesh(wallGeometry_02, wallMaterial_01);
        backWall.position.z = -this.depth / 2;
        backWall.rotation.y = Math.PI / 2;
        scene.add(backWall);

        const rightWall = new THREE.Mesh(wallGeometry_01, wallMaterial_02);
        rightWall.position.x = -this.width / 2 + 0.05;
        scene.add(rightWall);

        const leftWall = new THREE.Mesh(wallGeometry_01, wallMaterial_02);
        leftWall.position.x = this.width / 2 - 0.05;
        scene.add(leftWall);

        


        // create doors
        const doorURL = "../public/textures/door_texture.jpg";
        this.doors.createDoors(this.width, this.depth, true, doorURL);
        this.room = [floorMesh, rightWall, leftWall, frontWall, backWall, ceilingMesh];

        // create lamps
        this.lamps.createLampsRow(this.width, this.height, this.depth);

        this.room = [floorMesh, frontWall, backWall, leftWall,rightWall,backWall];

    }


    deleteRoom() {
        this.lamps.deleteLampsRow();
        this.doors.deleteDoors();

        for (let i = 0; i < this.room.length; i++) {
            scene.remove(this.room[i]);
        }

        this.room = [];
    }
}
