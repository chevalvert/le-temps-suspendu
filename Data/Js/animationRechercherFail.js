//--------------------------------------------------------
function animationRechercherFail(){}

//--------------------------------------------------------
animationRechercherFail.prototype = Object.create(animationCanvas.prototype);

//--------------------------------------------------------
animationRechercherFail.prototype.loadProperties = function()
{
	this.properties = {}
	this.properties.sizeRect = 30;
	this.properties.frameBlending = 0.1;
	this.readPropertiesFile();
}

//--------------------------------------------------------
animationRechercherFail.prototype.addControls = function()
{
 	this.gui.add(this.properties, 'sizeRect', 		10.0, 	50.0);
 	this.gui.add(this.properties, 'frameBlending', 	0.0, 	1.0);
}

//--------------------------------------------------------
animationRechercherFail.prototype.render = function(renderer_, bSample)
{

	this.drawingContext.fillStyle = "rgba(0,0,0,"+this.properties.frameBlending+")";
	this.drawingContext.fillRect( 0, 0, this.drawingCanvas.width, this.drawingCanvas.height );

	this.drawingContext.save();
//	this.drawingContext.scale(128.0 / 120.0, 128.0 / 180.0);

	var rndx = Math.random();
	var rndy = Math.random();
	this.drawingContext.fillStyle = "#FFFFFF"
	this.drawingContext.fillRect(rndx*this.drawingCanvas.width, rndy*this.drawingCanvas.height, this.properties.sizeRect, this.properties.sizeRect );

	this.drawingContext.restore();

	this.texture.needsUpdate = true;
	this.renderOffscreen(renderer_);
	if (bSample)
		this.sampleAndSendValues(renderer_);
}
