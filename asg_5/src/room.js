function createRoom(width, height, depth,scene) {
    const floorGeometry = new THREE.BoxGeometry(width, 0.1, depth);
    const wallGeometry_01 = new THREE.BoxGeometry(0.1, height, depth);
    const wallGeometry_02 = new THREE.BoxGeometry(0.1, height, width);

    const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
    const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc });

    const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
    floorMesh.position.y = -height / 2;
    scene.add(floorMesh);

    const wallMesh1 = new THREE.Mesh(wallGeometry_01, wallMaterial);
    wallMesh1.position.x = -width / 2 + 0.05;
    scene.add(wallMesh1);

    const wallMesh2 = new THREE.Mesh(wallGeometry_01, wallMaterial);
    wallMesh2.position.x = width / 2 - 0.05;
    scene.add(wallMesh2);

    const wallMesh3 = new THREE.Mesh(wallGeometry_02, wallMaterial);
    wallMesh3.position.z = depth / 2 - 0.05;
    wallMesh3.rotation.y = Math.PI / 2;
    scene.add(wallMesh3);

    // create doors
    createDoors(4,8,10, scene);

    return [floorMesh, wallMesh1, wallMesh2, wallMesh3];

}

function deleteRoom()
{
    for(let i = 0; i < 4; i++)
    {
        scene.remove(room[i]);
    }

    return null;
    
}

function createDoors(width, height, step, scene) {
    const doorGeometry = new THREE.BoxGeometry(width, height, 1);
    const doorMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });

    const leftDoorCount = Math.floor(roomDepth / step);
    const rightDoorCount = Math.floor(roomDepth / step);

    for (let i = 0; i < leftDoorCount; i++) {
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(-roomWidth / 2, height / 2 - 5, -roomDepth / 2 + i * step + step / 2);
        door.rotation.y = Math.PI / 2;
        scene.add(door);
    }

    for (let i = 0; i < rightDoorCount; i++) {
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(roomWidth / 2, height / 2 - 5, -roomDepth / 2 + i * step + step / 2);
        door.rotation.y = Math.PI/2;
        scene.add(door);
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