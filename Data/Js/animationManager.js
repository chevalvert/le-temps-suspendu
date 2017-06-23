//--------------------------------------------------------
function animationManager()
{
	this.animation 	= null;
	this.animations = {};
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
 
   this.animations["timeline"] 		= new animationMix();
   this.animations["timeline"].setAnimationManager(this);
   this.animations["timeline"].createTimeline();

   for (var id_ in this.animations)
   {
   		with(this.animations[id_])
		{
			id = id_;
			setup();
		}
   }
}

//--------------------------------------------------------
animationManager.prototype.update = function(dt)
{
}

//--------------------------------------------------------
animationManager.prototype.loadProperties = function()
{
   for (var id in this.animations)
		this.animations[id].loadProperties();
}

//--------------------------------------------------------
animationManager.prototype.saveProperties = function()
{
   for (var id in this.animations)
		this.animations[id].saveProperties();
}
