//--------------------------------------------------------
function animationPanelDebug(){}

//--------------------------------------------------------
animationPanelDebug.prototype = Object.create(animationCanvas.prototype);
animationPanelDebug.prototype.panel = 9*11;

//--------------------------------------------------------
animationPanelDebug.prototype.loadProperties = function()
{

	this.properties = {}

//	this.readPropertiesFile();


	var pThis = this;
	$(document).keydown(function(e){
		pThis.panel = Math.round( Math.random()*9*12 );
		console.log("panel="+pThis.panel);
	});
}

//--------------------------------------------------------
animationPanelDebug.prototype.addControls = function()
{
//	this.gui.add(this.properties, 'rotSpeed', 20.0, 90.0);
}

//--------------------------------------------------------
animationPanelDebug.prototype.drawPanel = function(canvas, panel, alpha)
{
	var nbPanelsColumns = this.nbColumns / 2;
	var nbPanelsRows = this.nbRows;

	var panelI = parseInt(panel % nbPanelsColumns);
	var panelJ = parseInt(panel / nbPanelsColumns);

	var stepx = parseInt(canvas.width / nbPanelsColumns);
	var stepy = parseInt(canvas.height / nbPanelsRows);

	var x = panelI * stepx;
	var y = canvas.height - panelJ * stepy - stepy;

	this.drawingContext.fillStyle = "rgba(255,255,255,"+alpha+")";
	this.drawingContext.fillRect( x, y, stepx, stepy );
}

//--------------------------------------------------------
animationPanelDebug.prototype.render = function(renderer_, bSample)
{
	var dt = this.timer.update();

	// Draw on canvas
	this.drawingContext.fillStyle = "#000000";
	this.drawingContext.fillRect( 0, 0, this.drawingCanvas.width, this.drawingCanvas.height );

	this.drawPanel(this.drawingCanvas, this.panel, 1.0)

	this.texture.needsUpdate = true;
	this.renderOffscreen(renderer_);
	if (bSample)
		this.sampleAndSendValues(renderer_);
}
