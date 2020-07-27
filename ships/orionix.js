
import {
    loadGlb
} from '../src/functions.js';

import {
    updater
} from '../src/utils.js';


/*

Model erst von http://chanur.bplaced.net/Download/DwnLd.htm
dann extra überarbeitet

FÜR GLB:

OBJ&MTL in Blender importiert und als GLB exportiert


FÜR OBJ & MTL:

Die .blend wurde editiert: Boden, Kamera und Licht weg (auch der "Cylinder"?)
Es wurde nach OBJ exportiert mit Option MTL-Export

In der MTL-Datei wurden die Namen der .jpg editiert: Zahlen und Pfade weg

Die Höhen-Maße des Schachts bekommt man durch Select (im Baum) und aufklappen von Transform als Dimention Y

Die OrionIX_Transparency.jpg mußte (im Gimp) invertiert werden!

*/



// Private Klassenvariablen:
var loaded = undefined;
var first = undefined; // TODO: weg?

var test = 0

export class OrionIX {

    constructor(position, schachtOut, parent, camera, controls, scene, onLoadedCallback) { // TODO: camera, controls, weg?

        test++;

        this.model = new BABYLON.TransformNode('model_orion', scene); // Damit man schon vor dem Laden was damit tun kann. TODO: doppeltes Node in Loader weg?
        //this.model.castShadow = true;
        //this.model.receiveShadow = true;
        if (position) this.model.position = position;
        this._schachtPosition = schachtOut ? 1 : 0; // 1 = ganz ausgefahren
        this._schachtOut = schachtOut;
        this._vRadar = 1.0;


        if (loaded) {
            var glb = loaded.clone('clone' + test);

            var children = glb.getChildren()[0].getChildren();
            children.forEach((child, i) => {
                this._checkEnds(child);
            });

            glb.parent = this.model;

            if (onLoadedCallback)
                onLoadedCallback(this.model, this);

        } else {
            loadGlb('OrionIX', scene, (glb) => {

                loaded = glb;
                first = this;

                glb.getChildren()[0].getChildren().forEach((child, i) => {
                    // mesh.geometry.computeVertexNormals(); // Farbübergänge weich (schöner!)  Hier aber nicht, hm?
                    // mesh.castShadow = true;
                    // mesh.receiveShadow = true;
                    this._checkEnds(child);
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


    _checkEnds(child) {
        if (child.name.endsWith("Schacht_oben_ORION_IX_DL.003")) {
            this.oben = child;
            child.position = child.position.clone(); // Teile einzeln bewegbar
        }
        if (child.name.endsWith("Schacht_mitte_ORION_IX_DL.000")) {
            this.mitte = child;
            child.position = child.position.clone();
        }
        if (child.name.endsWith("Schacht_unten_ORION_IX_DL.002")) {
            this.unten = child;
            child.position = child.position.clone();
        }
        if (child.name.endsWith("Radar_ORION_IX_DL.005")) {
            this.radar = child;
            //console.log(child.rotation,child.name)
            //child.rotation = child.rotation.clone(); // Teil einzeln rotierbar TODO: schräg !!!
            //console.log(child.rotation,child.name)
        }
        if (child.name.endsWith("Cylinder")) child.isVisible = false;
    }

    schachtOut(yes) {
        this._schachtOut = yes;
        console.log("schacht",yes)
    }


    update(dt) {
        if (!loaded) {
            return;
        }

        if (this.radar) {
            this.radar.rotation.y += this._vRadar * dt; //0.03
            // if (mode == "gelandet" || mode == "lanzets")
        }


        if (this.oben) {
            const _schachtSpeed = 0.1;
            if(this._schachtOut && this._schachtPosition<1) {
                this._schachtPosition += _schachtSpeed * dt;
                if(this._schachtPosition>1) this._schachtPosition = 1;
            }
            if(!this._schachtOut && this._schachtPosition>0) {
                this._schachtPosition -= _schachtSpeed * dt;
                if(this._schachtPosition<0) this._schachtPosition = 0;
            }

            var unten = 9.22 * (1 - this._schachtPosition);
            var mi_ob = 8.83 * (1 - this._schachtPosition);
            this.oben.position.y = mi_ob
            this.mitte.position.y = mi_ob + mi_ob
            this.unten.position.y = unten + mi_ob + mi_ob
        }


    }// Update


} //class
