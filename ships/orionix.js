// import { ModelLoader, updater }   from './utils.js';

import {
    loadGlb
} from './../src/functions.js';


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

    constructor(position, parent, camera, controls, scene, onLoadedCallback) { // TODO: camera, controls, weg?

        test++;

        this.model = new BABYLON.TransformNode('model_orion', scene); // Damit man schon vor dem Laden was damit tun kann. TODO: doppeltes Node in Loader weg?
        //this.model.castShadow = true;
        //this.model.receiveShadow = true;
        if (position) this.model.position = position;
        this.schachtposition = 0; // 1 = ganz ausgefahren
        this.schachtspeed = 0;
        this.vRadar = 1.0;


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

                this.SchachtMove(-1); // Lift einziehen
                glb.parent = this.model;
                if (parent) this.model.parent = parent;

                if (onLoadedCallback)
                    onLoadedCallback(this.model, this);

            }) //loadGlb

        } //loading

        //updater.push(this);

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

    SchachtSpeed(set) {
        if (!this.oben) return;
        this.schachtspeed = set;
    }

    SchachtMove(proEins) { // 1 = ganz ausgefahren
        if (!this.oben) return;

        this.schachtposition += proEins;
        if (this.schachtposition > 1) this.schachtposition = 1;
        if (this.schachtposition < 0) this.schachtposition = 0;

        var unten = 9.22 * (1 - this.schachtposition);
        var mi_ob = 8.83 * (1 - this.schachtposition);
        this.oben.position.y = mi_ob
        this.mitte.position.y = mi_ob + mi_ob
        this.unten.position.y = unten + mi_ob + mi_ob
    }


    Update(dt, mode) {
        if (!loaded) {
            return;
        }

        if (this.radar) {
            this.radar.rotation.y += this.vRadar * dt; //0.03
            // if (mode == "gelandet" || mode == "lanzets")
            this.SchachtMove(this.schachtspeed * dt);
        }

    }


} //class
