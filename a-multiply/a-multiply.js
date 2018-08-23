AFRAME.registerComponent('multiply', {
  schema: {
    mode:   {default:   "rotatory", oneOf: [ 'rotatory', 'rotatory' ] }, // Mode to place the clones
    axis:   {default:   "y",        oneOf: [ 'y', 'y' ] },               // axis for mode rotatiry
    radius: {default:   "x",        oneOf: [ 'x', 'x' ] },               // radius for cycle for mode rotatory
    start:  {default:    0}, // First angle of the rotation
    step:   {default:   30}, // Rotation step, added each time
    end:    {default:  359}, // Maximal angle of the loop 
  },

  // Full name meening: clone multible times and place in mode "rotatory in y-axis with x-radius"

  init: function () {
    console.log("... init")
    this.children = this.el.getChildEntities();
  },
 
 
  /**
   * Clone childs
   */
  update: function (oldData) {
    console.log("/// update")
    var data     = this.data
    var elParent = this.el
  
    this.children.forEach(function(elChild) 
    {
      console.log("Sub-entity: "+elChild.id)
      var pos    = elChild.object3D.position
      
      for (var angle = data.start ; angle <= data.end ; angle+=data.step) {
        var rad  = angle/180*Math.PI
        var posX = Math.cos(rad) * pos.x
        var posZ = Math.sin(rad) * pos.x
      
        // Copy the element and its child nodes
        var elCopy = elChild.cloneNode(true);
        elCopy.setAttribute("position", posX+" "+pos.y+" "+(pos.z-posZ) );
        elCopy.object3D.rotation.set(0,rad,0);
        elCopy.id = elChild.id+"_"+angle
        elParent.appendChild(elCopy);
      }//for angles
  
      elParent.removeChild(elChild); // remove original
    })//for children

  },//update

});



AFRAME.registerPrimitive('a-multiply', {
  defaultComponents: {
    multiply: {primitive: 'multiply'}
  },

  mappings: {
    start: 'damultiplyta.start',
    step:  'multiply.step',
	  end:   'multiply.end'
  }
});
