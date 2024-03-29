//--------------------------------------------------------
function animationManager()
{
	this.animation 	= null;
	this.animations = {};

	this.animationGround 	= null;
	this.animationsGround = {};
}

//--------------------------------------------------------
animationManager.prototype.setup = function()
{
   this.animations["blank"] 		= new animationBlank();
   this.animations["sine"] 			= new animationSine();
   this.animations["sine2"] 		= new animationSine();
   this.animations["plasma"] 		= new animationPlasma();
   this.animations["plasma2"] 		= new animationPlasma();
   this.animations["rectRotate"] 	= new animationRectRotate();
   this.animations["manual"] 		= new animationManual();
   this.animations["manualWaves"] 	= new animationManualWaves();
   this.animations["rechercherOK"] 	= new animationRechercherOK();
   this.animations["rechercherFail"]= new animationRechercherFail();
   this.animations["movingLines"]	= new animationMovingLines();
   this.animations["panelDebug"]	= new animationPanelDebug();
 
   this.animations["timeline"] 		= new animationMix();
   this.animations["timeline"].setAnimationManager(this);
   this.animations["timeline"].createTimeline();

   this.animations["transition"] 	= new animationTransition();
   this.animations["transition"].setAnimationManager(this);

   this.animationsGround["transition_ground"] 	= new animationTransition();
   this.animationsGround["transition_ground"].type = "floor";
   this.animationsGround["transition_ground"].setAnimationManager(this);

   this.animationsGround["blank_ground"] 		= new animationBlank();
   this.animationsGround["blank_ground"].type = "floor";

   this.animationsGround["manual_ground"] 			= new animationManual();
   this.animationsGround["manual_ground"].type 		= "floor";
   this.animationsGround["manualWaves_ground"] 		= new animationManualWaves();
   this.animationsGround["manualWaves_ground"].type = "floor";

   this.animationsGround["sine_ground"] 	= new animationSine();
   this.animationsGround["sine_ground"].type = "floor";

   this.animationsGround["plasma_ground"] 	= new animationPlasma();
   this.animationsGround["plasma_ground"].type = "floor";

   this.animationsGround["rechercherOK_ground"] 	= new animationRechercherOK();
   this.animationsGround["rechercherOK_ground"].type = "floor";
 
   this.animationsGround["rechercherFail_ground"] 	= new animationRechercherFail();
   this.animationsGround["rechercherFail_ground"].type = "floor";

   this.setupAnimations(this.animations);
   this.setupAnimations(this.animationsGround);
}

//--------------------------------------------------------
animationManager.prototype.setupAnimations = function(anims)
{
   for (var id_ in anims)
   {
   		with(anims[id_])
		{
			id = id_;
			setup( rqcv.configuration.animations ); // rqcv is defined in main.js and then retrieved from index[*].js
		}
   }
}

//--------------------------------------------------------
animationManager.prototype.loadProperties = function()
{
   for (var id in this.animations)
		this.animations[id].loadProperties();
   for (var id in this.animationsGround)
		this.animationsGround[id].loadProperties();
}

//--------------------------------------------------------
animationManager.prototype.saveProperties = function()
{
   for (var id in this.animations)
		this.animations[id].saveProperties();
   for (var id in this.animationsGround)
		this.animationsGround[id].saveProperties();
}
