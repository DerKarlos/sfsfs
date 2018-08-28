// To avoid recalculation at every mouse movement tick
var GRABBING_CLASS = 'a-grabbing';
var PI_2 = Math.PI / 2;

/**
 * aframe-l-controls. Update entity pose, factoring mouse, touch, and WebVR API data.
 */

 AFRAME.registerComponent('aframe-mcontrols-point', {
  dependencies: [ 'rotation'],

  schema: {
    enabled:      {default: true },
    reverseDrag:  {default: false},
    touchEnabled: {default: true }
  },

  init: function () {
  console.log("init point")

    // To keep track of the pressed keys.
    this.el.point = {}
    this.el.point.down   = 0
    this.el.point.startX = 0
    this.el.point.startY = 0
    this.el.point.movedX = 0 // 1 = screensize/2
    this.el.point.movedY = 0

    // To save / restore camera pose
    this.polyfillObject = new THREE.Object3D();

    this.position = {x: 0, y: 0, z:0};
    this.rotation = {x: 0, y: 0, z:0};
    this.setupMouseControls();
    this.bindMethods();

  },

  update: function (oldData) {
    var data = this.data;

    // Disable grab cursor classes if no longer enabled.
    if (data.enabled !== oldData.enabled) {
      this.updateGrabCursor(data.enabled);
    }


  },

  tick: function (t) {
    var data = this.data;
    if (!data.enabled) { return; }
    //if(this.el.point.down>0)
    //this.updateOrientation();//??
  },

  play: function () {
    this.addEventListeners();
  },

  pause: function () {
    this.removeEventListeners();
  },

  remove: function () {
    this.removeEventListeners();
  },

  bindMethods: function () {
    this.onContextMenu = bind(this.onContextMenu, this);
    this.onMouseDown = bind(this.onMouseDown, this);
    this.onMouseMove = bind(this.onMouseMove, this);
    this.onMouseUp = bind(this.onMouseUp, this);
    this.onTouchStart = bind(this.onTouchStart, this);
    this.onTouchMove = bind(this.onTouchMove, this);
    this.onTouchEnd = bind(this.onTouchEnd, this);
  },

 /**
  * Set up states and Object3Ds needed to store rotation data.
  */
  setupMouseControls: function () {
    this.el.point.down = 0
    //this.movedObject = new THREE.Object3D();//??
  },

  /**
   * Add mouse and touch event listeners to canvas.
   */
  addEventListeners: function () {
    var sceneEl = this.el.sceneEl;
    var canvas = sceneEl.canvas;

    // Wait for canvas to load.
    if (!canvas) {
      sceneEl.addEventListener('render-target-loaded', bind(this.addEventListeners, this));
      return;
    }

    // Mouse events.
    canvas.addEventListener('mousedown', this.onMouseDown, false);
    window.addEventListener('mousemove', this.onMouseMove, false);
    window.addEventListener('mouseup', this.onMouseUp, false);
		document.addEventListener('contextmenu',this.onContextMenu, false); // Contextmenu disable


    // Touch events.
    canvas.addEventListener('touchstart', this.onTouchStart);
    window.addEventListener('touchmove', this.onTouchMove);
    window.addEventListener('touchend', this.onTouchEnd);

  },

  /**
   * Remove mouse and touch event listeners from canvas.
   */
  removeEventListeners: function () {
    var sceneEl = this.el.sceneEl;
    var canvas = sceneEl && sceneEl.canvas;

    if (!canvas) { return; }

    // Mouse events.
    canvas.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
		document.addEventListener('contextmenu',this.onContextMenu); // Contextmenu enable

    // Touch events.
    canvas.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);

  },

  /**
   * Update orientation for mobile, mouse drag, and headset.
   * Mouse-drag only enabled if HMD is not active.
   */
  updateOrientationWEG: function () {//??
    var el      = this.el;
    var sceneEl = this.el.sceneEl;
    var movedObject = this.movedObject;

    // On mobile, do camera rotation with touch events and sensors.
    el.object3D.rotation.x = movedObject.rotation.x;
    el.object3D.rotation.y = movedObject.rotation.y;
    el.object3D.rotation.z = 0;

    el.object3D.position.x = movedObject.position.x;
    el.object3D.position.y = movedObject.position.y;
    el.object3D.position.z = movedObject.position.z;
  },



  /**
   * Register mouse down to detect mouse drag.
   */
  onMouseDown: function (evt) {		
    if (!this.data.enabled) return
  //if (evt.button > 2)     return // Handle 2 buttons.
	  
    var sceneEl = this.el.sceneEl;
    var canvas  = sceneEl && sceneEl.canvas;
		var point   = this.el.point

		point.startX = evt.screenX / canvas.clientWidth
		point.startY = evt.screenY / canvas.clientWidth
		point.movedX = 0
		point.movedY = 0
		point.down   = evt.button==0 ? 1 : 2 // first/second button 
    document.body.classList.add(GRABBING_CLASS);
  },


  onMouseMove: function (evt) {
    /*
    * Translate mouse drag into rotation.
    *
    * Dragging up and down rotates the camera around the X-axis (yaw).
    * Dragging left and right rotates the camera around the Y-axis (pitch).
    */

    // Not dragging or not enabled.
    if (!this.data.enabled) return
	  if (this.el.point.down == 0) return // Handle 2 buttons.

    var canvas  = this.el.sceneEl.canvas;
		var point   = this.el.point
    var direction = this.data.reverseDrag ? 1 : -1 // Calculate rotation.

    // Calculate delta.
    point.movedX = ( evt.screenX / canvas.clientWidth - point.startX ) * direction
    point.movedY = ( evt.screenY / canvas.clientWidth - point.startY ) * direction

		//console.log(evt.screenX, point.movedX)

  },


  onMouseUp: function () {
    // Register mouse up to detect release of mouse drag.
		var point   = this.el.point

		point.fst    = 0
		point.startX = 0
		point.startY = 0
		point.movedX = 0
		point.movedY = 0
		point.down   = 0
		
    document.body.classList.remove(GRABBING_CLASS);
  },


	onContextMenu: function(evt) {
		evt.preventDefault()
		},



  onTouchStart: function (evt) {
		/***/
		
    // Register touch down to detect touch drag.
		if (!this.data.touchEnabled) return		
		
		var sceneEl = this.el.sceneEl;
		var canvas  = sceneEl && sceneEl.canvas;
		var point   = this.el.point

		this.touchStart = { //TODO use "set" and delete this
      x: evt.touches[0].pageX,
      y: evt.touches[0].pageY    };

		point.startX = evt.touches[0].pageX / canvas.clientWidth
		point.startY = evt.touches[0].pageY / canvas.clientWidth
		point.movedX = 0
		point.movedY = 0
		point.down   = evt.touches.length // first/second/third touch 

	  document.body.classList.add(GRABBING_CLASS);
		/***/
  },


  onTouchMove: function (evt) {
		/***/
    // Translate touch move to Y-axis rotation.
    if (!this.el.point.down==0) return; // Not dragging

    var canvas    = this.el.sceneEl.canvas;
		var point     = this.el.point
    var direction = this.data.reverseDrag ? 1 : -1 // Calculate rotation.

    // Calculate delta.
    point.movedX = (evt.touches[0].pageX / canvas.clientWidth - point.startX ) * direction
    point.movedY = (evt.touches[0].pageY / canvas.clientWidth - point.startY ) * direction
		/***/
  },

  onTouchEnd: function () {
		/***/
    // Register touch end to detect release of touch drag.
    if (!this.el.point.down==0) return; // Not dragging

		var point   = this.el.point
		point.startX = 0
		point.startY = 0
		point.movedX = 0
		point.movedY = 0
		point.down   = 0
		
    document.body.classList.remove(GRABBING_CLASS);
		/***/
  },



 
  /**
   * Toggle the feature of showing/hiding the grab cursor.
   */
  updateGrabCursor: function (enabled) {
    var sceneEl = this.el.sceneEl;

    function enableGrabCursor  () { sceneEl.canvas.classList.add(   'a-grab-cursor'); }
    function disableGrabCursor () { sceneEl.canvas.classList.remove('a-grab-cursor'); }

    if (!sceneEl.canvas) {
      if (enabled) sceneEl.addEventListener('render-target-loaded',  enableGrabCursor);
      else         sceneEl.addEventListener('render-target-loaded', disableGrabCursor);
      return;
    }

    if (enabled) {
      enableGrabCursor();
      return;
    }
    disableGrabCursor();
  },

});
