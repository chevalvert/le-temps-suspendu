function gridview()
{
	//--------------------------------------------------------
	// Debug
	this.bCameraDrawPosition = false; // debug


	//--------------------------------------------------------
	this.mouseX=0, this.mouseY=0;
	this.mouseDownX=0, this.mouseDownY=0;
	this.mouseDragX=0,this.mouseDragY=0;
	this.bMouseDown = false;
	this.bMouseDrag = false;
	this.thMouseDragStart = 3; // pixels
	this.factorMouseDrag = 2; // pixels
	this.bMouseDragEnable = false;

	this.cbMouseClick = null;
	this.cbMouseDragStart = null;
	this.cbMouseDrag = null;
	this.cbMouseDragEnd = null;


	this.cameraPosition 	= {x:0,y:0};
	this.cameraPositionPrev = {x:0,y:0};
	this.cameraPositionNormalized = {x:0,y:0};
	this.cameraPositionStart = {x:0,y:0};
	this.cameraPositionOffset = {x:0,y:0};
	this.cameraPositionTarget = {x:0,y:0};
	this.cameraSpeedFactorDrag = 0.1;
	this.cameraSpeedFactor = this.cameraSpeedFactorDrag;
	this.cameraDragOffset = 200.0;
	this.cameraSpeed = 0.0;

	this.cameraPosMesh 		= null;
	this.cameraPerspective 	= null;
	
	this.cameraCurrent = null;
	this.cameraMesh = null;
 
	this.imgWidth 		= 4096;
	this.imgHeight 		= this.imgWidth;
	this.imgSub			= 8 ; // number of subdivision for an image / panel
	this.imgLowRes		= 512;
	this.imgNbColumns 	= 9;
	this.imgNbRows 		= 12;
	this.imgNb 			= this.imgNbColumns * this.imgNbRows;
	this.imgFolder		= "Data/Img/"+this.imgWidth+"_cliclac_"+this.imgSub+"_"+this.imgSub+"/";
	this.imgFolderLowRes= "Data/Img/"+this.imgWidth+"_cliclac_"+this.imgLowRes+"/";
	
	this.gridWidth 		= this.imgWidth * this.imgNbColumns;
	this.gridHeight 	= this.imgHeight * this.imgNbRows;
	
	this.nbThumbs 		= 33; // per row / column
	this.thumbSize  	= this.imgWidth / this.nbThumbs;
	
	// Current camera image over
	this.imgI			= 0;
	this.imgJ			= 0;
	this.imgIndex		= -1; // -1 if invalid (if cam goes out of range for example)
	this.imgCam			= null; // ref to gridImagesList
	this.panelOver		= -1;
	this.positionOver	= -1;

	// Current thumb over
	this.thumbI   		= -1;
	this.thumbJ   		= -1;
	this.thumbPos 		= {};

	
	this.panelClicked 			= -1;	// "panel" in database
	this.panelPositionClicked 	= -1;	// "position" in database
	
	this.overlayMesh 		= null;
	this.overlayOpacity 	= this.overlayOpacityTarget = 0.0;
	this.overlayImageCache 	= null;

	this.bGotoThumb 		= false;


	// Teleport
	this.tweenTeleportFadeOut		= null;
	this.tweenTeleportFadeIn		= null;
	this.cameraPositionTeleport		= null;
	this.cameraDeltaTeleport		= {x:0, y:0};
	this.bTeleport					= false;


	//--------------------------------------------------------
	// Timer
	// this.timer = new timer();

	//--------------------------------------------------------
	// 3D / 2D scene
	this.camera = null;
	this.scene = null;

	this.container = null;
	this.renderer = null;
	
	// Images container
	// Array of gridImagesCache instances
	this.gridImagesList = new Array(this.imgNbColumns * this.imgNbRows);

	var pThis = this;


	//--------------------------------------------------------
	this.enableMouseDrag = function(is)
	{
		this.bMouseDragEnable = is;
	}

	//--------------------------------------------------------
	this.mouseDrag = function()
	{
		this.mouseDragX = this.factorMouseDrag*(this.mouseX - this.mouseDownX);
		this.mouseDragY = this.factorMouseDrag*(this.mouseY - this.mouseDownY);

		this.cameraPositionOffset.x = -this.mouseDragX;
		this.cameraPositionOffset.y = this.mouseDragY;

		this.cameraPositionTarget.x = this.cameraPositionStart.x+this.cameraPositionOffset.x;
		this.cameraPositionTarget.y = this.cameraPositionStart.y+this.cameraPositionOffset.y;

		var cw2 = this.container.width()/2;
		var ch2 = this.container.height()/2;
		

		this.cameraPositionTarget.x = Math.min( Math.max(cw2 - this.cameraDragOffset, this.cameraPositionTarget.x), this.gridWidth - cw2 + this.cameraDragOffset);
		this.cameraPositionTarget.y = Math.min( Math.max(ch2 - this.cameraDragOffset, this.cameraPositionTarget.y), this.gridHeight - ch2 + this.cameraDragOffset);

		if (typeof this.cbMouseDrag === "function")
			this.cbMouseDrag();
	}

	//--------------------------------------------------------
	this.mouseClick = function()
	{
		var clickX = this.cameraPosition.x - 0.5*this.container.width() + this.mouseX;
		var clickY = this.cameraPosition.y + 0.5*this.container.height() - this.mouseY;
		
		var i = parseInt(clickX / this.gridWidth * this.imgNbColumns);
		var j = parseInt(clickY / this.gridHeight * this.imgNbRows);
		
		// inside image now
		var clickInsideX = clickX - i * this.imgWidth;
		var clickInsideY = clickY - j * this.imgHeight;

		var ii = parseInt( clickInsideX / this.thumbSize);
		var jj = this.nbThumbs-1-parseInt( clickInsideY / this.thumbSize);
		

		this.panelClicked 			= i+this.imgNbColumns*j;
		this.panelPositionClicked 	= (ii+this.nbThumbs*jj);
	
		if (typeof this.cbMouseClick === "function")
			this.cbMouseClick();
	}

	//--------------------------------------------------------
	this.mousedragEnd = function()
	{
	}


	//--------------------------------------------------------
	this.getPathImageSub = function(index)
	{
		return this.gridImagesList[index].getPathImage(index)
	}

	//--------------------------------------------------------
	this.getPathImageSubOver = function()
	{
		return this.getPathImageSub( this.panelOver );
	}
	
	
	//--------------------------------------------------------
	this.getImageIJ = function(panel)
	{
		return {i : panel % this.imgNbColumns, j : parseInt(panel / this.imgNbColumns) }
	}

	//--------------------------------------------------------
	this.getThumbIJ = function(position)
	{
		return {i : position % this.nbThumbs, j : parseInt(position / this.nbThumbs) }
	}

	//--------------------------------------------------------
	this.getThumbPosition = function(panel, position)
	{
		var imgIJ = this.getImageIJ(panel);
		var thumbIJ = this.getThumbIJ(position);

		var pos = {};
		pos.x = imgIJ.i * this.imgWidth  + thumbIJ.i * this.thumbSize + 0.5*this.thumbSize;
		pos.y = imgIJ.j * this.imgHeight + (this.nbThumbs-thumbIJ.j) * this.thumbSize - 0.5*this.thumbSize;

		return pos;
	}

	//--------------------------------------------------------
	this.getThumbPositionNormalized = function(panel, position)
	{
		var thumbPos = this.getThumbPosition(panel, position);
		var pos = {};
		pos.x = thumbPos.x / this.gridWidth;
		pos.y = thumbPos.y / this.gridHeight;
		return pos;
	}


	//--------------------------------------------------------
	this.gotoPanelWithPosition = function(panel, position)
	{
		this.gotoThumb(panel, position);
	}

	//--------------------------------------------------------
	this.teleportPanelWithPosition = function(panel, position)
	{
		if (this.tweenTeleportFadeOut)
		{
			TWEEN.remove( this.tweenTeleportFadeIn );
			this.tweenTeleportFadeOut = null;
		}
		if (this.tweenTeleportFadeIn)
		{
			TWEEN.remove( this.tweenTeleportFadeIn );
			this.tweenTeleportFadeIn = null;
		}

		// Direction
		this.cameraPositionTeleport = this.getThumbPosition(panel, position);
		var d = Math.dist(this.cameraPositionTeleport.x,this.cameraPositionTeleport.y,this.cameraPosition.x,this.cameraPosition.y);

		// console.log("teleport, distance="+d.toFixed(1));
		// console.log("teleport, distance rel to grid width="+parseInt(d/this.imgWidth));


		// Too far ?
		if (d >= 2*this.imgWidth)
		{
			this.cameraDeltaTeleport = {
				x: (this.cameraPositionTeleport.x - this.cameraPosition.x) / d,
				y: (this.cameraPositionTeleport.y - this.cameraPosition.y) / d
			}

			this.cameraPositionTarget.x = this.cameraPosition.x + 500.0 * this.cameraDeltaTeleport.x;
			this.cameraPositionTarget.y = this.cameraPosition.y + 500.0 * this.cameraDeltaTeleport.y;

			this.mask(true);

			this.tweenTeleportFadeOut = new TWEEN.Tween(this).to({}, 500).onComplete( this.onTweenTeleportFadeOutComplete.bind(this) )
//			this.tweenTeleportFadeIn = new TWEEN.Tween(this).to({}, 500);
//			this.tweenTeleportFadeOut.chain(this.tweenTeleportFadeIn);
			
			this.tweenTeleportFadeOut.start();
		
		}
		else
		{
			this.gotoPanelWithPosition(panel,position);
		}
	}

	//--------------------------------------------------------
	this.onTweenTeleportFadeOutComplete = function()
	{
		this.bTeleport = true; // overrides bGotoThumb
		this.overlayImageCache.setPosition( this.cameraPositionTeleport.x, this.cameraPositionTeleport.y   );
		this.mask(false);

		this.cameraPosition.x = this.cameraPositionTeleport.x - 500.0 * this.cameraDeltaTeleport.x;
		this.cameraPosition.y = this.cameraPositionTeleport.y - 500.0 * this.cameraDeltaTeleport.y;

		this.cameraPositionTarget.x = this.cameraPositionTeleport.x;
		this.cameraPositionTarget.y = this.cameraPositionTeleport.y;

	}

	//--------------------------------------------------------
	this.gotoThumb = function(panel, position)
	{
		this.cameraPositionTarget = this.getThumbPosition(panel, position);
		this.overlayImageCache.setPosition( this.cameraPositionTarget.x, this.cameraPositionTarget.y   );
		this.showOverlayImage(false);
		this.bGotoThumb = true;
	}


	//--------------------------------------------------------
	this.setCameraPosition = function(pos)
	{
		this.cameraPosition.x = this.cameraPositionTarget.x = pos.x;
		this.cameraPosition.y = this.cameraPositionTarget.y = pos.y;
	}

	//--------------------------------------------------------
	this.setCameraPositionNorm = function(posNorm, offsetNorm)
	{
		this.cameraPosition.x = this.cameraPositionTarget.x = posNorm.x * this.gridWidth;
		this.cameraPosition.y = this.cameraPositionTarget.y = posNorm.y * this.gridHeight;

		if (offsetNorm)
		{
			this.cameraPosition.x += offsetNorm.x * this.gridWidth;
			this.cameraPosition.y += offsetNorm.y * this.gridHeight;
		}

	}

	//--------------------------------------------------------
	this.setPositionOverlayImageClicked = function()
	{
		this.setPositionOverlayImage( this.panelClicked, this.panelPositionClicked );
	}

	//--------------------------------------------------------
	this.setPositionOverlayImage = function(panel, position)
	{
		var thumbPosition = this.getThumbPosition(panel, position);
		this.overlayImageCache.setPosition(thumbPosition.x, thumbPosition.y);
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
		//this.timer.reset();
		
	 
	 	// Mouse move
		this.container.mousemove(function(event)
		{
			event.stopPropagation();
		
			pThis.mouseX = event.pageX;
			pThis.mouseY = event.pageY;

			if (pThis.bMouseDragEnable == false)
				return;

			var bMouseDragPrevious = pThis.bMouseDrag;


			if (!pThis.bMouseDrag && ( pThis.bMouseDown && Math.dist(pThis.mouseX,pThis.mouseY,pThis.mouseDownX,pThis.mouseDownY) >= pThis.thMouseDragStart ))
			{
				pThis.bMouseDrag = true;
				pThis.cameraPositionOffset = {x:0, y:0};
				pThis.cameraPositionStart = {x:pThis.cameraPosition.x, y:pThis.cameraPosition.y}
				pThis.cameraSpeedFactor = pThis.cameraSpeedFactorDrag;
			}

			// detect mouse drag start
			if (bMouseDragPrevious != pThis.bMouseDrag)
			{
				if (typeof pThis.cbMouseDragStart === "function")
					pThis.cbMouseDragStart();
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
		});

	 	// Mouse up
		this.container.mouseup(function(event)
		{
			event.stopPropagation();
		
		
			if (pThis.bMouseDragEnable)
			{
				if (pThis.bMouseDrag)
				{
					pThis.mousedragEnd();
					if (typeof pThis.cbMouseDragEnd === "function")
						pThis.cbMouseDragEnd();

				}
			}
			
			if (pThis.bMouseDrag == false)
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
			
				pThis.gotoThumb(0, thumbOffset);
				
				// console.log("gotoThumb("+thumbOffset+")");
			}
		});
	 

		// Scene, Camera & stuff
		this.scene = new THREE.Scene();
//		this.scene.background = new THREE.Color( 0x222222 );
		this.scene.background = new THREE.Color( 0x000000 );


		var width = this.container.width();
		var height = this.container.height();


		this.camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );

		this.cameraPerspective = new THREE.PerspectiveCamera( 50, width / height, 1, 10000);
		this.cameraPerspective.position.z = 5000;

		this.cameraCurrent = this.camera;

		// Camera initial position
		var cameraPositionInit = rqcv.configuration.pupitre.gridview.camera.position;
		
		this.cameraPosition.x = this.cameraPositionTarget.x = cameraPositionInit.x * this.gridWidth;
		this.cameraPosition.y = this.cameraPositionTarget.y = cameraPositionInit.y * this.gridHeight;



		this.scene.add( this.camera );
		//this.scene.add( new THREE.AxisHelper( 50 ) );

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


		if (this.bCameraDrawPosition)
		{
			this.cameraPosMesh = new THREE.Mesh
			(
				new THREE.PlaneGeometry(20,20,1,1),
				new THREE.MeshBasicMaterial({color:0xFF0000 , transparent :true, wireframe:false, opacity : 0.5})
		  	);
			this.scene.add( this.cameraPosMesh );
		}

		this.overlayImageCache = new gridViewMeshImageCache( this.scene, width, height,  this.thumbSize, this.thumbSize);



		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( width, height );
		this.renderer.context.disable(this.renderer.context.DEPTH_TEST);

		this.container.append( this.renderer.domElement );
	 
		this.createGridImagesCache();

		// this.animate();
	}

	//--------------------------------------------------------
	this.createGridImagesCache = function()
	{
		var i,j;
		var id = 0;
		var gridImagesCacheObj;
		var bUseLowRes = rqcv.configuration.pupitre.gridview.useImagesLowRes;
		var pThis = this;
		for (j=0;j<this.imgNbRows;j++)
		{
			for (i=0;i<this.imgNbColumns;i++)
			{
				gridImagesCacheObj = new gridImagesCache(id,i*this.imgWidth,j*this.imgHeight, this.imgWidth, this.imgHeight, this.imgSub, bUseLowRes);
				gridImagesCacheObj.setFolderImages(this.imgFolder, this.imgFolderLowRes)
				gridImagesCacheObj.create(pThis.scene)

				this.gridImagesList[id++] = gridImagesCacheObj;
			}
		}
	}

	//--------------------------------------------------------
	this.animate = function()
	{
//		this.render();
//		window.requestAnimationFrame( this.animate.bind(this) );
	}

	//--------------------------------------------------------
	this.limitCameraPosition = function()
	{
		if (this.bMouseDrag) return;
	
		if (this.cameraPosition.x <= this.container.width() / 2)
		{
			this.cameraPositionTarget.x = this.container.width() / 2;
			this.cameraSpeedFactor = this.cameraSpeedFactorDrag ;
		}
		else if (this.cameraPosition.x >= this.gridWidth - this.container.width() / 2)
		{
			this.cameraPositionTarget.x = this.gridWidth - this.container.width() / 2;
			this.cameraSpeedFactor = this.cameraSpeedFactorDrag;
		}

		if (this.cameraPosition.y <= this.container.height() / 2)
		{
			this.cameraPositionTarget.y = this.container.height() / 2;
			this.cameraSpeedFactor = this.cameraSpeedFactorDrag / 2;
		}
		else if (this.cameraPosition.y >= this.gridHeight - this.container.height() / 2)
		{
			this.cameraPositionTarget.y = this.gridHeight - this.container.height() / 2;
			this.cameraSpeedFactor = this.cameraSpeedFactorDrag / 2;
		}
	}

	//--------------------------------------------------------
	this.render = function()
	{
		this.renderer.render( this.scene, this.cameraCurrent );
	}
	
	//--------------------------------------------------------
	this.update = function(dt)
	{
		// Timer
		// var dt = this.timer.update();
	
		// Update camera position
		this.cameraPosition.x += (this.cameraPositionTarget.x - this.cameraPosition.x) * this.cameraSpeedFactor;
		this.cameraPosition.y += (this.cameraPositionTarget.y - this.cameraPosition.y) * this.cameraSpeedFactor;
		this.limitCameraPosition();
		
		this.cameraPositionNormalized.x = this.cameraPosition.x / this.gridWidth;
		this.cameraPositionNormalized.y = this.cameraPosition.y / this.gridHeight;

		this.camera.position.set(this.cameraPosition.x,this.cameraPosition.y,10);
		this.cameraMesh.position.set( this.camera.position.x, this.camera.position.y, 10 );
		this.cameraPerspective.position.set(this.camera.position.x, this.camera.position.y, 4500);
		
		if (this.bCameraDrawPosition)
			this.cameraPosMesh.position.set( this.camera.position.x, this.camera.position.y, 5 );
		
		// Compute speed
		this.cameraSpeed = Math.dist(this.cameraPosition.x,this.cameraPosition.y,this.cameraPositionPrev.x,this.cameraPositionPrev.y);
		this.cameraSpeed /= dt;

		this.cameraPositionPrev.x = this.cameraPosition.x;
		this.cameraPositionPrev.y = this.cameraPosition.y;

		
		// Overlay (Mask)
		this.overlayOpacity += (this.overlayOpacityTarget - this.overlayOpacity) * 0.3;

		this.overlayMesh.position.set( this.cameraPosition.x,  this.cameraPosition.y, 5);
		this.overlayMesh.material.opacity = this.overlayOpacity;

		// Overlay (Thumb)
		this.overlayImageCache.update(dt);
		if (this.bGotoThumb || this.bTeleport)
		{
			if (
				(Math.abs( this.cameraPositionTarget.x - this.cameraPosition.x ) < 1.0 &&
				Math.abs( this.cameraPositionTarget.y - this.cameraPosition.y ) < 1.0) || this.bTeleport
				)
				{
					this.bTeleport = false;
					this.bGotoThumb = false;
					this.showOverlayImage(true);
				}
		}
		
		
		// Image + thumb where camera is over
		this.imgCam 		= null;
		this.imgIndex 		= -1;
		this.imgI			= parseInt(this.cameraPositionNormalized.x * this.imgNbColumns);
		this.imgJ			= parseInt(this.cameraPositionNormalized.y * this.imgNbRows);
		this.thumbI			= -1;
		this.thumbJ			= -1;
		this.panelOver		= -1;
		this.positionOver	= -1;

	 	if (this.imgI>=0 && this.imgI <= (this.imgNbColumns-1) && this.imgJ>=0 && this.imgJ <= (this.imgNbRows-1))
		{
			this.imgIndex 	= this.imgI + this.imgNbColumns*this.imgJ;
			this.imgCam 	= this.gridImagesList[this.imgIndex];
		
			this.thumbPos.x = this.cameraPosition.x -  this.imgI * this.imgWidth;
			this.thumbPos.y = this.cameraPosition.y -  this.imgJ * this.imgHeight;

			this.thumbI   		= parseInt(this.thumbPos.x / this.thumbSize);
			this.thumbJ   		= this.nbThumbs - 1 - parseInt(this.thumbPos.y / this.thumbSize);

			this.panelOver		= this.imgIndex;
			this.positionOver	= this.thumbI +  this.nbThumbs * this.thumbJ;
		}
	 

		// upload textures to images
		var g = null;
		var i,j,offset;

		for (j=0;j<this.imgNb;j++)
			this.gridImagesList[j].markUnloadTexture();


		var ii,jj;
		for (j=0;j<this.imgNbRows;j++)
		{
			for (i=0;i<this.imgNbColumns;i++)
			{
				offset = i+this.imgNbColumns*j;
				g = this.gridImagesList[offset];

				if ( this.camera.position.x >= g.x && this.camera.position.x <= (g.x+g.w) && this.camera.position.y >= g.y && this.camera.position.y <= (g.y+g.h))
				{
					for (var ii = i-1; ii <= i+1 ; ii++)
						for (var jj = j-1; jj <= j+1 ; jj++)
						{
							if (ii>=0 && ii<=(this.imgNbColumns-1) && jj>=0 && jj<=(this.imgNbRows-1))
							{
								this.gridImagesList[ ii + this.imgNbColumns*jj ].markLoadTexture();
							}
						}
				}

			}
		}


		for (j=0;j<this.imgNb;j++)
			this.gridImagesList[j].update(dt);

	}
}

var gridview = new gridview();
