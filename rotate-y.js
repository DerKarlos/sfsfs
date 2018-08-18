/**
 * 'rotate-y':  Entity Generator component for A-Frame.
 * Creates an given entities multible times for each Y-angle between start and end angle
 * If the entity position y is not 0, the instances will be set in a cycle.
 * If you need a different rotation axis but Y, place it inside an rotasted parent-entity
 * if you need a translaton instead of the rotation, tell me: karlos@ac1000.de
 * Created after:  https://www.npmjs.com/package/aframe-entity-generator-component
 * and the aframe-entity-generator-component
 */

AFRAME.registerComponent('rotate-y', {
  schema: {
    start:  {default:  0}, // First angle of the rotation
    step:   {default: 30}, // Rotation step, added each time
    end:    {default:360}, // Maximal angle of the loop 

    mixin0: {default: ''}, // Optional entities at the rotation point
    mixin:  {default: ''}, // Entity appended for each angle
    mixin2: {default: ''}, // Optinal entities
    mixin3: {default: ''},
    mixin4: {default: ''},
  },

  init: function () {
    var data = this.data;

    // Create entities with supplied mixin.
    for (var i = data.start; i < data.end; i+=data.step) {

			// Each entity, in the center oriented to the actual rotations
      var entity = document.createElement('a-entity');
	    entity.setAttribute('rotation', { x: 0, y: i, z: 0 });
			if(data.mixin!='') // If given, it will get a geometry
				entity.setAttribute('mixin', data.mixin0);
      this.el.appendChild(entity);

			// The usual sub-entity, most times shiftet to build a cycle
			if(data.mixin!='') {
	      var entity1 = document.createElement('a-entity');
	      entity1.setAttribute('mixin', data.mixin);
	      entity.appendChild(entity1);
			}
			
			// Optional 2nd sub-entity etc.
			if(data.mixin2!='') {
	      var entity2 = document.createElement('a-entity');
	      entity2.setAttribute('mixin', data.mixin2);
	      entity.appendChild(entity2);
			}

			if(data.mixin3!='') {
	      var entity3 = document.createElement('a-entity');
	      entity3.setAttribute('mixin', data.mixin3);
	      entity.appendChild(entity3);
			}

			if(data.mixin4!='') {
	      var entity4 = document.createElement('a-entity');
	      entity4.setAttribute('mixin', data.mixin4);
	      entity.appendChild(entity4);
			}

    }
  }
});
