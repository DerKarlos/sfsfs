export class DefaultImmersiveExperience { //    (create)DefaultImmersiveExperienceAsync


    constructor(scene) {
        this._scene = scene;
        this.camera =
            this.deviceOrientationCamera = scene.cameras[0];
        this.cameraChangedCallback = undefined;
        return this;
    }


    onCameraChanged(callback) {
        this.cameraChangedCallback = callback;
    }


    async init() {

        this.webvrOk = (navigator.getVRDisplays !== undefined) ? 1 : 0;
        this.webxrOk = (navigator.xr !== undefined) ? 1 : 0;
        console.log("WebVR", this.webvrOk);
        console.log("WebXR", this.webxrOk);

        // alert("VX: "+this.webvrOk+","+this.webxrOk)

        if (!this.webvrOk && !this.webxrOk) {
            console.log("No WebVR/XR, iPhone")
            this.vrHelper = this._scene.createDefaultVRExperience({
                createDeviceOrientationCamera: false
            });
            await this.vrHelper
            this.imCamera = this._scene.cameras[1]; // WHAT??? Not a solution!!! This does not work:   this.vrHelper.deviceOrientationCamera; // const???   webVRCamera    currentVRCamera  deviceOrientationCamera=mono  vrDeviceOrientationCamera=falback?
        } else {
            if (this.webxrOk) {
                console.log("WebXR ok, Quest")
                this.xrHelper = await this._scene.createDefaultXRExperienceAsync({
                    floorMeshes: []
                });
                this.imCamera = this.xrHelper.baseExperience.camera // Not a solution!!! This does not work:
            } else {
                console.log("Only WebVR, mac")
                this.polyfill = new WebXRPolyfill(); // now, navigator.xr should exist. Returns object with .nativeWebXR
                this.webxrOk = (navigator.xr !== undefined) ? 2 : -0;
                console.log("WebXR=" + this.webxrOk)
                this.xrHelper = await this._scene.createDefaultXRExperienceAsync();
                await this.xrHelper;
                this.imCamera = this.xrHelper.baseExperience.camera

                this.immersiveOk = await BABYLON.WebXRSessionManager.IsSessionSupportedAsync('immersive-vr');
                console.log("immersive", this.immersiveOk)
            }
        }

        if (this.xrHelper !== undefined)
            this.xrHelper.baseExperience.onStateChangedObservable.add((state) => {
                switch (state) {
                    case BABYLON.WebXRState.NOT_IN_XR:
                        this.cameraChanged(this.deviceOrientationCamera, false);
                        break;
                    case BABYLON.WebXRState.IN_XR:
                        this.cameraChanged(this.imCamera, true);
                        break;
                }
            });

        if (this.vrHelper !== undefined)
            this.vrHelper.onEnteringVRObservable.add(() => {
                this.cameraChanged(this.imCamera, true);
            })

    }


    cameraChanged(camera, immersive) {
        this.camera = camera;
        if (this.cameraChangedCallback) {
            this.cameraChangedCallback(camera, immersive)
        }
    }



    addFloorMesh(groundMesh) {
        if (this.xrHelper)
            this.xrHelper.teleportation.addFloorMesh(groundMesh);
        if (this.vrHelper)
            this.vrHelper.enableTeleportation({
                floorMeshName: groundMesh.name
            });
    }


}
