function gridview()
{
	//--------------------------------------------------------
	this.mouseX=0, this.mouseY=0;
	this.mouseDownX=0, this.mouseDownY=0;
	this.mouseDragX=0,this.mouseDragY=0;
	this.bMouseDown = false;
	this.bMouseDrag = false;
	this.thMouseDragStart = 3; // pixels
	this.factorMouseDrag = 2; // pixels

	this.cbMouseClick = null;
	this.cbMouseDragStart = null;
	this.cbMouseDrag = null;
	this.cbMouseDragEnd = null;


	this.cameraPosition = {x:0,y:0};
	this.cameraPositionNormalized = {x:0,y:0};
	this.cameraPositionStart = {x:0,y:0};
	this.cameraPositionOffset = {x:0,y:0};
	this.cameraPositionTarget = {x:0,y:0};
	this.cameraSpeedFactorDrag = 0.1;
	this.cameraSpeedFactor = this.cameraSpeedFactorDrag;

	this.cameraPerspective = null;
	
	this.cameraCurrent = null;
	this.cameraMesh = null;
 
	this.imgWidth 	= 1280*4;
	this.imgHeight 	= this.imgWidth;
	this.imgSub		= 8 ; // number of subdivision for an image

	this.gridWidth 	= this.imgWidth * 9;
	this.gridHeight = this.imgHeight * 12;
	
	this.nbThumbs 	= 30; // per row / column
	
	this.thumbSize  = this.imgWidth / this.nbThumbs;
	
	this.imgI	= 0;
	this.imgJ	= 0;
	this.imgCam	= null;

	
	this.imgClickedId = -1;
	this.thumbClickedId = -1;
//	this.thumbClicked = {imgId : -1, i : -1, j : -1, ii : -1, jj : -1, offset : -1, };
//	this.thumbOver = {imgId : -1, i : -1, j : -1, ii : -1, jj : -1 offset : -1, }; // Camera position over thumb
	
	this.overlayMesh = null;
	this.overlayOpacity = this.overlayOpacityTarget = 0.0;

	this.overlayImageCache = null;

	this.bGotoThumb = false;


	//--------------------------------------------------------
	// Timer
	this.timer = new timer();

	//--------------------------------------------------------
	// 3D / 2D scene
	this.camera = null;
	this.scene = null;

	this.container = null;
	this.renderer = null;
	
	// Images container
	this.gridImagesList = new Array(9*12);

	var pThis = this;

	//--------------------------------------------------------
	this.mouseDrag = function()
	{
		this.mouseDragX = this.factorMouseDrag*(this.mouseX - this.mouseDownX);
		this.mouseDragY = this.factorMouseDrag*(this.mouseY - this.mouseDownY);

		this.cameraPositionOffset.x = -this.mouseDragX;
		this.cameraPositionOffset.y = this.mouseDragY;

		this.cameraPositionTarget.x = this.cameraPositionStart.x+this.cameraPositionOffset.x;
		this.cameraPositionTarget.y = this.cameraPositionStart.y+this.cameraPositionOffset.y;


		if (typeof this.cbMouseDrag === "function")
			this.cbMouseDrag();
	}

	//--------------------------------------------------------
	this.mouseClick = function()
	{
		var clickX = this.cameraPosition.x - 0.5*this.container.width() + this.mouseX;
		var clickY = this.cameraPosition.y + 0.5*this.container.height() - this.mouseY;
		
		var i = parseInt(clickX / this.gridWidth * 9);
		var j = parseInt(clickY / this.gridHeight * 12);

		// inside image now
		var clickInsideX = clickX - i * this.imgWidth;
		var clickInsideY = clickY - j * this.imgHeight;


		var ii = parseInt( clickInsideX / this.thumbSize);
		var jj = this.nbThumbs-1-parseInt( clickInsideY / this.thumbSize);

		this.imgClickedId 	= i+9*j;
		this.thumbClickedId = (ii+this.nbThumbs*jj);
		
		this.overlayImageCache.setPosition( i*this.imgWidth + ii*this.thumbSize + 0.5*this.thumbSize, j*this.imgHeight + (29-jj)*this.thumbSize + 0.5*this.thumbSize   );
	
		if (typeof this.cbMouseClick === "function")
			this.cbMouseClick();
	}

	//--------------------------------------------------------
	this.mousedragEnd = function()
	{
	}


	//--------------------------------------------------------
	this.gotoThumb = function(imgI,imgJ, thumbOffset)
	{
		var ii = thumbOffset % this.nbThumbs;
		var jj = parseInt(thumbOffset / this.nbThumbs);
			
		this.cameraPositionTarget.x = imgI * this.imgWidth  + ii*this.thumbSize + 0.5*this.thumbSize;
		this.cameraPositionTarget.y = imgJ * this.imgHeight + (this.nbThumbs-jj)*this.thumbSize - 0.5*this.thumbSize;

		this.overlayImageCache.setPosition( this.cameraPositionTarget.x, this.cameraPositionTarget.y   );
		
		this.showOverlayImage(false);
		this.bGotoThumb = true;
	}

	//--------------------------------------------------------
	this.showOverlayImage = function(is)
	{
		this.overlayImageCache.setOpacity( is ? 0.8 : 0.0 );
	}

	//--------------------------------------------------------
	this.mask = function(is)
	{
		this.overlayOpacityTarget = is ? 1.0 : 0.0;
	}

	//--------------------------------------------------------
	this.init = function(containerId)
	{
		var pThis = this;
	
		this.container = $(containerId);
		this.timer.reset();
		
	 
	 	// Mouse move
		this.container.mousemove(function(event)
		{
			pThis.mouseX = event.pageX;
			pThis.mouseY = event.pageY;

			if (!pThis.bMouseDrag && ( pThis.bMouseDown && Math.dist(pThis.mouseX,pThis.mouseY,pThis.mouseDownX,pThis.mouseDownY) >= pThis.thMouseDragStart ))
			{
				pThis.bMouseDrag = true;
				pThis.cameraPositionOffset = {x:0, y:0};
				pThis.cameraPositionStart = {x:pThis.cameraPosition.x, y:pThis.cameraPosition.y}
				pThis.cameraSpeedFactor = pThis.cameraSpeedFactorDrag;
			}
			
			if (pThis.bMouseDrag)
			{
				pThis.mouseDrag();
			}
		});

	 	// Mouse down
		this.container.mousedown(function(event)
		{
			pThis.mouseDownX = event.pageX;
			pThis.mouseDownY = event.pageY;
			pThis.bMouseDown = true;


			if (typeof pThis.cbMouseDragStart === "function")
				pThis.cbMouseDragStart();
			
		});

	 	// Mouse up
		this.container.mouseup(function(event)
		{
			if (pThis.bMouseDrag)
			{
				pThis.mousedragEnd();
				if (typeof pThis.cbMouseDragEnd === "function")
					pThis.cbMouseDragEnd();
			}
			else
			{
				pThis.mouseClick();
			}

			pThis.bMouseDown = false;
			pThis.bMouseDrag = false;
			pThis.mouseDragX = 0;
			pThis.mouseDragY = 0;
			
		});


	 	// Key down
		$(document).keydown(function(event)
		{
			var c = String.fromCharCode(event.which);
			
			console.log(c);
			if (c == ' ')
			{
				if (pThis.cameraCurrent == pThis.cameraPerspective)
				{
					pThis.cameraCurrent = pThis.camera;
					pThis.renderer.context.disable(pThis.renderer.context.DEPTH_TEST);
				}
				else if (pThis.cameraCurrent == pThis.camera)
				{
					pThis.cameraCurrent = pThis.cameraPerspective;
					pThis.renderer.context.enable(pThis.renderer.context.DEPTH_TEST);
				}
				
			}
			else if (c == 'G')
			{
				var thumbOffset = parseInt( Math.random()*(pThis.nbThumbs*pThis.nbThumbs-1) );
			
				pThis.gotoThumb(0,0, thumbOffset);
				
				console.log("gotoThumb("+thumbOffset+")");
			}
		});
	 

		// Scene, Camera & stuff
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color( 0x222222 );


		var width = this.container.width();
		var height = this.container.height();


		this.camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );

		this.cameraPerspective = new THREE.PerspectiveCamera( 50, width / height, 1, 10000);
		this.cameraPerspective.position.z = 5000;


		this.cameraCurrent = this.camera;

		this.scene.add( this.camera );
		// this.scene.add( new THREE.AxisHelper( 50 ) );

		this.cameraMesh = new THREE.Mesh
		(
			new THREE.PlaneGeometry(width,height,1,1),
			new THREE.MeshBasicMaterial({color:0xffff00 , wireframe:true})
		  );
		this.scene.add( this.cameraMesh );

		this.overlayMesh = new THREE.Mesh
		(
			new THREE.PlaneGeometry(width,height,1,1),
			new THREE.MeshBasicMaterial({color:0x000000 , transparent :true, wireframe:false, opacity : 0.0})
		  );
		this.scene.add( this.overlayMesh );


		this.overlayImageCache = new gridViewMeshImageCache( this.scene, width, height,  this.thumbSize, this.thumbSize);




		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( width, height );
		this.renderer.context.disable(this.renderer.context.DEPTH_TEST);

		this.container.append( this.renderer.domElement );
	 
		this.createGridImagesCache();

		this.animate();
	}

	//--------------------------------------------------------
	this.createGridImagesCache = function()
	{
		var i,j;
		var id = 0;
		var gridImagesCacheObj;
		var pThis = this;
		for (j=0;j<12;j++)
		{
			for (i=0;i<9;i++)
			{
				gridImagesCacheObj = new gridImagesCache(id,i*this.imgWidth,j*this.imgHeight, this.imgWidth, this.imgHeight, this.imgSub);
				gridImagesCacheObj.create(pThis.scene)

				this.gridImagesList[id++] = gridImagesCacheObj;
			}
		}
	}

	//--------------------------------------------------------
	this.animate = function()
	{
		this.render();
		window.requestAnimationFrame( this.animate.bind(this) );
	}

	//--------------------------------------------------------
	// TODO : check this
	this.limitCameraPosition = function()
	{
		if (this.cameraPosition.x <= 0)
		{
			this.bMouseDrag = false;
			this.cameraPositionTarget.x = this.container.width() / 2;
			this.cameraSpeedFactor = this.cameraSpeedFactorDrag / 2;
		}
		else if (this.cameraPosition.x >= this.gridWidth)
		{
			this.bMouseDrag = false;
			this.cameraPositionTarget.x = this.gridWidth - this.container.width() / 2;
			this.cameraSpeedFactor = this.cameraSpeedFactorDrag / 2;
		}


		if (this.cameraPosition.y <= 0)
		{
			this.bMouseDrag = false;
			this.cameraPositionTarget.y = this.container.height() / 2;
			this.cameraSpeedFactor = this.cameraSpeedFactorDrag / 2;
		}
		else if (this.cameraPosition.y >= this.gridHeight)
		{
			this.bMouseDrag = false;
			this.cameraPositionTarget.y = this.gridHeight - this.container.height() / 2;
			this.cameraSpeedFactor = this.cameraSpeedFactorDrag / 2;
		}
	}
	
	//--------------------------------------------------------
	this.render = function()
	{

		// Timer
		var dt = this.timer.update();
	
		// Update camera position
		this.cameraPosition.x += (this.cameraPositionTarget.x - this.cameraPosition.x) * this.cameraSpeedFactor;
		this.cameraPosition.y += (this.cameraPositionTarget.y - this.cameraPosition.y) * this.cameraSpeedFactor;
		this.limitCameraPosition();
		
		this.cameraPositionNormalized.x = this.cameraPosition.x / this.gridWidth;
		this.cameraPositionNormalized.y = this.cameraPosition.y / this.gridHeight;

		this.camera.position.set(this.cameraPosition.x,this.cameraPosition.y,10);
		this.cameraMesh.position.set( this.camera.position.x, this.camera.position.y, 10 );
		this.cameraPerspective.position.set(this.camera.position.x, this.camera.position.y, 4500);
		
		// Overlay (Mask)
		this.overlayOpacity += (this.overlayOpacityTarget - this.overlayOpacity) * 0.3;

		this.overlayMesh.position.set( this.cameraPosition.x,  this.cameraPosition.y, 1);
		this.overlayMesh.material.opacity = this.overlayOpacity;

		// Overlay (Thumb)
		this.overlayImageCache.update(dt);
		if (this.bGotoThumb)
		{
			if (
				Math.abs( this.cameraPositionTarget.x - this.cameraPosition.x ) < 1.0 &&
				Math.abs( this.cameraPositionTarget.y - this.cameraPosition.y ) < 1.0
				)
				{
					this.bGotoThumb = false;
					this.showOverlayImage(true);
				}
		}
		
		
		// Image where camera is over
		this.imgCam = null;
		this.imgI	= parseInt(this.cameraPositionNormalized.x * 9);
		this.imgJ	= parseInt(this.cameraPositionNormalized.y * 12);
	 	if (this.imgI>=0 && this.imgI <= 8 && this.imgJ>=0 && this.imgJ <= 11)
		{
			this.imgCam = this.gridImagesList[this.imgI + 9*this.imgJ];
		}
	 

	 

		// upload textures to images
		var g = null;
		var i,j,offset;

		for (j=0;j<9*12;j++)
			this.gridImagesList[j].markUnloadTexture();


		var ii,jj;
		for (j=0;j<12;j++)
		{
			for (i=0;i<9;i++)
			{
				offset = i+9*j;
				g = this.gridImagesList[offset];

				if ( this.camera.position.x >= g.x && this.camera.position.x <= (g.x+g.w) && this.camera.position.y >= g.y && this.camera.position.y <= (g.y+g.h))
				{
					for (var ii = i-1; ii <= i+1 ; ii++)
						for (var jj = j-1; jj <= j+1 ; jj++)
						{
							if (ii>=0 && ii<=8 && jj>=0 && jj<=11)
							{
								this.gridImagesList[ ii + 9*jj ].markLoadTexture();
							}
						}
				}

			}
		}

		for (j=0;j<9*12;j++)
			this.gridImagesList[j].update(dt);


		this.renderer.render( this.scene, this.cameraCurrent );

	}
}

var gridview = new gridview();
