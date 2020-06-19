'use strict';

function rad(degrees)    { return degrees * (Math.PI/180); }  // import { rad  } from './utils.js';

export class HeadUpDisplay {

constructor(parent,scene) {
    this.textColour = "rgba(255,255,255,1)"; // 0.5 is not good in Babylon???  // dunkelblau(0,0,172,0.75    gelb(255,255,0,65,0.5) habwegs druchsichtig?
    this.textPx     = 64//32;//26

    this.size = 1024
    this.hudTexture = new BABYLON.DynamicTexture('', {width:this.size, height:this.size}, scene);
    this.hudTexture.hasAlpha = true;
    var ctx =
    this.hudTexture.getContext();
    ctx.fillStyle = 'transparent';

    var
    material = new BABYLON.StandardMaterial('', scene);

    material.diffuseTexture = this.hudTexture;
    material.opacityTexture = this.hudTexture;

    var x = 0.5;
    this.hudMesh = BABYLON.MeshBuilder.CreateGround("hudGround", {width: x, height: x}, scene);
    this.hudMesh.material   = material;
    this.hudMesh.position.z =   +1.001;
    this.hudMesh.rotation.x = rad(-90);
    this.hudMesh.parent     = parent;
    this.hudMesh.isPickable = false;
}


out(texte,limit) { // "with" may not be used with 'use strict';  !

    if(this.timer) {
        clearTimeout(this.timer);
        this.timer = 0;
    }

	if(texte) {
        if(limit)
            setTimeout(function() {  this.clear();  }.bind(this), limit);

        var l = texte.length;
        var font = "Bold "+this.textPx+"px Arial"; //"bold 44px monospace";

        var
        context2d = this.hudTexture.getContext();
        context2d.clearRect(0, 0, this.size,this.size);

        for (var i=0 ; i<l ; i++) {
            this.hudTexture.drawText(texte[i], 0, (this.textPx*5/4)*(i+1), font, this.textColour, "rgba(0,0,0,0)", true, false);
        }
    }

    this.hudTexture.update();
}


clear() {
    this.out([]);
}


setParent(parent,offset) {
    this.hudMesh.parent = parent;
    this.hudMesh.position.y = (offset ? 1.6 : 0);
}


resize() {
    this.hudMesh.position.x     = -0.01 * camera.aspect /*wenn FPS da:*/ /1;
    this.hudMesh.position.y     = +0.062;
};


}//class
