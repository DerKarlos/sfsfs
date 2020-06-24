'use strict';

// TODO: how to detect immersive by the activeCamera? Both have the same .fov! Strange   .zoomOnFactor===0   ._xrSessionManager===0


BABYLON.Scene.prototype.createDefaultImmersiveExperienceAsync = async function() {
    var ix = new DefaultImmersiveExperience(this);
    ix.init();
	return ix;
};



class DefaultImmersiveExperience {


    // TODO: How to make constructor Async?
    constructor(scene) {
        this._scene = scene;
        this._cameraChangedCallback = undefined; // Could be an array too
        this.deviceOrientationCamera = scene.activeCamera;
        return this;
    }


    async init() {

        this._webvrOk = (navigator.getVRDisplays === undefined) ? 0 : 1;
        this._webxrOk = (navigator.xr /*      */ === undefined) ? 0 : 1; // 2 = polyfill
        console.log("WebVR:", this._webvrOk, " / WebXR:", this._webxrOk);
        // alert("VX: "+this._webvrOk+","+this._webxrOk) // Test on iPhone

        if (!this._webvrOk && !this._webxrOk) {
            console.log("No WebVR/XR, iPhone")
            this._vrHelper = this._scene.createDefaultVRExperience({
                createDeviceOrientationCamera: false
            });
            await this._vrHelper
            this._immmersiveCamera = scene.activeCamera;
        } else {
            if (this._webxrOk) {
                console.log("WebXR ok, Quest")
                this._xrHelper = await this._scene.createDefaultXRExperienceAsync({
                    floorMeshes: []
                });
                this._immmersiveCamera = this._xrHelper.baseExperience.camera // Not a solution!!! This does not work:
            } else {
                console.log("Only WebVR, mac")
                this._polyfill = new WebXRPolyfill(); // now, navigator.xr should exist. Returns object with .nativeWebXR
                this._webxrOk = (navigator.xr !== undefined) ? 2 : -0;
                console.log("WebXR:", this._webxrOk)
                this._xrHelper = await this._scene.createDefaultXRExperienceAsync();
                await this._xrHelper;
                this._immmersiveCamera = this._xrHelper.baseExperience.camera

                this.immersiveOk = await BABYLON.WebXRSessionManager.IsSessionSupportedAsync('immersive-vr');
                console.log("immersive", this.immersiveOk)
            }
        }

        if (this._xrHelper !== undefined)
            this._xrHelper.baseExperience.onStateChangedObservable.add((state) => {
                switch (state) {
                    case BABYLON.WebXRState.NOT_IN_XR:
                        this._cameraChanged(this.deviceOrientationCamera, false);
                        break;
                    case BABYLON.WebXRState.IN_XR:
                        this._cameraChanged(this._immmersiveCamera, true);
                        break;
                }
            });

        if (this._vrHelper !== undefined)
            this._vrHelper.onEnteringVRObservable.add(() => {
                this._cameraChanged(this._immmersiveCamera, true);
            })

    }


    onCameraChanged(callback) {
        this._cameraChangedCallback = callback;
    }


    _cameraChanged(camera, immersive) { // internal methode
        if (this._cameraChangedCallback) {
            this._cameraChangedCallback(camera, immersive)
        }
    }



    addFloorMesh(groundMesh) {
        if (this._xrHelper)
            this._xrHelper.teleportation.addFloorMesh(groundMesh);
        if (this._vrHelper)
            this._vrHelper.enableTeleportation({
                floorMeshName: groundMesh.name // only one?!
            });
    }


}
