class Chunk {
    constructor(width, length, height, place_height, height_skip = 1) {
        this.width = width;
        this.length = length;
        this.height = height;

        this.blocks = new Array();
        for (var x = 0; x < width; x++) {
            this.blocks[x] = new Array();
            for (var y = 0; y < height; y++) {
                this.blocks[x][y] = new Array();
                for (var z = 0; z < length; z++) {
                    this.blocks[x][y][z] = 1;
                    if (y > place_height) {
                        this.blocks[x][y][z] = 0;
                    }
                    //if(y === 0 || y === (height -1)   ||   x === 0 || x === (width -1)   ||   z === 0 || z === (length -1))
                    //  if(y === 0 || y === (height -1)   ||   x === 0 || x === (width -1))
                    //  {
                    //    this.blocks[x][y][z] = -1;
                    //    console.log("making block");
                    //  }
                    //  else{
                    //    console.log("making null block");
                    //  }
                }
            }
        }
    }

    blockExists(x, y, z) {
        //console.log("blockExists1: " + x + ", " + y + ", " + z);
        if (y < 0) {
            return false;
        }
        if (x < this.width && x >= 0 && y < this.height && z < this.length && z >= 0) {
            //console.log("blockExists2: " + this.blocks[x][y][z]);
            return (this.blocks[x][y][z] != 0);
        }
        return false;
    }

    deleteBlock(x, y, z) {
        //console.log("deleting block at: " + x + ", " + y + ", " + z);
        if (x < this.width && x >= 0 && y < this.height && y >= 0 && z < this.length && z >= 0) {
            //console.log("existing block: " + this.blocks[x][y][z]);
            var sucess = (this.blocks[x][y][z] != 0);
            this.blocks[x][y][z] = 0;
            //console.log("after block: " + this.blocks[x][y][z]);
            return sucess;
        }
        return false;
    }


    createBlock(x, y, z, blockType) {
        //console.log("creating block at: " + x + ", " + y + ", " + z + "  of type: " + blockType);
        if (x < this.width && x >= 0 && y < this.height && y >= 0 && z < this.length && z >= 0) {
            //console.log("existing block: " + this.blocks[x][y][z]);
            this.blocks[x][y][z] = blockType;
            //console.log("after block: " + this.blocks[x][y][z]);
        }
    }


    render(rootMatrix) {
        var curBlock = new Cube();
        curBlock.color = [0.5, 0.5, 0.5, 1.0];
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                for (var z = 0; z < this.length; z++) {
                    if (this.blocks[x, y, z] && this.blocks[x][y][z] != 0) {
                        //var curBlock = new Cube();
                        //curBlock.color = [1.0, 1.0, 1.0, 1.0];
                        curBlock.matrix.setIdentity();
                        curBlock.matrix.translate(x, y, z);
                        curBlock.textureNum = this.blocks[x][y][z];
                        curBlock.render();
                    }
                }
            }
        }
    }
}