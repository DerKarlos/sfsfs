export class Maze {


    constructor(width,scene) {
        this.width = width;
                    //. . . . . . . .
        this.grid = ["#############"
                    ,"#           #"
                    ,"# ######### #"
                    ,"# #       # #"
                    ,"# # ##### # #"
                    ,"# #     # # #"
                    ,"# #     # # #"
                    ,"# #       #  "
                    ,"# # #########"
                    ,"# #         #"
                    ,"# ######### #"
                    ,"#           #"
                    ,"#############"
                    ]

        // hedge
        var  material = new BABYLON.StandardMaterial("material", scene);  material.ambientColor = material.diffuseColor = BABYLON.Color3.Green();
        var  high = 3.0 // hight
        this.size = 0.6 // 1 meter
        this.hedge   = BABYLON.MeshBuilder.CreateBox( "hedge", {height:high, width:this.size, depth:this.size},  scene);
        this.hedge.material = material;
        this.hedge.position.y = high/2;
        this.hedgeArray = [this.hedge];

        this.rowPos = 0;
        for(var rowIndex=0 ; rowIndex<this.grid.length ; rowIndex++) {

            // space?  use size, wall: use 1
            var squares = (rowIndex%2) ? this.width : 1;
            for(var square=0 ; square<squares ; square++) {
                this.drawRow(rowIndex);
                this.rowPos++; // next position
            }

        }


        this.maze = BABYLON.Mesh.MergeMeshes(this.hedgeArray);
    }



    drawRow(rowIndex) {

        var line = this.grid[rowIndex];
        console.log(line);

        var columnPos = 0;
        for(var columnIndex=0 ; columnIndex<line.length ; columnIndex++) {

             // space?  use size, wall: use 1
            var squares = (columnIndex%2) ? this.width : 1;
            for(var square=0 ; square<squares ; square++) {

                var matzeSquare = line.substr(columnIndex,1);
                if(matzeSquare=="#") { // hedge present?
                    var h = this.hedge.clone("");
                    h.position.x = columnPos   * this.size;
                    h.position.z = this.rowPos * this.size;
                    this.hedgeArray.push(h);
                }
                columnPos++; // next position

            }


        }

    }

}
