//--------------------------------------------------------
function animationRectRotate(){}

//--------------------------------------------------------
animationRectRotate.prototype = Object.create(animationCanvas.prototype);
animationRectRotate.prototype.angle = 0;

//--------------------------------------------------------
animationRectRotate.prototype.loadProperties = function()
{
	this.properties.rotSpeed = 30.0;
	this.properties.size = 0.5;
}

//--------------------------------------------------------
animationRectRotate.prototype.addControls = function()
{
	this.gui.add(this.properties, 'rotSpeed', 20.0, 90.0);
	this.gui.add(this.properties, 'size', 0.2, 1.0);
}

//--------------------------------------------------------
animationRectRotate.prototype.render = function(renderer_)
{
	var dt = this.timer.update();

	// Values
	this.angle  += this.properties.rotSpeed*dt;
	if (this.angle >= 360.0) this.angle -= 360.0;

	var rectSize = /*0.5*(1.0+Math.sin( this.angle * Math.PI/180 ))*/this.properties.size * this.drawingCanvas.width;
//	var scaleX = 128 / 120; // TEMP
//	var scaleY = 128 / 180; // TEMP
// Scale proble to fix

	// Draw on canvas
	this.drawingContext.fillStyle = "#000000";
	this.drawingContext.fillRect( 0, 0, this.drawingCanvas.width, this.drawingCanvas.height );

	this.drawingContext.save();

	this.drawingContext.translate(this.drawingCanvas.width/2, this.drawingCanvas.height/2);
	this.drawingContext.rotate(this.angle * Math.PI/180);
//	this.drawingContext.scale(scaleX, scaleY);
	this.drawingContext.translate(-rectSize/2, -rectSize/2);

	this.drawingContext.fillStyle = "#FFFFFF";
	this.drawingContext.fillRect(0, 0, rectSize, rectSize );

	this.drawingContext.restore();

	this.texture.needsUpdate = true;

	renderer_.render( this.sceneRTT, this.cameraRTT, this.rendererRTT, true );
	this.sampleAndSendValues(renderer_);
}
