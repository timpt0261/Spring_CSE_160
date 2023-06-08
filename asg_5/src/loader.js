class Loader {
    constructor() {
        this.objLoader = new THREE.OBJLoader();
        this.mtlLoader = new THREE.MTLLoader();
        this.fbxLoader = new THREE.FBXLoader();
    }

    loadOBJWithMTL(objUrl, mtlUrl, onSuccess, onProgress, onError) {
        const objPath = `../public/obj/${objUrl}`;
        const mtlPath = `../public/obj/${mtlUrl}`;
        const mtlBakPath = `../public/obj/${mtlUrl}.bak`;

        const mtlToLoad = this.checkFileExists(mtlBakPath) ? mtlBakPath : mtlPath;

        this.mtlLoader.load(mtlToLoad, (mtl) => {
            mtl.preload();
            this.objLoader.setMaterials(mtl);
            this.objLoader.load(objPath, onSuccess, onProgress, onError);
        });
    }

    checkFileExists(url) {
        const xhr = new XMLHttpRequest();
        xhr.open('HEAD', url, false);
        xhr.send();
        return xhr.status !== 404;
    }

    loadFBX(url, onSuccess, onProgress, onError) {
        const fbxPath = `../public/fbx/${url}`;
        this.fbxLoader.load(fbxPath, onSuccess, onProgress, onError);
    }
}