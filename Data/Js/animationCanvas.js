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
	
	this.drawingCanvas = document.getElementById( 'animation-canvas' );
	this.drawingContext = this.drawingCanvas.getContext( '2d' );

	this.texture = new THREE.Texture( this.drawingCanvas ); // should be power of two
	this.materialRTT = new THREE.MeshBasicMaterial({map:this.texture});
}



