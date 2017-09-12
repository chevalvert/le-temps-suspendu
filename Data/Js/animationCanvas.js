//--------------------------------------------------------
function animationCanvas(){}
animationCanvas.prototype = Object.create(animation.prototype);
animationCanvas.prototype.drawingCanvas = null;
animationCanvas.prototype.drawingContext = null;
animationCanvas.prototype.texture = null;

//--------------------------------------------------------
animationCanvas.prototype.createMaterial = function()
{
//	console.log("animationCanvas.prototype.createMaterial");
	
	var canvasId = (this.type == "floor") ? "animationGround-canvas" : "animation-canvas";


	this.drawingCanvas = document.getElementById( canvasId );
	this.drawingContext = this.drawingCanvas.getContext( '2d' );

	this.texture = new THREE.Texture( this.drawingCanvas ); // should be power of two
	this.materialRTT = new THREE.MeshBasicMaterial({map:this.texture});
}



