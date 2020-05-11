export class Space {

    constructor(scene) {
        this.scene = scene;
    }

    barks(count,dist) {
        var height = 0.8;
        var bark = BABYLON.MeshBuilder.CreateCylinder("bark", {height: height, diameterTop: 0.0, diameterBottom: 0.4, tessellation: 16}, this.scene);
        var material    = new BABYLON.StandardMaterial("red", this.scene);  material.ambientColor = material.diffuseColor = BABYLON.Color3.Red();
        bark.material   = material;
        bark.position.y = height/2;
        bark.position.z = +dist*2;
        /**/
        for(var z=1 ; z<count ; z++) {
            var b = bark.clone("");
            b.position.z = bark.position.z + z*dist;
        }
        /**/
    }




    skyDome(vrHelper) { // This is so much more easy with BabylonJS
    	// ???  This line causes twice "Error: WebGL warning: uniformBlockBinding: Index 4294967295 invalid."
        var pic1 = "sky.jpg"                                        // bunt
        var pic2 = "cropped-starglobe-maya-render.jpg"              // black
        var pic3 = "skydome-hdri-starlight-sky-3-3d-model.jpg"      // blue
        var pic4 = "STARGLOBE_SOLARSYSTEM_20121023_X_defish.png"    // X klein? Y *4

    	this.sky = new BABYLON.PhotoDome("sky", /*???p*/'./media/'+pic4, {size: vrHelper.currentVRCamera.maxZ*0.9}, this.scene); //bbb resolution: 64,size: radius*2
    	this.sky.infiniteDistance = true;
        // Error: WebGL warning: uniformBlockBinding: Index 4294967295 invalid.
        //this.sky._mesh.visibility = .001; // does not work, why???  https://www.babylonjs-playground.com/#102TBD#55
    	return this.sky;
    }

    ground(size,teleport,vrHelper) {

        var url = "./media/tiles512.jpg"
        var material = new BABYLON.StandardMaterial("tiles", this.scene);

        var ground = BABYLON.Mesh.CreateGround("ground", size, size, 1, this.scene);
        ground.material = material;
        if(teleport)
            vrHelper.enableTeleportation({ floorMeshName: "ground" });

        material.diffuseTexture = new BABYLON.Texture(url, this.scene);
        material.diffuseTexture.uScale =
        material.diffuseTexture.vScale = size/10;
        console.log("+++ ground NAMED")
        return ground;

    }

    animate = function(dSec) {
        ; //---
    }//animate

}//Space
