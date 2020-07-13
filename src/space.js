import { rad,grad } from './functions.js';

export class Space {

    constructor(scene) {
        this._scene = scene;
    }


    barks(count,dist) {
        var height = 0.8;
        var bark = BABYLON.MeshBuilder.CreateCylinder("bark", {height: height, diameterTop: 0.0, diameterBottom: 0.4, tessellation: 16}, this._scene);
        var material    = new BABYLON.StandardMaterial("red", this._scene);  material.ambientColor = material.diffuseColor = BABYLON.Color3.Red();
        bark.material   = material;
        bark.position.y = height/2;
        bark.position.z = +dist*2;
        for(var z=1 ; z<count ; z++) {
            var b = bark.clone("");
            b.position.z = bark.position.z + z*dist;
        }
    }
    // barks


    skyDome(xrHelper) { // This is so much more easy with BabylonJS
        var pic1 = "sky.jpg"                                        // bunt
        var pic2 = "cropped-starglobe-maya-render.jpg"              // black
        var pic3 = "skydome-hdri-starlight-sky-3-3d-model.jpg"      // blue
        var pic4 = "STARGLOBE_SOLARSYSTEM_20121023_X_defish.png"    // X klein? Y *4

        if(          typeof xrHelper.baseExperience !== "undefined") {
            console.log("\\\\\\ CALL: space.js skyDome(scene.actualCamera)")
            var camera = xrHelper.baseExperience.camera
        } else {
            var camera = xrHelper;
        }

        // ???p './media/'+pic4
    	this.sky = new BABYLON.PhotoDome("sky", './media/'+pic4, {size: camera.maxZ*0.9}, this._scene); //bbb resolution: 64,size: radius*2
    	this.sky.infiniteDistance = true;
        this.sky.rotation.y = grad(45);
        // ???  This line causes twice "Error: WebGL warning: uniformBlockBinding: Index 4294967295 invalid."
        // https://forum.babylonjs.com/t/babylon-photodome-causes-webgl-warning-uniformblockbinding-using-firefox/11515
            // about:config  webgl.disable-angle;true webgl.bypass-shader-validation;true

        //this.sky._mesh.visibility = .001; // does not work, why???  https://www.babylonjs-playground.com/#102TBD#55
        /**/
    	return this.sky;
    }
    // skyDome

/***/

    ground(size,teleport,xrHelper) {

        const spec = 0.2  // ein bischen Glanz ist ok
        var url = "./media/tiles512.jpg"
        var material = new BABYLON.StandardMaterial("tiles", this._scene);
            material.specularColor = new BABYLON.Color3(spec,spec,spec);  /// JUHU der sch.. Glanz ist weg!

        var ground = BABYLON.Mesh.CreateGround("ground", size, size, 1, this._scene);
        ground.material = material;
        if(teleport)
            xrHelper.teleportation.addFloorMesh(ground); // floorMeshName: "ground"

        material.diffuseTexture = new BABYLON.Texture(url, this._scene);
        material.diffuseTexture.uScale =
        material.diffuseTexture.vScale = size/10;
        return ground;

    }

/**/

groundCylinder(size,teleport,xrHelper) {

    const spec = 0.2  // ein bischen Glanz ist ok
    var url = "./media/tiles512.jpg"
    var material = new BABYLON.StandardMaterial("tiles", this._scene);
        material.specularColor = new BABYLON.Color3(spec,spec,spec);  /// JUHU der sch.. Glanz ist weg!

    var ground = BABYLON.MeshBuilder.CreateDisc("round", {radius: size}, this._scene)
    //               BABYLON.Mesh.CreateGround("ground", size, size, 1, this._scene);
    ground.rotation.x = rad(90);
    ground.material = material;
    if(teleport)
        xrHelper.teleportation.addFloorMesh(ground); // floorMeshName: "ground"

    material.diffuseTexture = new BABYLON.Texture(url, this._scene);
    material.diffuseTexture.uScale =
    material.diffuseTexture.vScale = size/100;
    return ground;

}

/**/

    animate(dSec) {
        ;
    }//animate

/**/


}
