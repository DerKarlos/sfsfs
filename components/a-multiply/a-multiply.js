AFRAME.registerComponent('multiply', {
  schema: {
    mode:   {default:   "rotatory", oneOf: [ 'rotatory', 'rotatory' ] }, // Mode to place the clones
    axis:   {default:   "y",        oneOf: [ 'y', 'y' ] },               // axis for mode rotatiry
    radius: {default:   "x",        oneOf: [ 'x', 'x' ] },               // radius for cycle for mode rotatory
    start:  {default:    0}, // First angle of the rotation
    step:   {default:   30}, // Rotation step, added each time
    end:    {default:  359}, // Maximal angle of the loop 

    done:   {default:false}, // avoid copies to get done again
  },

  // Full name meening: clone multible times and place in mode "rotatory in y-axis with x-radius"

  init: function () {

		var data      = this.data
    var elParent  = this.el
		this.children = this.el.getChildEntities();

    console.log("a-multiply init: "+this.el.id+" done:"+data.done)

		// When a multiply is done, it remembers this as "done" to avoid a repitition
		// a-frame executes from down to top of the HTML, so a sub-multiply gets "done" first
		// When amultiply as a child itselve gets multiplied, the "done" also gets copied
    if(this.el.getAttribute("done")) return
	  this.el.setAttribute("done",true);
  
    this.children.forEach(function(elChild) 
    {
      console.log("a-multiply sub-entity: "+elChild.id)
      var pos    = elChild.object3D.position
      var rot    = elChild.object3D.rotation
      
      for (var angle = data.start ; angle <= data.end ; angle+=data.step) {
        console.log("   a-multiply angle: "+angle)
        var rad  = angle/180*Math.PI
        var posX = Math.cos(rad) * pos.x
        var posZ = Math.sin(rad) * pos.x

        // Copy the element and its child nodes
        var elCopy = elChild.cloneNode(true);
        elCopy.setAttribute("position", posX+" "+ pos.y+       " "+(pos.z-posZ) );
        elCopy.setAttribute("rotation",rot.x+" "+(rot.y+angle)+" "+ rot.z       );
				//Copy.object3D.rotation.set(  rot.x,    (rot.y+rad  ),     rot.z       )
        elCopy.id = elChild.id+"_"+angle
        elParent.appendChild(elCopy);
      }//for angles
  
      elParent.removeChild(elChild); // remove original
    })//for children

  },
 
});



AFRAME.registerPrimitive('a-multiply', {
  mappings: {
    start: 'damultiplyta.start',
    step:  'multiply.step',
	  end:   'multiply.end'
  }
});
