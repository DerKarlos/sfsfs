'use strict';

BABYLON.Scene.prototype.createDefaultImmersiveExperienceAsync = async function() {
    var ix = new DefaultImmersiveExperience(this);
    await ix._init();

    if (ix._webxrOk)
        return ix._xrHelper; // return real xrHelper
    else
        return ix; // return this simulated xrHelper
};


class DefaultImmersiveExperience {


    // TODO: How to make constructor Async?
    constructor(scene) {
        this._scene = scene;
        this._webvrOk = (navigator.getVRDisplays === undefined) ? 0 : 1;
        this._webxrOk = (navigator.xr === undefined) ? 0 : 1; // 2 = polyfill
        console.log("WebVR:", this._webvrOk, " / WebXR:", this._webxrOk);
        // alert("VX: "+this._webvrOk+","+this._webxrOk) // Test on iPhone
        // this._webvrOk = this._webxrOk = 0;   console.log("TTTTTTTTTT E S TTTTTTTTT")
        return this;
    }


    async _init() { // "private" not on iPhone!

        if (this._webxrOk) {
            console.log("+++ WebXR ok, Oculus Quest etc. +++")
            this._xrHelper = await this._scene.createDefaultXRExperienceAsync({
                floorMeshes: []
            });


        } else if (this._webvrOk) {
            console.log("+++ Only WebVR, Apple Mac etc. +++")
            this._polyfill = new WebXRPolyfill(); // now, navigator.xr should exist. Returns object with .nativeWebXR
            this._webxrOk = (navigator.xr !== undefined) ? 2 : -0;
            console.log("WebXR:", this._webxrOk)
            this._xrHelper = await this._scene.createDefaultXRExperienceAsync();

            this.immersiveOk = await BABYLON.WebXRSessionManager.IsSessionSupportedAsync('immersive-vr');
            console.log("immersive", this.immersiveOk);


        } else {
            console.log("+++ No WebVR or XR: Cardboard, iPhone etc. +++")
            this._vrHelper = await this._scene.createDefaultVRExperience({
                createDeviceOrientationCamera: false
            });

            //// simulate WebXR interface. Only used if it is NOT (polyfilled) WebXR
            this.teleportation = {};
            this.baseExperience = {};
            this.baseExperience.onStateChangedObservable = {};
            this._stateChangedCallbacks = [];

            this.teleportation.addFloorMesh = function(groundMesh) {
                console.log(this)
                this._vrHelper.enableTeleportation({
                        floorMeshName: groundMesh.name
                    } // only one?! Will it work on Cardboard? Hardly
                );
            }.bind(this); // TODO: find something better then bind

            // set state change callback
            this.baseExperience.onStateChangedObservable.add = function(stateChangedCallback) {
                this._stateChangedCallbacks.push(stateChangedCallback);
            }.bind(this);

            // if entering VR: call back IN
            this._vrHelper.onEnteringVRObservable.add(() => {
                // Camear has not changed yet at this point. A infinite delay helps. TODO: Ask if this is the best/only way
                setTimeout(() => {
                    this._stateChangedCallbacks.forEach((item, i) => {
                        item(BABYLON.IN_XR); // 0..3 ENTERING_XR EXITING_XR IN_XR NOT_IN_XR
                    });
                }, 0);
            });

            // if entering VR: call back OUT
            this._vrHelper.onExitingVRObservable.add(() => {
                setTimeout(() => {
                    this._stateChangedCallbacks.forEach((item, i) => {
                        item(BABYLON.NOT_IN_XR);
                    });
                }, 0);
            });

            //// END: simulate WebXR interface ////
        }


    } // init


} // class
