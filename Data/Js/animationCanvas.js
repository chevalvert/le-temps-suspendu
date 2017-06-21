//--------------------------------------------------------
function animationCanvas(){}
animationCanvas.prototype = Object.create(animation.prototype);
animationCanvas.prototype.drawingCanvas = null;
animationCanvas.prototype.drawingContext = null;
animationCanvas.prototype.texture = null;

//--------------------------------------------------------
animationCanvas.prototype.createMaterial = function()
{
	console.log("animationCanvas.prototype.createMaterial");
	this.drawingCanvas = document.getElementById( 'animation-canvas' );
	this.drawingContext = this.drawingCanvas.getContext( '2d' );
//	this.drawingContext.map =  new THREE.Texture( this.drawingCanvas );
//	this.drawingContext.map.needsUpdate = true;

	this.texture = new THREE.Texture( this.drawingCanvas );
//	this.texture = this.drawingContext.map;

//	this.materialRTT = new THREE.MeshBasicMaterial({map:this.drawingContext.map});
	this.materialRTT = new THREE.MeshBasicMaterial({map:this.texture});
}

//--------------------------------------------------------
animationCanvas.prototype.addControls = function()
{
}

//--------------------------------------------------------
animationCanvas.prototype.render = function(renderer_)
{
}


