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
	
	this.state_show_photo 		= {id : 1, pathFile : ""};
	this.state_show_photo_list 	= {id : 2, timeChangePhoto:0.0, intervalChangePhoto: 0.05};

	this.state 		= this.state_show_photo;
	this.stateTime 	= 0.0;
	
	// Timer
	this.timer = new timer();
	
	
	// Photos texture for state_show_photo
	this.photoTexture = null;
	this.photoTextureLoaded = false;
	
	// List of photos for state_show_photo_list
	this.listPhotosFolder = __dirname + "/Data/Db/files/figure-thumbs/";
	this.listPhotos = new Array(20);
	this.listPhotosTexture = new Array( this.listPhotos.length );
	this.loaderListPhotos = new THREE.TextureLoader();
	this.listPhotosLoadIndex = 0;
	this.listPhotosLoaded = false;
	this.listPhotosIndexShow = 0;
	this.listPhotosIndexAdd = 0;
	this.listBlockSlide = false;
	

	//--------------------------------------------------------
	this.loadListPhotoTexture = function()
	{
//		console.log("loading " + this.listPhotos[this.listPhotosLoadIndex]);

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
		{
			this.loadListPhotoTexture();
		}
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
		
		var indexEndMax = parseInt( listPhotosAll.length-this.listPhotos.length-1 );


		var indexStart = parseInt( Math.random()*indexEndMax );
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
		this.setIntervalChangePhoto(0.05);

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
			if (newState === this.state_show_photo)
			{
				this.photoTextureLoaded = false;
				this.loadPhoto(this.state_show_photo.pathFile);
				bChangeState = true;
			}
			else
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
				this.loadPhoto(this.state_show_photo.pathFile);
				bChangeState = true;
			}
		}
	
		if (bChangeState)
		{
			bChangeState = false;
			this.state = newState;
		 	this.stateTime = 0.0;
		}
	
	}


	//--------------------------------------------------------
	this.loadPhoto = function( pathFile )
	{
		var pThis = this;
		this.loaderPhoto.load
		(
			pathFile,
			function(texture)
			{
				pThis.photoTexture = texture;
				pThis.photoTextureLoaded = true;
			}
		);
	}

	//--------------------------------------------------------
	this.prevName = "";
	this.setPhoto = function( pathPhoto )
	{
		// New photo ?
		if (pathPhoto != this.state_show_photo.pathFile)
		{
			this.state_show_photo.pathFile = pathPhoto;
			this.changeState( this.state_show_photo );
		}
	}


	//--------------------------------------------------------
	this.isPhotoInList = function(path)
	{
		var nb = this.listPhotos.length;
		for (var i=0;i<nb;i++)
		{
		 	if (this.listPhotos[i] === path)
				return true;
		}
		return false;
	}

	//--------------------------------------------------------
	this.setPhotoList = function(info)
	{
		this.changeState( this.state_show_photo_list );
	}

	//--------------------------------------------------------
	this.addPhotoToList = function(path)
	{
		if (this.state == this.state_show_photo_list)
		{
			if (this.listPhotosIndexShow != this.listPhotosIndexAdd && this.listPhotosLoaded)
			{
				// this.listPhotosLoaded set to true block slideshow
				if (this.isPhotoInList( path ) == false)
				{
					this.loaderListPhotos.load(path, this.addPhotoToListLoaded.bind(this));
			
					this.listPhotos[this.listPhotosIndexAdd] = path;
					this.listPhotosLoaded = false;
				}
			}
		}
	}

	//--------------------------------------------------------
	this.addPhotoToListLoaded = function(texture)
	{
		// Release previous texture
		if (this.listPhotosTexture[this.listPhotosIndexAdd])
		{
			this.listPhotosTexture[this.listPhotosIndexAdd].dispose();
			this.listPhotosTexture[this.listPhotosIndexAdd] = null;
		}

		// Set new
		this.listPhotosTexture.splice(this.listPhotosIndexAdd,1,texture);
		this.listPhotosLoaded = true;
		this.listPhotosIndexAdd = (this.listPhotosIndexAdd+1)%this.listPhotosTexture.length;
	}

	//--------------------------------------------------------
	this.setIntervalChangePhoto = function(v)
	{
		this.state_show_photo_list.intervalChangePhoto = v;
	}

	//--------------------------------------------------------
	this.setPhotoSize = function(v)
	{
		this.meshPhoto.scale.set( v, v, 1 );
	}

	//--------------------------------------------------------
	this.setPhotoPositionX = function(x)
	{
		this.meshPhoto.position.set( x * this.container.width(), this.meshPhoto.position.y, 0 );
	}

	//--------------------------------------------------------
	this.setPhotoPositionY = function(y)
	{
		this.meshPhoto.position.set( this.meshPhoto.position.x, y * this.container.height(), 0 );
	}

	//--------------------------------------------------------
	this.setCameraSpeed = function(speed)
	{
		if (speed < 1)
		{
			// this.state_show_photo_list.intervalChangePhoto = 100;
			this.listBlockSlide = true;
		}
		else
		{
			this.state_show_photo_list.intervalChangePhoto = 30.0 / speed;
			this.listBlockSlide = false;
		}

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
				this.materialPhoto.map = this.photoTexture;
				this.materialPhoto.needsUpdate = true;
				
			}
		}
		else
		if (this.state === this.state_show_photo_list)
		{
		   if (this.listPhotosLoaded)
		   {
			   this.state_show_photo_list.timeChangePhoto += dt;
			   if (!this.listBlockSlide && this.state_show_photo_list.timeChangePhoto >= this.state_show_photo_list.intervalChangePhoto)
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

