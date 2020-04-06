import { grad,setDeadZone,Ramp3  } from './functions.js';
// rad,loadGlb,Ramp,

export class Control {

    constructor(controledObject, scene, engine, vrHelper){
        this.controledObject = controledObject;
        this.scene           = scene;

        this.keyLeftRight  = 0;
        this.keyUpDown     = 0;
        this.keyUeAe       = 0;
        this.keyPagePS     = 0; // Page Up/Down = Plus/Sharpe-Keys
        this.keyMPoint     = 0; //                Minus/Point-Keys
        this.joystick      = new BABYLON.Vector3();

        this.rampPosition  = new Ramp3();
        this.rampRotation  = new Ramp3();

        this.cameraRotationStartY = 0;

        this.rotationRelativMesh = new BABYLON.Mesh("rota",this.scene);

        document.addEventListener("keydown", this.onKeyDown.bind(this), false);
        document.addEventListener("keyup",   this.onKeyUp.bind(this),   false);
        window.addEventListener(  "resize",  function(){ engine.resize(); }  );


        //// Oclus controls      https://playground.babylonjs.com/#0IBX3Y#1
        vrHelper.onControllerMeshLoaded.add((webVRController)=>{
            control.joystick.x = 0.1;
            // buttons
            webVRController.onBButtonStateChangedObservable.add((stateObject)=>{
                // if(webVRController.hand ==='right') -- enable both controller       Y <=> B
                this.resetPositionAndRotation();
            });

            webVRController.onAButtonStateChangedObservable.add((stateObject)=>{ //    X <=> A
                if(stateObject.pressed === true){
                    this.stop = true;
                } else {
                    this.stop = false;
                }


            });

            webVRController.onPadStateChangedObservable.add((stateObject)=>{
                //???
            });

            webVRController.onTriggerStateChangedObservable.add((stateObject)=>{
                this.joystick.z = stateObject.value;
            });

            webVRController.onSecondaryTriggerStateChangedObservable.add((stateObject)=>{
                this.joystick.z = -stateObject.value;
            });

            // joystick:
            webVRController.onPadValuesChangedObservable.add((stateObject)=>{
                // if(webVRController.hand ==='right') -- enable both controller
                {
                    control.joystick.x = stateObject.x;
                    control.joystick.y = stateObject.y;
                }
            }); // onPadValuesChangedObservable

        });     // onControllerMeshLoaded


    }// constructor


    resetPositionAndRotation() {
        this.rampPosition.reset();
        this.rampRotation.reset();
        this.controledObject.resetPositionAndRotation();
    }


    onKeyDown(evt) {
        switch (evt.keyCode) {
            case  13: this.resetPositionAndRotation(); break; // return
            case  32: this.stop = true;                break; // space
            case  39: this.keyLeftRight = +1;          break; // right
            case  37: this.keyLeftRight = -1;          break; // left
            case  38: this.keyUpDown    = +1;          break; // up
            case  40: this.keyUpDown    = -1;          break; // down
            case 163: this.keyPagePS    = +1;          break; // +
            case 171: this.keyPagePS    = -1;          break; // #
            case 173: this.keyMPoint    = +1;          break; // -
            case 190: this.keyMPoint    = -1;          break; // .

            case 222: this.keyUeAe      = +1;          break; // ü
            case 219: this.keyUeAe      = -1;          break; // ä

            default: console.log("KEY: "+evt.keyCode);
        }
    }

    onKeyUp(evt) {
        switch (evt.keyCode) {
            case  32:           this.stop = false;      break;
            case  39: case  37: this.keyLeftRight =  0; break;
            case  38: case  40: this.keyUpDown    =  0; break;
            case 163: case 171: this.keyPagePS    =  0; break;
            case 173: case 190: this.keyMPoint    =  0; break;
            case 222: case 219: this.keyUeAe      =  0; break;
        }
    }

    animate(dSec,vrHelper) { // Control
        var controledObject = this.controledObject;


        this.rotationRelativMesh.rotationQuaternion = vrHelper.webVRCamera.deviceRotationQuaternion.clone();

        var  rotationDevice = vrHelper.webVRCamera.deviceRotationQuaternion.toEulerAngles();
        var  rotationCamera = vrHelper.webVRCamera.      rotationQuaternion.toEulerAngles();

        this.rotationRelativMesh.rotate(BABYLON.Axis.Y, -rotationCamera.y, BABYLON.Space.LOCAL);
        this.rotationRelativMesh.rotate(BABYLON.Axis.X, -rotationCamera.x, BABYLON.Space.LOCAL);
        this.rotationRelativMesh.rotate(BABYLON.Axis.Z, -rotationCamera.z, BABYLON.Space.LOCAL);

        var xPos = 0;
        var zPos = 0;
        if(vrHelper.isInVRMode) {

            this.rotationRelativMesh.position           = vrHelper.webVRCamera.devicePosition.clone();
            this.rotationRelativMesh.position.subtractInPlace(this.controledObject.root.position);
            this.scene.hud.out([vrHelper.webVRCamera.devicePosition,
                                this.controledObject.root.position,
                                this.rotationRelativMesh.position
                               ]);
            xPos = this.rotationRelativMesh.position.x;
            zPos = this.rotationRelativMesh.position.z;
        }

        var  rotationRelativ = this.rotationRelativMesh.rotationQuaternion.toEulerAngles();
        var  yRel = +rotationRelativ.y;

        var accelInputX  = setDeadZone(this.joystick.x) * +1; // +/- 0.2 to 1.0  becomes  0.0 to 1.0
        var accelInputY  = setDeadZone(this.joystick.y) * -1;
        var accelInputZ  = setDeadZone(this.joystick.z) * +1;

        if( this.stop )
            this.stop = controledObject.stop(dSec);


        var accelerationPosition = this.rampPosition.ramping(
            +0             +0              +xPos,  // shift
            +accelInputZ   +this.keyPagePS +0,     // rise
            +accelInputY   +this.keyUpDown +zPos,  // speed
            dSec);



        var accelerationRotation = this.rampRotation.ramping(
            /*    */ -0/*elInputZ*/ +this.keyUeAe,        // v^   roll  z  ///  -accelInputZ+this.keyPagePS,
            /*yRel*/ +accelInputX   +this.keyLeftRight,   // <>   pitch x  ///  +setDeadZone(y)*4
            /*    */ +0             +this.keyMPoint,      // ()   yaw   y
            dSec);




        accelerationPosition = accelerationPosition.multiplyByFloats(20,20,20); // relative to ship  --  1,25,50


        switch("fake") {


            case "fake":
            controledObject.setSpeed(        accelerationPosition.scaleInPlace(1.0),
                                             accelerationRotation.scaleInPlace(1.0)  );
            break;


            case "mix":
            controledObject.setAcceleratoin( accelerationPosition.scaleInPlace(0.1), 0 );
            controledObject.setSpeed( 0,     accelerationRotation.scaleInPlace(1.0)    );
            break;


            case "real":
            controledObject.setAcceleratoin( accelerationPosition.scaleInPlace(0.01),
                                             accelerationRotation.scaleInPlace(0.01)  );
            var limit = 0.1;
            var min = new BABYLON.Vector3(-limit,-limit,-limit);
            var max = new BABYLON.Vector3(+limit,+limit,+limit);
            controledObject.speedRotation = BABYLON.Vector3.Clamp(controledObject.speedRotation,min,max);
            break;


        }

    }

}
