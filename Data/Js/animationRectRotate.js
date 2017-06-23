//--------------------------------------------------------
function animationRectRotate(){}

//--------------------------------------------------------
animationRectRotate.prototype = Object.create(animationCanvas.prototype);
animationRectRotate.prototype.angle = 0;

//--------------------------------------------------------
animationRectRotate.prototype.loadProperties = function()
{

	this.properties = {}
	this.properties.rotSpeed = 30.0;
	this.properties.size = 0.5;

	this.readPropertiesFile();
}

//--------------------------------------------------------
animationRectRotate.prototype.addControls = function()
{
	this.gui.add(this.properties, 'rotSpeed', 20.0, 90.0);
	this.gui.add(this.properties, 'size', 0.2, 1.0);
}

//--------------------------------------------------------
animationRectRotate.prototype.render = function(renderer_, bSample)
{
	var dt = this.timer.update();

	// Values
	this.angle  += this.properties.rotSpeed*dt;
	if (this.angle >= 360.0) this.angle -= 360.0;

	var rectSize = this.properties.size * this.drawingCanvas.width;

	// Draw on canvas
	this.drawingContext.fillStyle = "#000000";
	this.drawingContext.fillRect( 0, 0, this.drawingCanvas.width, this.drawingCanvas.height );

	this.drawingContext.save();
	
	this.drawingContext.translate(this.drawingCanvas.width/2, this.drawingCanvas.height/2);
	this.drawingContext.scale(128.0 / 120.0, 128.0 / 180.0);
	this.drawingContext.rotate(this.angle * Math.PI/180);
	this.drawingContext.translate(-rectSize/2, -rectSize/2);

	this.drawingContext.fillStyle = "#FFFFFF";
	this.drawingContext.fillRect(0, 0, rectSize, rectSize );

	this.drawingContext.restore();
	this.texture.needsUpdate = true;

	this.renderOffscreen(renderer_);
	if (bSample)
		this.sampleAndSendValues(renderer_);
}
