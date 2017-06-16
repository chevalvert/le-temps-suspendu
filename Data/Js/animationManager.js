function animationManager()
{
	this.animation 	= null;
	this.animations = [];
}


animationManager.prototype.setup = function()
{
   var animation01 = new animationSine();
   var animation02 = new animationPlasma();

   animation01.setup();
   animation02.setup();

   this.animations["sine"] =  animation01;
   this.animations["plasma"] = animation02;
}



