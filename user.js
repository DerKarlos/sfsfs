import { setCamera  } from './functions.js';


export class User {

    constructor(scene) {
        this.scene = scene;

        //// User (root, body and camera position)
        this.root = new BABYLON.TransformNode("root", scene);
        //is.root.reIntegrateRotationIntoRotationQuaternion = true
        this.resetPositionAndRotation();

        /****************/
        var body        = BABYLON.MeshBuilder.CreateCylinder("plattform", {height: 0.1, diameterTop: 1.0, diameterBottom: 1.0, tessellation: 32}, scene);
        var material    = new BABYLON.StandardMaterial("grey", scene);  material.ambientColor = material.diffuseColor = BABYLON.Color3.Gray();
        body.material   = material;
        body.parent     = this.root;
        /****************/

        this.cameraOffset1 = new BABYLON.Vector3( 0.0, 1.6, -0);  // 0.8 für bike
        this.cameraOffset3 = new BABYLON.Vector3( 0.5, 3.8, -5);  // 3rd person view
        this.speedPosition = new BABYLON.Vector3();
        this.speedRotation = new BABYLON.Vector3();
        this.speedRotWorld = new BABYLON.Vector3();

        this.control = undefined;
    }

    setSpeed(position,rotation) {
        if(position) this.speedPosition.copyFrom(position);
        if(rotation) this.speedRotation.copyFrom(rotation);
    }


    setAcceleratoin(position,rotation) {
        if(position) this.speedPosition.addInPlace(position);
        if(rotation) this.speedRotation.addInPlace(rotation);
    }


    stop(dSec) {
        var factor = 1 - dSec*1;
        this.speedPosition.scaleInPlace(factor);
        this.speedRotation.scaleInPlace(factor);

        if(this.speedPosition.length + this.speedRotation.length < 0.01) {
            this.speedPosition = BABYLON.Vector3.Zero();
            this.speedRotation = BABYLON.Vector3.Zero();
            return false;
        }
        else return true;
    }


    resetPositionAndRotation() {
        this.speedPosition = BABYLON.Vector3.Zero();
        this.speedRotation = BABYLON.Vector3.Zero();
        this.root.position           = BABYLON.Vector3.Zero()
        this.root.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(0, 0.00001/*Why is 0 so od in Babslon???*/, 0);
    }

    // move is part of the controls but is done direct by the user mash
    animate(dSec,vrHelper){

        if( this.control ) {
            this.control.animate(dSec,vrHelper);
        }

        var limit = 5000.0;
        var min = new BABYLON.Vector3(-limit,-limit,-limit);
        var max = new BABYLON.Vector3(+limit,+limit,+limit);
        this.speedPosition = BABYLON.Vector3.Clamp(this.speedPosition,min,max);

        this.root.locallyTranslate(this.speedPosition.scale(dSec));         // relatige to ship  OR:   this.root.translate(this.speedPosition, 1 , Space.LOCAL);     // relatige to ship

        this.root.rotate(BABYLON.Axis.Y, this.speedRotation.y*dSec, BABYLON.Space.LOCAL); // not .WORLD

        // Does the VR-Helper do the mouse rotation?
        // Is there a way to disable it?
        // We have to UNDO it: Does not work that nice!
        var euler = this.root.rotationQuaternion.toEulerAngles();
        this.root.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(euler.y, 0, 0);

        // NO!:  https://doc.babylonjs.com/resources/rotation_conventions#euler-angles-to-quaternions
        // thisroot.rotationQuaternion.addInPlace(BABYLON.Quaternion.RotationYawPitchRoll(speedRotation.y, speedRotation.x, speedRotation.z) );

        var cameraOffset = vrHelper.isInVRMode ? this.cameraOffset1 : this.cameraOffset3;

        var camPos = new BABYLON.AbstractMesh("camPos");
        camPos.rotationQuaternion = this.root.rotationQuaternion;
        camPos.position           = this.root.position.clone();
        camPos.locallyTranslate(cameraOffset);
        setCamera(  camPos.position,
                    camPos.rotationQuaternion,
                    vrHelper );

    }

}
