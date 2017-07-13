function animationView(){}

//--------------------------------------------------------
animationView.prototype.animationCurrent = null;
animationView.prototype.container = null;
animationView.prototype.containerName = "#animation";

//--------------------------------------------------------
animationView.prototype.init = function()
{
   this.container = $(this.containerName);

   var w = this.container.width();
   var h = this.container.height();


   var plane = new THREE.PlaneBufferGeometry( w, h );

   this.scene = new THREE.Scene();
   this.camera = new THREE.OrthographicCamera( w / - 2, w / 2, h / 2, h / - 2, - 1000, 1000 );
   this.material = new THREE.MeshBasicMaterial( {map:null, depthWrite: false} );
   this.quad = new THREE.Mesh( plane, this.material );
   this.scene.add( this.camera );
   this.scene.add( this.quad );

   this.renderer = new THREE.WebGLRenderer();
   this.renderer.setPixelRatio( window.devicePixelRatio );
   this.renderer.setSize( w, h );
   this.renderer.autoClear = true;

   this.container[0].appendChild( this.renderer.domElement );

   window.requestAnimationFrame( this.render.bind(this) );
}

//--------------------------------------------------------
animationView.prototype.setAnimation = function(animation)
{
	this.animationCurrent = animation;
	this.material.map = animation.rendererRTT.texture;
}

//--------------------------------------------------------
animationView.prototype.render = function()
{
   // Offscreen rendering
   // TODO : may be move this elsewhere (view is not responsible for rendering an animation, just display it)
   if (this.animationCurrent)
	   this.animationCurrent.render(this.renderer, true);

   // View rendering
   this.renderer.render( this.scene, this.camera );

   // Update
   window.requestAnimationFrame(this.render.bind(this));
}
