function tool3D()
{

	// --------------------------------------------
	this.id = "tool3D";

	this.camera = null;
	this.scene = null;
	this.objPoudriere = null;

	this.container = null;
	this.renderer = null;

	this.mouseX = 0;
	this.mouseY = 0;

  	this.objModelNames = ["Data/3D/poudriere-structure.obj", "Data/3D/poudriere-leds.obj"];

	this.objLeds 		= new Array(18*12);
	this.objLedsFloor 	= new Array(18*12);


	// --------------------------------------------
	// Timing
	this.timer = new timer();

	// --------------------------------------------
	// Controls
	this.controls = null;
	this.moveForward = false;
	this.moveBackward = false;
	this.moveLeft = false;
	this.moveRight = false;
	this.velocity = new THREE.Vector3();

	// --------------------------------------------
	this.init = function(containerId)
	{
		this.container = $(containerId);

		this.camera = new THREE.PerspectiveCamera( 45, this.container.width()/ this.container.height(), 1, 2000 );


		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color( 0x222222 );
		this.scene.add( new THREE.AxisHelper( 2 ) );

		var gridHelper = new THREE.GridHelper( 30, 40,0x444444,0x444444 );
		this.scene.add( gridHelper );


		// https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_pointerlock.html
//		this.controls = new THREE.PointerLockControls( this.camera );
//		this.scene.add( this.controls.getObject() );

		var onKeyDown = function ( event )
		{
			switch ( event.keyCode ) {
				case 38: // up
				case 87: // w
					this.moveForward = true;
					break;
				case 37: // left
				case 65: // a
					this.moveLeft = true;
					break;
				case 40: // down
				case 83: // s
					this.moveBackward = true;
					break;
				case 39: // right
				case 68: // d
					this.moveRight = true;
					break;
			}
			
//			console.log(this.moveForward);
		};
		var onKeyUp = function ( event )
		{
			switch( event.keyCode ) {
				case 38: // up
				case 87: // w
					this.moveForward = false;
					break;
				case 37: // left
				case 65: // a
					this.moveLeft = false;
					break;
				case 40: // down
				case 83: // s
					this.moveBackward = false;
					break;
				case 39: // right
				case 68: // d
					this.moveRight = false;
					break;
			}
		};
//		document.addEventListener( 'keydown', onKeyDown.bind(this), false );
//		document.addEventListener( 'keyup', onKeyUp.bind(this), false );


		var manager = new THREE.LoadingManager();
		manager.onProgress = function ( item, loaded, total )
		{
			console.log( item, loaded, total );
		};

		var onProgress = function ( xhr )
		{
			if ( xhr.lengthComputable )
			{
				var percentComplete = xhr.loaded / xhr.total * 100;
				console.log( Math.round(percentComplete, 2) + '% downloaded' );
			}
		};

		var onError = function ( xhr )
		{
		};

		var loader = new THREE.OBJLoader( manager );

      	loader.load( this.objModelNames[1], this.onLedsLoaded.bind(this), this.onProgress, this.onError);
      	loader.load( this.objModelNames[0], this.onArchitectureLoaded.bind(this), this.onProgress, this.onError);

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( this.container.width(), this.container.height() );

		this.container.append( this.renderer.domElement );


		this.container.mousemove(function(event)
		{
			tool3D.mouseX = event.pageX;
			tool3D.mouseY = event.pageY;
		});

	}

	// --------------------------------------------
	this.resize = function()
	{
		if (this.container)
		{
			this.camera.aspect = this.container.width() / this.container.height();
			this.camera.updateProjectionMatrix();
			this.renderer.setSize( this.container.width(), this.container.height() );
		}
	}

	// --------------------------------------------
	this.animate = function()
	{
		this.render();

		window.requestAnimationFrame( this.animate.bind(this) );
	}
	
	// --------------------------------------------
	this.render = function()
	{

		this.camera.position.x = 10-0.5*(this.mouseY-this.container.height())*0.1;
		this.camera.position.y = 8;
		this.camera.position.z = 12;

		this.camera.lookAt( new THREE.Vector3(7,0,2.0) );

/*					var delta = this.timer.update();
					this.velocity.x -= this.velocity.x * 10.0 * delta;
					this.velocity.z -= this.velocity.z * 10.0 * delta;
//					this.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
					this.velocity.y = 0
					if ( this.moveForward ) 	this.velocity.z -= 400.0 * delta;
					if ( this.moveBackward ) 	this.velocity.z += 400.0 * delta;
					if ( this.moveLeft ) 		this.velocity.x -= 400.0 * delta;
					if ( this.moveRight ) 		this.velocity.x += 400.0 * delta;

					this.controls.getObject().translateX( this.velocity.x * delta );
					this.controls.getObject().translateY( this.velocity.y * delta );
					this.controls.getObject().translateZ( this.velocity.z * delta );
/*					if ( this.controls.getObject().position.y < 10 )
					{
						this.velocity.y = 0;
						this.controls.getObject().position.y = 10;
					}
					prevTime = time;
*/


		this.renderer.render( this.scene, this.camera );
	}

	// --------------------------------------------
	this.onLedsLoaded = function( object )
	{
		var pThis = this;
		var index = 0;

		object.rotation.x = THREE.Math.degToRad( -90 ) ;
		var boxHelper = new THREE.BoxHelper( object );
//		this.scene.add( boxHelper );

		//console.log( boxHelper.getSize() );



		var box3 = new THREE.Box3();
		box3.setFromObject( boxHelper );
		// console.log( box3.min );

		object.traverse(function(obj)
		{
			var type = obj.name.substring(0,1);
			var id = parseInt(obj.name.substring(1));

			// Ceil
			if (type == "C")
			{
				obj.material = new THREE.MeshBasicMaterial({color: new THREE.Color(0,0,0)});
				obj.rotation.x = THREE.Math.degToRad( -90 ) ;
				// obj.position.y = -box3.min.y ;
				pThis.objLeds[id] = obj ;
			}
			else if (type == "F")
			{
				obj.material = new THREE.MeshBasicMaterial({color: new THREE.Color(0,0,0)});
				obj.rotation.x = THREE.Math.degToRad( -90 ) ;
				// obj.position.y = -box3.min.y ;
				pThis.objLedsFloor[id] = obj ;
			}
		
		});
		
		
		for (var i=0; i<this.objLeds.length; i++)
		{
			if (this.objLeds[i]) // for the two missing bars
				this.scene.add( this.objLeds[i] );
		}

		for (var i=0; i<this.objLedsFloor.length; i++)
		{
			if (this.objLedsFloor[i])
				this.scene.add( this.objLedsFloor[i] );
		}


		this.animate();
	}
	
	// --------------------------------------------
	this.onArchitectureLoaded = function( object )
	{
		object.rotation.x = THREE.Math.degToRad( -90 );
		//this.scene.add( object );

		var mat = new THREE.MeshBasicMaterial( { color: 0xFF0000, wireframe : false } );
		object.material = mat;

//		this.scene.add(object);
	}


	// --------------------------------------------
	this.setLedValues = function(values)
	{
		var v = 0.0;
		for (var i=0; i<this.objLeds.length; i++)
		{
			if (this.objLeds[i]) // for the two missing bars
			{
				v = values[i] / 255.0;
				this.objLeds[i].material.color.setRGB(v,v,v);
			}
		}
	}

}

tool3D.prototype = Object.create(tool.prototype);
var tool3D 	= new tool3D();
