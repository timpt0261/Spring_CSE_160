class Furniture{

    constructor(){
        this.loader = new Loader();
        this.furniture = [];
    }

    loadCouch(x,y,z){
        const couchURL_1 = 'Couch_Small1.fbx'
        const onSuccess = (object) =>{
            object.setPostion(x,y,z);
            scene.add(object);

        };
        this.loader.fbxLoader(couchURL_1);

    }

    
    
}