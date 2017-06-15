function tool3D()
{
	this.camera = null;
	this.scene = null;
	this.objPoudriere = null;

	this.container = null;
	this.renderer = null;
	
	this.mouseX = 0;
	this.mouseY = 0;
	
	this.objModelName = "Data/3D/poudriere-meters-leds_only.obj";


	this.init = function(containerId)
	{
		this.container = $(containerId);
	
		this.camera = new THREE.PerspectiveCamera( 45, this.container.width()/ this.container.height(), 1, 2000 );
		this.camera.position.z = 25;


		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color( 0x222222 );

		var ambient = new THREE.AmbientLight( 0x101030 );
		this.scene.add( ambient );

		var directionalLight = new THREE.DirectionalLight( 0xffeedd );
		directionalLight.position.set( 0, 0, 1 );
		this.scene.add( directionalLight );

		// https://jsfiddle.net/prisoner849/jp17wjam/
		this.scene.add( new THREE.AxisHelper( 5 ) );

		var manager = new THREE.LoadingManager();
		manager.onProgress = function ( item, loaded, total )
		{
			console.log( item, loaded, total );
		};

		//var texture = new THREE.Texture();

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
		loader.load( this.objModelName, this.onModelLoaded, this.onProgress, this.onError);

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( this.container.width(), this.container.height() );

		this.container.append( this.renderer.domElement );
	
	
		this.container.mousemove(function(event){
			tool3D.mouseX = event.pageX;
			tool3D.mouseY = event.pageY;


		});
	}
	
	this.resize = function()
	{
		if (this.container)
		{
			this.camera.aspect = this.container.width() / this.container.height();
			this.camera.updateProjectionMatrix();
			this.renderer.setSize( this.container.width(), this.container.height() );
		}
	}
	
	this.animate = function()
	{
		window.requestAnimationFrame( tool3D.animate );
		tool3D.render();
	}
	
	this.render = function()
	{
		if (this.objPoudriere)
		{
			this.objPoudriere.position.x = 0;
			this.objPoudriere.position.y = 0;
		
			this.objPoudriere.rotation.z = THREE.Math.degToRad( -90 ) ;
		}

		this.camera.position.x = -0.5*(this.mouseX-this.container.width())*0.1;
//		this.camera.position.y += ( - 0.5*(this.mouseY-this.container.height()) - this.camera.position.y ) * .05;

		this.camera.lookAt( this.scene.position );
		this.renderer.render( this.scene, this.camera );
	}
	
	this.onModelLoaded = function( object )
	{
		tool3D.scene.add( object );
		tool3D.objPoudriere = object;
		
		tool3D.animate();
	}
}

var tool3D 	= new tool3D();
var remote 	= require('electron').remote;
var rqcv 	= remote.getGlobal("rqcv");


