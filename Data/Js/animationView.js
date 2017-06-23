function animationView(){}

//--------------------------------------------------------
animationView.prototype.animationCurrent = null;
animationView.prototype.container = null;


//--------------------------------------------------------
animationView.prototype.init = function()
{
   this.container = $("#animation");


   var w = this.container.width();
   var h = this.container.height();


   var plane = new THREE.PlaneBufferGeometry( w, h );

   this.scene = new THREE.Scene();
   this.camera = new THREE.OrthographicCamera( w / - 2, w / 2, h / 2, h / - 2, - 1000, 1000 );
   this.material = new THREE.MeshBasicMaterial(
   {map:null, depthWrite: false}
   );
   this.quad = new THREE.Mesh( plane, this.material );
   this.scene.add( this.camera );
   this.scene.add( this.quad );

   this.renderer = new THREE.WebGLRenderer();
   this.renderer.setPixelRatio( window.devicePixelRatio );
   this.renderer.setSize( w, h );
   this.renderer.autoClear = true;

   this.container[0].appendChild( this.renderer.domElement );

   window.requestAnimationFrame(this.render.bind(this));
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
   if (this.animationCurrent)
	   this.animationCurrent.render(this.renderer, true);
   this.renderer.render( this.scene, this.camera );

   window.requestAnimationFrame(this.render.bind(this));
}
