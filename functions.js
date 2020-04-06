

export function rad(degrees)    { return degrees * (Math.PI/180); }
export function grad(rad)       { return rad     / (Math.PI/180); }

export function setCamera(absolutePosition, rotationQuaternion, vrHelper) {
    var camera = vrHelper.currentVRCamera;        // if(vrHelper.isInVRMode)
    camera.position           = absolutePosition;
    if(rotationQuaternion)
        camera.rotationQuaternion = rotationQuaternion;
}





export function setDeadZone(value) {
    const DEADZONE = 0.2;

    // If stick value is smaller than dead zone, give it a value of 0
    // Math.abs() makes it work regardless of positive or negative value
    if (Math.abs(value) < DEADZONE) {

        return value = 0;

    } else {
        // We are outside the dead zone: substract deadzoone
        value = value - Math.sign(value) * DEADZONE;

        // Normalize the values between 0 and 1
        value /= (1.0 - DEADZONE);

        return value;

    }
}


export function loadGlb(name,scene,success) {

    BABYLON.Tools.corsbehavior = "anonymous";   // FileTools.CorsBehavior = “credentials”  /  "anonymous"   ??? videoTexture.video.crossOrigin = "anonymous";
    BABYLON.SceneLoader.ImportMesh('', 'ships/', name+'.glb', scene, // wheelchair aufgabe_orion radiatoren
        /* onSuccess: */ function (newMeshes) {
            // how do avoid to see the array for a moment???  It should also be noted that a mesh with a layerMask of 0, can never be seen by anyone. This might be good for hiding things.
            console.log("loaded: "+name);
            var glb = new BABYLON.Mesh(name, scene);
            for(var index in newMeshes) {
                var mesh = newMeshes[index]; //console.log("o." + index + " = " + mesh);
                glb.addChild(mesh);
            }
            if(success)
                success(glb);
        }.bind(this),
        /* onProgress: */ function (event) {   console.log("model loaded: ", Math.floor(event.loaded/event.total*100)+"%") },
        /* onError:    */ function (event) {   console.log("onError:"+name,event) }
    );//ImportMesh

}

export class Ramp { ////////////////////////////////////////////////// Ramp (helper CLASS) ////////////////////////////////////////////

    constructor(up,down,initValue) {
        if(!up)   up   = 1;
        if(!down) down = up;
        if(!initValue) initValue = 0;
        this.up     = up;
        this.down   = down;
        this.actual = initValue;
    }


    reset() {
        this.actual = 0
    }


    ramping(set,dt) {

        var delta = set-this.actual;
        var abs   = Math.abs( delta);
        var sign  = Math.sign(delta);
        var ramp  = (sign==Math.sign(this.actual)) ? this.up : this.down;
        if( abs   > ramp*dt)
            abs   = ramp*dt;
        delta     = abs * sign;

        this.actual += delta;
        return this.actual;
    }


}//class ramp


export class Ramp3 {
    constructor() {
        this.x = new Ramp();
        this.y = new Ramp();
        this.z = new Ramp();
        this.actual = new BABYLON.Vector3();
    }

    ramping(x,y,z,dt) {
        this.actual.x = this.x.ramping(x, dt);
        this.actual.y = this.y.ramping(y, dt);
        this.actual.z = this.z.ramping(z, dt);
        return this.actual;
    }

    reset() {
        this.x.reset();
        this.y.reset();
        this.z.reset();
    }

}
