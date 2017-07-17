function photoView()
{
	this.camera = null;
	this.scene = null;

	this.container = null;
	this.renderer = null;

	this.materialPhoto = null;
	this.meshPhoto = null;
	this.sizePhoto = 1;
	this.loaderPhoto = new THREE.TextureLoader();

	//--------------------------------------------------------
	this.init = function(name)
	{
		this.container = $(name);
		
		this.resizeContainer();

		var width = this.container.width();
		var height = this.container.height();
		
		
		this.sizePhoto = Math.min(width,height);
		
		// Scene
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color( 0x000000 );

		// Camera
		this.camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
		this.scene.add( this.camera );


		// Photo plane
		var geometry = new THREE.PlaneGeometry(this.sizePhoto,this.sizePhoto,1,1);
		this.materialPhoto = new THREE.MeshBasicMaterial({color:0xffffff});
		this.meshPhoto = new THREE.Mesh( geometry, this.materialPhoto );

		
		this.scene.add( this.meshPhoto );
		
		// Debug
		// this.scene.add( new THREE.AxisHelper( 50 ) );


		// Renderer
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( width, height );
		this.renderer.context.disable(this.renderer.context.DEPTH_TEST);

		this.container.append( this.renderer.domElement );
		
		this.setPhotoSize(0.75);

		this.animate();

	}

	//--------------------------------------------------------
	this.resizeContainer = function()
	{
		this.container.css
		(
			{ "width" : $(window).width(), "height" : $(window).height()}
		);

	}
	//--------------------------------------------------------
	this.resize = function()
	{
		if (this.container)
		{
			this.resizeContainer();

			var w = this.container.width();
			var h = this.container.height();

			this.camera.left = w / - 2;
        	this.camera.right = w / 2;
        	this.camera.top = h / 2;
        	this.camera.bottom = h / - 2;

			this.camera.updateProjectionMatrix();

			this.renderer.setSize( this.container.width(), this.container.height() );
		}
	}

	//--------------------------------------------------------
	this.prevName = "";
	this.setPhoto = function(info)
	{
		var pThis = this;
		
		
		// TEMP -> use info to load photo
		var nameImages = ["843260", "843261", "843264", "843266", "843267", "843270"];
		var indexRnd = parseInt(Math.random()*nameImages.length);
		if (indexRnd == nameImages.length) indexRnd -= 1;
		
		do
		{
			var indexRnd = parseInt(Math.random()*nameImages.length);
		}
		while (  this.prevName == nameImages[indexRnd]  );
	 
		
		
		
		var pathImage = "Data/Db/files/figure-thumbs/"+nameImages[indexRnd]+".png";

		this.loaderPhoto.load(
		pathImage,
		function(texture){
			pThis.materialPhoto.map = texture;
			pThis.materialPhoto.needsUpdate = true;
		});
	
		this.prevName = nameImages[indexRnd];
	}



	//--------------------------------------------------------
	this.setPhotoSize = function(f)
	{
		this.meshPhoto.scale.set( f, f );
	}

	//--------------------------------------------------------
	this.animate = function()
	{
		this.render();
		window.requestAnimationFrame( this.animate.bind(this) );
	}

	//--------------------------------------------------------
	this.render = function()
	{
		this.camera.position.set(0,0,10);
		this.renderer.render( this.scene, this.camera );
	}
}

var photoView = new photoView();

