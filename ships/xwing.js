import {
    loadGlb
} from '../src/functions.js';

import {
    updater
} from '../src/utils.js';
import {
    rad,
    grad
} from '../src/functions.js';



// Private Klassenvariablen:
var loaded = undefined;

export class Xwing {

    constructor(position, spread, parent, camera, controls, scene, onLoadedCallback) { // TODO: camera, controls, weg?

        this.model = new BABYLON.TransformNode('model_xwing', scene); // Damit man schon vor dem Laden was damit tun kann. TODO: doppeltes Node in Loader weg?
        //this.model.castShadow = true;
        //this.model.receiveShadow = true;
        if (position) this.model.position = position;
        this._spreadAngle = spread ? 1 : 0; // 1 = ganz ausgefahren
        this._spread = spread;


        if (loaded) {
            var glb = loaded.clone('clone');

            var children = glb.getChildren()[0].getChildren();
            children.forEach((child, i) => {
            });

            glb.parent = this.model;

            if (onLoadedCallback)
                onLoadedCallback(this.model, this);

        } else {
            loadGlb('xwing_t65', scene, (glb) => {

                loaded = glb;


                this.wing1 = new BABYLON.TransformNode('test1', scene);
                this.wing2 = new BABYLON.TransformNode('test2', scene);
                this.wing1.parent = glb.getChildren()[0];
                this.wing2.parent = glb.getChildren()[0];
                var xwing = glb.getChildren()[0].getChildren();
                xwing.forEach((child, i) => {
                    // mesh.geometry.computeVertexNormals(); // Farbübergänge weich (schöner!)  Hier aber nicht, hm?
                    // mesh.castShadow = true;
                    // mesh.receiveShadow = true;
                    if (i >= 113 && i <= 166) {
                        child.parent = this.wing1;
                    }
                    if (i >=  58 && i <= 112) {
                        child.parent = this.wing2;
                    }
                    // this.wing1.rotation.x = rad(-15);
                });

                glb.parent = this.model;
                if (parent) this.model.parent = parent;

                if (onLoadedCallback)
                    onLoadedCallback(this.model, this);

            }) //loadGlb

        } //loading

        updater.add(this);
        this.update(0);


    } //constructor


    _checkWings(child) {
    }

    spread(yes) {
        this._spread = yes;
        console.log("sperad", yes)
    }


    update(dt) {
        if (!loaded) {
            return;
        }

        if (this.wing1) {
            const _spreadSpeed = 0.2;
            if (this._spread && this._spreadAngle < 1) {
                this._spreadAngle += _spreadSpeed * dt;
                if (this._spreadAngle > 1) this._spreadAngle = 1;
            }
            if (!this._spread && this._spreadAngle > 0) {
                this._spreadAngle -= _spreadSpeed * dt;
                if (this._spreadAngle < 0) this._spreadAngle = 0;
            }

            var a = -15 * (this._spreadAngle);
            this.wing1.rotation.x = rad(+a);
            this.wing2.rotation.x = rad(-a);
            this.wing1.position.y = +a/150;
            this.wing2.position.y = -a/150;
        }


    } // Update


} //class
