'use strict';

function rad(degrees)    { return degrees * (Math.PI/180); }  // import { rad  } from './utils.js';

export class HeadMountedDisplay {  // Used to be HeadUpDisplay. But it is not mounted to a veicle but to the head of the driver

constructor(parent,scene) {
    this.textColour = "rgba(5,5,5,1)"; // 0.5 is not good in Babylon???  // dunkelblau(0,0,172,0.75    gelb(255,255,0,65,0.5) habwegs druchsichtig?
    this.textPx     = 64//32;//26

    this.size = 1024
    this.texture = new BABYLON.DynamicTexture('', {width:this.size, height:this.size}, scene);
    this.texture.hasAlpha = true;
    var ctx =
    this.texture.getContext();
    ctx.fillStyle = 'transparent';

    var
    material = new BABYLON.StandardMaterial('', scene);

    material.diffuseTexture = this.texture;
    material.opacityTexture = this.texture;

    var x = 0.5;
    this.mesh = BABYLON.MeshBuilder.CreateGround("ground", {width: x, height: x}, scene);
    this.mesh.material   = material;
    this.mesh.position.z =   +1.001;
    this.mesh.rotation.x = rad(-90);
    this.mesh.parent     = parent; // NO clone, HMD is in front of the parent
    this.mesh.isPickable = false;
}


out(texte,limit) { // "with" may not be used with 'use strict';  !

    if(this.timer) {
        clearTimeout(this.timer);
        this.timer = undefined;
    }

	if(texte) {
        if(limit)
            setTimeout(function() {  this.clear();  }.bind(this), limit);

        var l = texte.length;
        var font = "Bold "+this.textPx+"px Arial"; //"bold 44px monospace";

        var
        context2d = this.texture.getContext();
        context2d.clearRect(0, 0, this.size,this.size);

        for (var i=0 ; i<l ; i++) {
            this.texture.drawText(texte[i], 0, (this.textPx*5/4)*(i+1), font, this.textColour, "rgba(0,0,0,0)", true, false);
        }
    }

    this.texture.update();
}


clear() {
    this.out([]);
}


setParent(parent,offset) {
    this.mesh.parent     = parent; // HMD is in front of the parent
    this.mesh.position.y = (offset ? 1.6 : 0);
}


resize() {
    this.mesh.position.x     = -0.01 * camera.aspect /*wenn FPS da:*/ /1;
    this.mesh.position.y     = +0.062;
};


}//class
