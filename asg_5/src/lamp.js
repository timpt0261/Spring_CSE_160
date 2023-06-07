class Lamps {
    constructor(lamp, step) {
        this.lamp = lamp; // Format for all lamps
        this.step = step; // Number of lamps
        this.lamps = []; // Array to store the created lamps
    }

    // Function to create row of lamps aligned to the ceiling
    createLampsRow(r_width, r_height, r_depth) {
        const lampSpacing = 10;
        const lampRadius = 1;
        const lampDepth = 0.2;
        const lampColor = this.lamp === null? 0xFFFF00: this.lamp.color;

        const lightCount = Math.floor(r_depth / this.step);

        for (let i = 0; i < lightCount; i++) {
            const lampGeometry = new THREE.CylinderGeometry(lampRadius, lampRadius, lampDepth, 16);
            const lampMaterial = new THREE.MeshBasicMaterial({ color: lampColor });
            const lamp = new THREE.Mesh(lampGeometry, lampMaterial);

            const lampX = r_width / 2 - 7;
            const lampY = r_height - 5.51;
            const lampZ = -r_depth / 2 + (i+.5) * lampSpacing;

            lamp.position.set(lampX, lampY, lampZ);
            scene.add(lamp);

            const spotlight = this.lamp.clone(); // Clone the provided lamp
            spotlight.position.copy(lamp.position);
            spotlight.target.position.set(lampX, 0, lampZ); // Target position same as lamp's x and z
            scene.add(spotlight);
            scene.add(spotlight.target);

            this.lamps.push({ lamp, spotlight });
        }

        return this.lamps;
    }

    deleteLampsRow() {
        for (let i = 0; i < this.lamps.length; i++) {
            const { lamp, spotlight } = this.lamps[i];
            scene.remove(lamp);
            scene.remove(spotlight);
        }
        this.lamps = [];
    }

    // Function to animate the lights
    animateLights() {
        const randomIndex = Math.floor(Math.random() * this.lamps.length);
        const { spotlight } = this.lamps[randomIndex];

        new TWEEN.Tween(spotlight)
            .to({ intensity: 0 }, 500)
            .repeat(3)
            .yoyo(true)
            .start();
    }
}
