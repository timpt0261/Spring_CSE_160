class Room{
    constructor(width, height, depth, scene){
        this.width = 10;
        this.height = 10;
        this.depth = 10;
        this.scene = scene;
        this.room = [];
        this.doors = new Door(4, 8, 10, scene);
    }

    get getWidth(){
        return this.width;
    }

    set setWidth(value){
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

    createRoom() {
        const floorGeometry = new THREE.BoxGeometry(this.width, 0.1, this.depth);
        const wallGeometry_01 = new THREE.BoxGeometry(0.1, this.height, this.depth);
        const wallGeometry_02 = new THREE.BoxGeometry(0.1, this.height, this.width);

        const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
        const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc });

        const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
        floorMesh.position.y = -this.height / 2;
        scene.add(floorMesh);

        const wallMesh1 = new THREE.Mesh(wallGeometry_01, wallMaterial);
        wallMesh1.position.x = -this.width / 2 + 0.05;
        scene.add(wallMesh1);

        const wallMesh2 = new THREE.Mesh(wallGeometry_01, wallMaterial);
        wallMesh2.position.x = this.width / 2 - 0.05;
        scene.add(wallMesh2);

        const wallMesh3 = new THREE.Mesh(wallGeometry_02, wallMaterial);
        wallMesh3.position.z = this.depth / 2 - 0.05;
        wallMesh3.rotation.y = Math.PI / 2;
        scene.add(wallMesh3);

        // create doors
        this.doors.createDoors();

       this.room = [floorMesh, wallMesh1, wallMesh2, wallMesh3];

    }

    deleteRoom() {

        this.doors.deleteRoom();

        for (let i = 0; i < 4; i++) {
            scene.remove(this.room[i]);
        }

        this.room = null;

    }

}


// Function to create a low-poly torch
function createTorch(scene) {
    const baseGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 6);
    const baseMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
    const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
    scene.add(baseMesh);

    const poleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2, 6);
    const poleMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
    const poleMesh = new THREE.Mesh(poleGeometry, poleMaterial);
    poleMesh.position.y = 1.1;
    scene.add(poleMesh);

    const flameGeometry = new THREE.ConeGeometry(0.6, 1, 6);
    const flameMaterial = new THREE.MeshBasicMaterial({ color: 0xFF4500 });
    const flameMesh = new THREE.Mesh(flameGeometry, flameMaterial);
    flameMesh.position.y = 2.1;
    scene.add(flameMesh);

    // Create a point light at the flame tip
    const flameLight = new THREE.PointLight(0x00FF00, 1, 2);
    flameLight.position.copy(flameMesh.position);
    scene.add(flameLight);
}