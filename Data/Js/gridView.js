function gridview()
{
	//--------------------------------------------------------
	this.mouseX=0, this.mouseY=0;
	this.mouseDownX=0, this.mouseDownY=0;
	this.mouseDragX=0,this.mouseDragY=0;
	this.bMouseDown = false;
	this.bMouseDrag = false;

	this.cameraPosition = {x:0,y:0};
	this.cameraPositionStart = {x:0,y:0};
	this.cameraPositionOffset = {x:0,y:0};
	this.cameraPositionTarget = {x:0,y:0};

	//--------------------------------------------------------
	// 3D / 2D scene
	this.camera = null;
	this.scene = null;

	this.container = null;
	this.renderer = null;
	
	// Images container
	this.gridImagesList = [];

	var pThis = this;

	//--------------------------------------------------------
	this.mousedrag = function()
	{
		this.mouseDragX = this.mouseX - this.mouseDownX;
		this.mouseDragY = this.mouseY - this.mouseDownY;

		this.cameraPositionOffset.x = -this.mouseDragX;
		this.cameraPositionOffset.y = this.mouseDragY;

		this.cameraPositionTarget.x = this.cameraPositionStart.x+this.cameraPositionOffset.x;
		this.cameraPositionTarget.y = this.cameraPositionStart.y+this.cameraPositionOffset.y;
	}


	//--------------------------------------------------------
	this.mousedragEnd = function()
	{
//		this.cameraPosition.x += this.cameraPositionOffset.x;
//		this.cameraPosition.y += this.cameraPositionOffset.y;
	}


	//--------------------------------------------------------
	this.init = function(containerId)
	{
		var pThis = this;
	
		this.container = $(containerId);
	 
		this.container.mousemove(function(event){
			pThis.mouseX = event.pageX;
			pThis.mouseY = event.pageY;
			if (!pThis.bMouseDrag && ( pThis.bMouseDown && Math.dist(pThis.mouseX,pThis.mouseY,pThis.mouseDownX,pThis.mouseDownY) >= 3 ))
			{
				pThis.bMouseDrag = true;
				pThis.cameraPositionOffset = {x:0, y:0};
				pThis.cameraPositionStart = {x:pThis.cameraPosition.x, y:pThis.cameraPosition.y}
			}
			if (pThis.bMouseDrag)
			{
				pThis.mousedrag();
			}
		});

		this.container.mousedown(function(event){
			pThis.mouseDownX = event.pageX;
			pThis.mouseDownY = event.pageY;
			pThis.bMouseDown = true;
		});

		this.container.mouseup(function(event){
			if (pThis.bMouseDrag)
				pThis.mousedragEnd();


			pThis.bMouseDown = false;
			pThis.bMouseDrag = false;
			pThis.mouseDragX = 0;
			pThis.mouseDragY = 0;
			
		});
	 
	
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color( 0x222222 );


		var width = this.container.width();
		var height = this.container.height();

		this.camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );

//		this.camera = new THREE.PerspectiveCamera( 50, width / height, 1, 2000 );
		this.camera.position.z = 1;

		this.scene.add( this.camera );


		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( width, height );

		this.container.append( this.renderer.domElement );
		
	 
		this.createGridImages(0,128,128);

		this.animate();
	}
	//--------------------------------------------------------
	this.createGridImages = function(index,w,h)
	{
		var gridImagesObj = new gridImages(w,h);
		var x = 0;
		var y = 0;
		var pThis = this;
		gridImagesObj.loadFromDb(rqcv.connection, "SELECT filename FROM `figure` LIMIT "+(index*64)+",64", function()
		{
			gridImagesObj.mesh.position.x = index*768;
			gridImagesObj.mesh.position.y = 0;

			pThis.scene.add( gridImagesObj.mesh );
			pThis.gridImagesList.push( gridImagesObj );

			if (index < 5) // TEMP
			{
				pThis.createGridImages(++index,w,h);
			}
		});
		
	
	}

	//--------------------------------------------------------
	this.animate = function()
	{
		window.requestAnimationFrame( gridview.animate );
		gridview.render();
	}
	
	//--------------------------------------------------------
	this.render = function()
	{
		this.cameraPosition.x += (this.cameraPositionTarget.x - this.cameraPosition.x)*0.1;
		this.cameraPosition.y += (this.cameraPositionTarget.y - this.cameraPosition.y)*0.1;
	
		this.camera.position.set(this.cameraPosition.x,this.cameraPosition.y,1);
		this.renderer.render( this.scene, this.camera );

	}
}

var gridview = new gridview();
