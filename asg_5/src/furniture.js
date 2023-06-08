class Furniture {
    constructor() {
        this.loader = new Loader();
        this.furniture = new Map();
    }

    #onSuccess(object, position, rotation, scale) {
        object.position.set(position[0], position[1], position[2]);
        object.rotation.set(rotation[0], rotation[1], rotation[2]);
        object.scale.set(scale[0], scale[1], scale[2]);

        scene.add(object);
        this.furniture.set(object.name, object);
        console.log("Loaded successfully");
    }

    #onProgress(xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    }

    #onError(error) {
        console.error("An error occurred while loading the object:", error);
    }

    loadItem(
        url,
        position = [0, 0, 0],
        rotation = [0, 0, 0],
        scale = [1, 1, 1],
        type = "FBX",
        mtlUrl = ""
    ) {
        const defaultMtlUrl = "materials.mtl";
        const mtlUrlToLoad = mtlUrl !== "" ? mtlUrl : defaultMtlUrl;

        if (type === "FBX") {
            this.loader.loadFBX(
                url,
                (object) => this.#onSuccess(object, position, rotation, scale),
                (xhr) => this.#onProgress(xhr),
                (error) => this.#onError(error)
            );
        } else if (type === "OBJ") {
            this.loader.loadOBJWithMTL(
                url,
                mtlUrlToLoad,
                (object) => this.#onSuccess(object, position, rotation, scale),
                (xhr) => this.#onProgress(xhr),
                (error) => this.#onError(error)
            );
        }
    }

    placeCoffeTable(r_depth){
        const coffeeTablePosition_01 = [-2, -5, r_depth- 147];
        const coffeeTableRotation_01 = [0, 0, 0];
        const coffeeTableScale = [10, 10, 10];

        this.loadItem(
            coffeeTable.obj,
            coffeeTablePosition_01,
            coffeeTableRotation_01,
            coffeeTableScale,
            'OBJ',
            coffeeTable.mtl
        );
        
        if(r_depth > 20){
            const coffeeTablePosition_02 = [-2, -5, 47];
            const coffeeTableRotation_02 = [0, 0, 0];

            this.loadItem(
                coffeeTable.obj,
                coffeeTablePosition_02,
                coffeeTableRotation_02,
                coffeeTableScale,
                'OBJ',
                coffeeTable.mtl
            );

        }
        
    }


    placePaintings(r_depth){
        const step = 10;

        const leftPaintingCount = Math.floor(r_depth/step);
        const rightPaintingCount = Math.floor(r_depth / step);

        // for (let i = 0; i < leftPaintingCount; i++){
            

        //     if(i % 2 === 1){
               

        //     }else{
        //         const paintingPostion = [0, 0, 0];
        //         const paintingRotation = [0, 0, 0];
        //         const paintingScale = [1, 1, 1];

        //     }

            

        // }

        const paintingPostion_01 = [7.26, 0, 0];
        const paintingRotation_01 = [0, Math.PI/2, 0];
        const paintingScale_01 = [3.5, 3.5, 3.5];

        this.loadItem(
            wallPainting_00.obj,
            paintingPostion_01,
            paintingRotation_01,
            paintingScale_01,
            'OBJ',
            wallPainting_00.mtl
        );

        const paintingPostion_02 = [-7.36, 0, 0];
        const paintingRotation_02 = [Math.PI / 2, 0, -Math.PI / 2];
        const paintingScale_02 = [.02, .02, .02];

        this.loadItem(
            wallPainting_01.obj,
            paintingPostion_02,
            paintingRotation_02,
            paintingScale_02,
            'OBJ',
            wallPainting_01.mtl
        );
        


    }


    deleteItem(itemName) {
        const item = this.furniture.get(itemName);
        if (item) {
            scene.remove(item);
            this.furniture.delete(itemName);
        }
    }

    deleteItems() {
        for (const item of this.furniture.values()) {
            scene.remove(item);
        }
        this.furniture.clear();
    }
}
