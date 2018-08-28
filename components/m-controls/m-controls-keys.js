var CLAMP_VELOCITY = 0.00001;
var MAX_DELTA = 0.2;

AFRAME.registerComponent('aframe-mcontrols-keys', {
  schema: {
	  // nothing yet
  },

  init: function () {
	console.log("init keys")

    // To keep track of the pressed keys in all modules
    this.el.keys       = {}
		this.el.keys.Ctrl  = false
		this.el.keys.Alt   = false 
		this.el.keys.Shift = false

    // Bind methods and add event listeners.
    this.onBlur             = bind(this.onBlur,             this);
    this.onFocus            = bind(this.onFocus,            this);
    this.onKeyDown          = bind(this.onKeyDown,          this);
    this.onKeyUp            = bind(this.onKeyUp,            this);
    this.onVisibilityChange = bind(this.onVisibilityChange, this);
    this.attachVisibilityEventListeners();
  },//init

  
  
  remove: function () {
    this.removeKeyEventListeners();
    this.removeVisibilityEventListeners();
  },

  play: function () {
    this.attachKeyEventListeners();
  },

  pause: function () {
    this.el.keys = {};
		this.el.keys.Ctrl  = false
		this.el.keys.Alt   = false 
		this.el.keys.Shift = false
    this.removeKeyEventListeners();
  },

      
  
  attachVisibilityEventListeners: function () {
    window.addEventListener('blur',  this.onBlur);
    window.addEventListener('focus', this.onFocus);
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  },

  removeVisibilityEventListeners: function () {
    window.removeEventListener('blur',  this.onBlur);
    window.removeEventListener('focus', this.onFocus);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  },

  attachKeyEventListeners: function () {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup',   this.onKeyUp);
  },

  removeKeyEventListeners: function () {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup',   this.onKeyUp);
  },

  onBlur: function () {
    this.pause();
  },

  onFocus: function () {
    this.play();
  },

  onVisibilityChange: function () {
    if (document.hidden) this.onBlur()
    else                 this.onFocus()
  },

	onKeyDown: function(event) {
		this.onKey(event,true)
	},

	onKeyUp: function(event) {
		this.onKey(event,false)
	},


	onKey: function(event,down) {
		var keys = this.el.keys
		keys.Ctrl  = event.ctrlKey  // code 17
		keys.Alt   = event.altKey   // code 18
		keys.Shift = event.shiftKey // code right/left ?

		switch (event.keyCode) {

			// Next to the keys, also the "analog" value for the three axis are calculated
			case  65: /* A */ case 37: keys.Left  = down;  keys.keyX = Activity(keys.Left,keys.Right );  break
			case  68: /* D */ case 39: keys.Right = down;  keys.keyX = Activity(keys.Left,keys.Right );  break
			case  87: /* W */ case 38: keys.Up    = down;  keys.keyZ = Activity(keys.Up,  keys.Down  );  break
			case  83: /* S */ case 40: keys.Down  = down;  keys.keyZ = Activity(keys.Up,  keys.Down  );  break

			// Page-Up and alternative keys
			case 187: //  + (macOS)
			case 171: //  + (Windows)
			case 221: //  * (shilft+)
			case  36: //  Home
			case  81: /* Q */ case 33: keys.PgUp   = down; keys.keyY = Activity(keys.PgUp,keys.PgDown); break

			// Page-Down and alternative keys
			case 198: //  -
			case 220: //  # (macOS)
			case 163: //  # (Windows)
			case 222: //  ' (shilft#)
		  case  35: //  End
			case  69: /* E */ case 34: keys.PgDown = down; keys.keyY = Activity(keys.PgUp,keys.PgDown); break

			case  48: keys.Digit0 = down; break
  		case  79: keys.O      = down; break 

			/*** More keys if needed: ***!!/

			case  13: keys.Enter  = down; break
			case  32: keys.Space  = down; break
			case  27: keys.Esc    = down; break
				
			case  63: // ? questionmark or  german ß because shift key is irrelevant
			case 112: keys.Help   = down; break

			// Other keys, if needed
			case  16: Shift = down
			case  57: Num9 = down; break
			case  65: A = down; break (left of WASD)
			case  90: Z = down; break 
		
	
			default:  keys.AnyKey = true  // always set, i.E to trigger "Key help text"

			/******************************/
			
		}//switch		
	}  //onKeyX
  
});  //AFRAME




////////////////////////////////////////////


////  aframe/src/utils/bind.js ////
function bind (fn, ctx/* , arg1, arg2 */) {
  return (function (prependedArgs) {
    return function bound () {
      // Concat the bound function arguments with those passed to original bind
      var args = prependedArgs.concat(Array.prototype.slice.call(arguments, 0));
      return fn.apply(ctx, args);
    };
  })(Array.prototype.slice.call(arguments, 2));
};


////  aframe/src/utils/index.js ////
function shouldCaptureKeyEvent(event) {
  if (event.metaKey) { return false; }
  return document.activeElement === document.body;
};


////////////////////////////////////////////

function Activity(sub, add) {
	var     a  = 0
	if(sub) a -= 1
	if(add) a += 1 // If both: 0
  return  a
}

