//--------------------------------------------------------
function animation(){}

//--------------------------------------------------------
animation.prototype.fs = require("fs");
animation.prototype.pathShaders = __dirname + "/Data/Shaders/";


animation.prototype.container = null;

animation.prototype.sceneRTT = null;
animation.prototype.cameraRTT = null;
animation.prototype.quadRTT = null;
animation.prototype.materialRTT = null;
animation.prototype.rendererRTT = null;
animation.prototype.wRTT = 0;
animation.prototype.hRTT = 0;

animation.prototype.scene = null;
animation.prototype.camera = null;
animation.prototype.quad = null;
animation.prototype.material = null;
animation.prototype.renderer = null;

animation.prototype.ipcRenderer = require('electron').ipcRenderer;
animation.prototype.ledValues = [];
animation.prototype.read = null;//new Float32Array( 4 * 120 * 180 );
animation.prototype.readValues = [];

animation.prototype.fragmentShaderId = "plasma"; // TEMP

animation.prototype.bExit = false;

animation.prototype.requestFrameId = 0;
//--------------------------------------------------------
animation.prototype.setup = function(options)
{
	this.container = $("#animation");
	var w = this.container.width();
	var h = this.container.height();

	var ratio = w/h;
	this.wRTT = parseInt(options.wRTT); // mandatory
	this.hRTT = parseInt(this.wRTT / ratio);
	this.read = new Float32Array( 4 * this.wRTT * this.hRTT  );
	
	this.fragmentShaderId = options.fragmentShaderId || "plasma";
	
	this.timer = new timer();

	for (var i=0; i<18*12; i++)
	{
		this.ledValues[i] = 0.0;
	}


	// Offscreen rendering
	var planeRTT = new THREE.PlaneBufferGeometry( this.wRTT, this.hRTT );

	this.sceneRTT = new THREE.Scene();
	this.cameraRTT = new THREE.OrthographicCamera( this.wRTT / - 2, this.wRTT / 2, this.hRTT / 2, this.hRTT / - 2, - 1000, 1000 );
	this.rendererRTT = new THREE.WebGLRenderTarget( this.wRTT, this.hRTT, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat, type: THREE.FloatType } );
	this.materialRTT = new THREE.ShaderMaterial(
	{
		uniforms: {
					time: { value: 0.0 },
					w: { value: this.wRTT },
					h: { value: this.hRTT },
					freqSin : { value : 8.0}
				   },
		vertexShader: document.getElementById( "vertexShader" ).textContent, // TEMP
		fragmentShader: document.getElementById( this.fragmentShaderId ).textContent // TEMP
	});
	this.quadRTT = new THREE.Mesh( planeRTT, this.materialRTT );

	this.sceneRTT.add( this.cameraRTT );
	this.sceneRTT.add( this.quadRTT );


	// screen rendering (preview)
	var plane = new THREE.PlaneBufferGeometry( w, h );

	this.scene = new THREE.Scene();
	this.camera = new THREE.OrthographicCamera( w / - 2, w / 2, h / 2, h / - 2, - 1000, 1000 );
	this.material = new THREE.MeshBasicMaterial(
	   {map:this.rendererRTT.texture, depthWrite: false}
	);
	this.quad = new THREE.Mesh( plane, this.material );
	this.scene.add( this.camera );
	this.scene.add( this.quad );
	
	this.renderer = new THREE.WebGLRenderer();
	this.renderer.setPixelRatio( window.devicePixelRatio );
	this.renderer.setSize( w, h );
	this.renderer.autoClear = true;
}

//--------------------------------------------------------
animation.prototype.enter = function()
{
	this.container[0].appendChild( this.renderer.domElement );
	this.requestFrameId = window.requestAnimationFrame(this.render.bind(this));
	this.bExit = false;
}


//--------------------------------------------------------
animation.prototype.exit = function()
{
	window.cancelAnimationFrame(this.requestFrameId);
//	this.container[0].removeChild( this.renderer.domElement );
	this.renderer.domElement.style.display = "none";
	this.bExit = true;
}

//--------------------------------------------------------
animation.prototype.sampleAndSendValues = function()
{
	var i,j,offset;
	var x = 0;
	var y = 0;
	var stepx = this.wRTT / 17.0;
	var stepy = this.hRTT / 11.0;

	this.renderer.readRenderTargetPixels( this.rendererRTT, 0, 0, this.wRTT, this.hRTT, this.read );

	
	for (j=0;j<12;j++)
	{
		for (i=0;i<18;i++)
		{
			offset = i+18*j;
			this.readValues[offset] = 255.0*this.read[4*(parseInt(stepx*i) + this.wRTT * parseInt(stepy*j))];
		}
	}

	// Send the values !
	this.ipcRenderer.send("animation-leds", this.readValues);
}

//--------------------------------------------------------
animation.prototype.render = function()
{
	this.timer.update();
	var time = this.timer.time;

	this.materialRTT.uniforms.time.value = time;
 
	this.renderer.render( this.sceneRTT, this.cameraRTT, this.rendererRTT, true );
	this.renderer.render( this.scene, this.camera );

	this.sampleAndSendValues();

	if (this.bExit == false)
		window.requestAnimationFrame(this.render.bind(this));
	else
	{
		this.bExit == false;
	}
}
