class Lamps{

    constructor(lamp, count){
        this.lamp_format = lamp; // Format for all lammps
        this.this.count; // Number of lamps

    }


    // Function to create row of lamps aligned to the ceiling
 createLampsRow(r_width, r_height, r_depth) {
    const lamps = [];
    const lampSpacing = r_width / (this.count + 1);
    const lampRadius = 0.1;
    const lampDepth = 0.2;
    const lampColor = 0xFFFF00;
    const lampIntensity = 1;

    for (let i = 0; i < this.count; i++) {
        const lampGeometry = new THREE.CylinderGeometry(lampRadius, lampRadius, lampDepth, 16);
        const lampMaterial = new THREE.MeshBasicMaterial({ color: lampColor });
        const lamp = new THREE.Mesh(lampGeometry, lampMaterial);

        const lampX = (i + 1) * lampSpacing - r_width / 2;
        const lampY = r_height - 0.05;
        const lampZ = -r_depth / 2;

        lamp.position.set(lampX, lampY, lampZ);
        scene.add(lamp);

        const spotlight = new THREE.SpotLight(0xFFFFFF, lampIntensity);
        spotlight.position.copy(lamp.position);
        spotlight.target.position.set(lampX, 0, lampZ); // Target position same as lamp's x and z
        scene.add(spotlight);
        scene.add(spotlight.target);

        lamps.push(lamp);
    }

    return lamps;
}
}
