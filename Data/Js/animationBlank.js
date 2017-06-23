//--------------------------------------------------------
function animationBlank(){}

//--------------------------------------------------------
animationBlank.prototype = Object.create(animationCanvas.prototype);

//--------------------------------------------------------
animationBlank.prototype.loadProperties = function()
{
	this.properties = {}
}

//--------------------------------------------------------
animationBlank.prototype.addControls = function()
{
}

//--------------------------------------------------------
animationBlank.prototype.render = function(renderer_, bSample)
{
	this.drawingContext.fillStyle = "#000000";
	this.drawingContext.fillRect( 0, 0, this.drawingCanvas.width, this.drawingCanvas.height );

	this.texture.needsUpdate = true;

	this.renderOffscreen(renderer_);
	if (bSample)
		this.sampleAndSendValues(renderer_);
}
