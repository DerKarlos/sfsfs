//// Konsants and functions
var CLAMP_VELOCITY = 0.00001;
var MAX_DELTA      = 0.2;


AFRAME.registerComponent('aframe-mcontrols-rig', {
  schema: {
    enabled:      {default:  true},

    acceRotation: {default:   200},
    maxRotation:  {default:     1},
    accePosition: {default:   100},
    easing:       {default:    20},

    modeDrag:     {default: 'position', oneOf: [ 'acceleration', 'position','switch','mix'] },
    segway:       {default: false},
    fly:          {default: true},
  },

	/// !!!  camera="active:true" bedeutet, das sie von den controls aktiv mit dem Avatar mit gewegt wird,
	///             passive:false bedeutet, sie steht ruhig da und nur der Avatar bewegt sich.
	///                                     Dabei allerdings gehen die Pointer-Eingaben auch auf die Kamera-Rotation



  init: function () {
    console.log("init rig")

		// pysical conditons of the object
    this.velocity = new THREE.Vector3(); // actual mass inertia
    this.spinning = new THREE.Vector3(); // also yerk (ruck) ?

		this.lastDown       = false
		this.startPosition  = new THREE.Vector3()
		this.startRotation  = new THREE.Vector3()
  },//init


  ///////////////////////////////////////////////////////////////////////////////////
  tick: function (time, delta) {

    var data = this.data;
    var el   = this.el;

    if (!data.enabled) return;

    var rotatAtt  = el.getAttribute('rotation');
    var rotation  = new THREE.Vector3(rotatAtt.x, rotatAtt.y, rotatAtt.z);
		var spinning  = this.spinning;
                  
    var position  = el.getAttribute('position');
		var velocity  = this.velocity;

    var aPosition = new THREE.Vector3() // acceleration of porition and rotation, caused by user action
    var aRotation = new THREE.Vector3()		

    delta = delta / 1000;  // ms => s

		// If FPS too low, reset velocity and spin
		// stop moving may be odd for space ships
    if( delta > MAX_DELTA ) {   
			velocity.set(  0, 0, 0 )
			spinning.set(  0, 0, 0 )
			console.log("delta > MAX_DELTA: " + delta)
    }
		
		
		else { // do normal activities

	    this.keys_acceleration(aPosition,aRotation);  

			switch(data.modeDrag) {
				case "position":     this.point_position(position,rotation);       break // direct setting of both (not setting speed or acceleration yet)
				case "acceleration": this.point_acceleration(aPosition,aRotation); break
				case "position":     this.point_position(aPosition,aRotation);     break
				case "switch":       this.point_switch(aPosition,aRotation);       break

				case "mix":          this.point_position(aPosition,aRotation);
				                     this.point_switch(aPosition,aRotation);       break
			}
		}

		//aPosition.set(0,0,0.1)

    //???TODO? place as a "connection"?
		if(data.easing<0) { // Ease by frigtion
    // Decay velocity:   velocity  -=  velocity * ( data.easing * delta)
		var move     = velocity.clone().multiplyScalar(-data.easing * delta)
		var spin     = spinning.clone().multiplyScalar(-data.easing * delta)
		    velocity = velocity.sub(move)  // slow down
		    spinning = spinning.sub(spin)
	      // Clamp velocity easing. TODO?  if < CLAMP_VELOCITY = 0
		}
		if(data.easing>0) { // Ease by ramp
			rampdown3(velocity,aPosition,data.easing)
			rampdown3(spinning,aRotation,data.easing)
		}



    // Accelerate velocity: velocity += acceleration * (acceleratoin * delta time)
		velocity.add(aPosition.multiplyScalar(data.accePosition * delta))
		spinning.add(aRotation.multiplyScalar(data.acceRotation * delta))
		
	  spinning.clampScalar(-data.maxRotation,+data.maxRotation) //if(spinning> data.maxRotation) spinning = max

    var rotationEuler = new THREE.Euler(0, 0, 0, 'YXZ');
    var moving        = velocity.clone() // directionVector
    moving.multiplyScalar(delta);
    // Transform moving direction relative to heading.
    rotationEuler.set( THREE.Math.degToRad(data.fly ? rotation.x : 0)
		                 , THREE.Math.degToRad(           rotation.y    )
		                 ,                                             0);

    moving.applyEuler(rotationEuler);

		// Increment position and rotation
		position.add(moving)
    rotation.add(spinning)

    if(  el.keys.Digit0 
			|| el.keys.O)  {	// return to start/default position  TODO: "Connection" ?
			position.set( 0, 8, 0 )
		  rotation.set( 0, 0, 0 )
			spinning.set( 0, 0, 0 )
			velocity.set( 0, 0, 0 )
    }

	  // New values limited and set to avatar
		rotation.z = range( -90, rotation.z,  +90)
		rotation.x = range( -90, rotation.x,  +90)
		rotation.y = rotation.y % 360
    el.setAttribute('position', position);
    el.setAttribute('rotation', rotation);
		
  },//tick






  ///////////////////////////////////////////////////////////////////////////////////
  point_acceleration: function(aPosition,aRotation) {


		var mode2 = this.el.keys.Shift || (this.el.point.down==2)
		var point = this.el.point
		var data  = this.data
    
    if (!point.down==0) return;
		
    var sX = !mode2 ^ data.segway ? point.movedY * data.acceRotation : 0// Sreen Y => rotation x
    var aZ =  mode2 ^ data.segway ? point.movedY * data.accePosition : 0
    var sY = !mode2               ? point.movedX * data.acceRotation : 0
    var aX =  mode2               ? point.movedX * data.accePosition : 0

		aPosition.add(new THREE.Vector3( +aX,   0,  aZ))
		aRotation.add(new THREE.Vector3( -sX, -sY,   0))
  },//point_acceleration





  
  ///////////////////////////////////////////////////////////////////////////////////
  point_switch: function (aPosition,aRotation) {
		var point = this.el.point
		var data  = this.data
		var mode2 = this.el.keys.Shift || point.down
    
		if (!point.down==0) return;

		var X = Math.abs(point.movedX) > 0.2
		var Y = Math.abs(point.movedY) > 0.2

		var sY = X & !mode2 ? data.acceRotation * Math.sign(point.movedX) : 0 // Sreen Y => rotation x
    var aX = X &  mode2 ? data.accePosition * Math.sign(point.movedX) : 0
		var sX = Y & !mode2 ? data.acceRotation * Math.sign(point.movedY) : 0
    var aZ = Y &  mode2 ? data.accePosition * Math.sign(point.movedY) : 0
								
  	aPosition.add(new THREE.Vector3( -aX/1000,   0, -aZ/1000)) // Z-asis is netativ into backround
	  aRotation.add(new THREE.Vector3( +sX, +sY,   0))

  },//point_switch




  
  ///////////////////////////////////////////////////////////////////////////////////
  point_position: function (aPosition,aRotation) {
		var mode2 = this.el.keys.Shift || (this.el.point.down==2)
		var point = this.el.point
		var data  = this.data

    if (point.down>0) {
			if(point.down != this.lastDown) {
				point.lastX = point.movedX
				point.lastY = point.movedY
			}
						
  		var deltaX = (point.movedX - point.lastX)
	  	var deltaY = (point.movedY - point.lastY)
			
      var sX = !mode2 ? deltaY * data.acceRotation : 0 // Sreen Y => rotation x
      var aZ =  mode2 ? deltaY * data.accePosition : 0
      var sY = !mode2 ? deltaX * data.acceRotation : 0
      var aX =  mode2 ? deltaX * data.accePosition : 0

			point.lastX = point.movedX
		  point.lastY = point.movedY

  		aPosition.add(new THREE.Vector3( -aX,   0, -aZ)) // Z-asis is netativ into backround
	  	aRotation.add(new THREE.Vector3( +sX, +sY,   0))
    }
		this.lastDown = point.down
  },//point_delta

  
  
  ///////////////////////////////////////////////////////////////////////////////////
  keys_acceleration: function (aPosition,aRotation) {
		var segway = this.data.segway
    var keys   = this.el.keys;
		var mode2  = keys.Shift || (this.el.point.down==2)

    // Calculate acceleration using keys pressed.
    var aX = !mode2 ^ segway ? keys.keyX : 0
    var aY = !mode2          ? keys.keyY : 0
    var aZ = !mode2          ? keys.keyZ : 0

    var sY =  mode2 ^ segway ? keys.keyX : 0
    var sX =  mode2          ? keys.keyZ : 0
    var sZ =  mode2          ? keys.keyY : 0

  	aPosition.add(new THREE.Vector3( +aX, -aY, +aZ)) // Z-asis is netativ into backround
	  aRotation.add(new THREE.Vector3( -sX, -sY, +sZ)) // Y asis is inverted. TODO: why?
  },//keys_acceleration
	
	
	
})//AFRAME///////////////////////////////////////////////////////////////////////////





//////////////////////
// helper functions //
//////////////////////

function KeyToAcceleration(enable, sub, add) {
  if(!enable) return 0
	var     a  = 0
	if(sub) a -= 1
	if(add) a += 1 // If both: 0
  return  a
}

function range(min, val, max) {
  return val < min ? min : (val > max ? max : val);
}

function rampdown3(v3,a3,easing) {
	v3.x = rampdown(v3.x,a3.x,easing)
	v3.y = rampdown(v3.y,a3.y,easing)
	v3.z = rampdown(v3.z,a3.z,easing)
}

function rampdown(v,a,easing) {
	if(a!=0) return v // If accelerating: no easing

	var sign = Math.sign(v)
	v = Math.abs(v)
	if(v>easing) v -= easing  // not near 0: substract
	else         v  =      0  // else: set to 0
	return v*sign
}

