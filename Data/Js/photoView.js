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
	
	this.state_show_photo 		= {id : 1};
	this.state_show_photo_list 	= {id : 2, timeChangePhoto:0.0, intervalChangePhoto: 0.05};

	this.state 		= this.state_show_photo;
	this.stateTime 	= 0.0;
	
	// Timer
	this.timer = new timer();
	
	
	// TEMP
	this.photoTexture = null;
	this.photoTextureLoaded = false;
	
	this.listPhotosFolder = __dirname+"/Data/Db/files/figure-thumbs/";
	this.listPhotos = new Array(20);
	this.listPhotosTexture = new Array( this.listPhotos.length );
	this.loaderListPhotos = new THREE.TextureLoader();
	this.listPhotosLoadIndex = 0;
	this.listPhotosLoaded = false;
	this.listPhotosIndexShow = 0;
	


	//--------------------------------------------------------
	this.loadListPhotoTexture = function()
	{
		console.log("loading " + this.listPhotos[this.listPhotosLoadIndex]);

		this.loaderListPhotos.load
		(
			this.listPhotos[this.listPhotosLoadIndex],
			this.loadListPhotoTextureDone.bind(this)
		);
	
	}

	//--------------------------------------------------------
	this.loadListPhotoTextureDone = function(texture)
	{
		this.listPhotosTexture[this.listPhotosLoadIndex] = texture;

		this.listPhotosLoadIndex++;
		if (this.listPhotosLoadIndex < this.listPhotos.length)
			this.loadListPhotoTexture();
		else
		{
			this.listPhotosLoaded = true;

			this.materialPhoto.map = this.listPhotosTexture[0];
			this.materialPhoto.needsUpdate = true;
		}
	}


	//--------------------------------------------------------
	this.init = function(name)
	{
		this.container = $(name);
		
		this.resizeContainer();

		var width = this.container.width();
		var height = this.container.height();
		
		
		this.sizePhoto = Math.min(width,height);

		// TEMP : Photo list
		var fs = require('fs');
		var listPhotosAll = fs.readdirSync(this.listPhotosFolder);
		
		var indexStart = parseInt( listPhotosAll.length-this.listPhotos.length-1 );
		var indexEnd = indexStart + this.listPhotos.length;
		var j=0;
		for (var i=indexStart;  i<indexEnd; i++)
		{
			this.listPhotos[j++] = this.listPhotosFolder + listPhotosAll[i];
		}

		this.listPhotosLoadIndex = 0;
		this.listPhotosLoaded = false;
		this.loadListPhotoTexture();
	 
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

		// Timer
		this.timer.reset();

		this.changeState(this.state_show_photo_list);

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

			this.renderer.setSize( w, h );
		}
	}
	
	//--------------------------------------------------------
	this.changeState = function(newState)
	{
		var bChangeState = false;
	
		if (this.state === this.state_show_photo)
		{
			if (newState === this.state_show_photo_list)
			{
				this.state_show_photo_list.timeChangePhoto = 0.0;

				bChangeState = true;
			}
		}
		else if (this.state === this.state_show_photo_list)
		{
			if (newState === this.state_show_photo)
			{
				this.photoTextureLoaded = false;
				bChangeState = true;
			}
		}
	
		if (bChangeState)
		{
			bChangeState = true;
			this.state = newState;
		 	this.stateTime = 0.0;
		}
	
	}

	//--------------------------------------------------------
	this.prevName = "";
	this.setPhoto = function(info)
	{
		this.changeState( this.state_show_photo );
		
		
		// TEMP -> use info to load photo
		var pThis = this;
		var nameImages = ["843260", "843261", "843264", "843266", "843267", "843270"];
		do
		{
			var indexRnd = parseInt(Math.random()*nameImages.length);
			if (indexRnd == nameImages.length) indexRnd -= 1;
		}
		while (  this.prevName == nameImages[indexRnd]  );
		
		
		var pathImage = "Data/Db/files/figure-thumbs/"+nameImages[indexRnd]+".png";

		this.loaderPhoto.load(
		pathImage,
		function(texture){
			pThis.photoTexture = texture;
		
		
			pThis.materialPhoto.map = texture;
			pThis.materialPhoto.needsUpdate = true;
		});
	
		this.prevName = nameImages[indexRnd];


	}


	//--------------------------------------------------------
	this.setPhotoList = function(info)
	{
		this.changeState( this.state_show_photo_list );
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
		var dt = this.timer.update();
		
		
		if (this.state === this.state_show_photo)
		{
			if (this.photoTextureLoaded)
			{
				this.photoTextureLoaded = false;
				this.materialPhoto.tex = this.photoTexture;
				this.materialPhoto.needsUpdate = true;
			}
		}
		else
		if (this.state === this.state_show_photo_list)
		{
		   if (this.listPhotosLoaded)
		   {
			   this.state_show_photo_list.timeChangePhoto += dt;
			   if (this.state_show_photo_list.timeChangePhoto >= this.state_show_photo_list.intervalChangePhoto)
			   {
				   this.state_show_photo_list.timeChangePhoto = 0;
				   this.listPhotosIndexShow = (this.listPhotosIndexShow+1)%this.listPhotos.length;

				   this.materialPhoto.map = this.listPhotosTexture[ this.listPhotosIndexShow ];
				   this.materialPhoto.needsUpdate = true;
			   }
		   }
		}
	
		this.camera.position.set(0,0,10);
		this.renderer.render( this.scene, this.camera );
	}
}

var photoView = new photoView();

