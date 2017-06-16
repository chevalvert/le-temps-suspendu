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
animation.prototype.wRTT = 120;
animation.prototype.hRTT = 0;

animation.prototype.ipcRenderer = require('electron').ipcRenderer;
animation.prototype.ledValues = [];
animation.prototype.read = null;
animation.prototype.readValues = [];

animation.prototype.timer = new timer();

animation.prototype.properties = {}
animation.prototype.fragmentShaderName = "";

//--------------------------------------------------------
animation.prototype.resetLedValues = function()
{
	for (var i=0; i<18*12; i++)
		this.ledValues[i] = 0.0;
}

//--------------------------------------------------------
animation.prototype.loadProperties = function()
{
}

//--------------------------------------------------------
animation.prototype.saveProperties = function()
{
}

//--------------------------------------------------------
animation.prototype.showControls = function(is)
{
	this.gui.domElement.style.display = is ? "block" : "none";
}


//--------------------------------------------------------
animation.prototype.createControls = function()
{
	this.gui = new dat.GUI({ autoPlace: false , width : 300});
	this.addControls();
	$("#properties-animation").append( this.gui.domElement );
	this.gui.domElement.style.display = "none";
}

//--------------------------------------------------------
animation.prototype.setup = function(options)
{
	this.container = $("#animation");
	var w = this.container.width();
	var h = this.container.height();

	var ratio = w/h;
	this.wRTT = this.wRTT > 0 ? this.wRTT : parseInt(options.wRTT); // mandatory
	this.hRTT = parseInt(this.wRTT / ratio);
	this.read = new Float32Array( 4 * this.wRTT * this.hRTT  );
	
	this.timer.reset();
	this.resetLedValues();
	this.loadProperties();

	// Offscreen rendering
	var planeRTT = new THREE.PlaneBufferGeometry( this.wRTT, this.hRTT );

	this.sceneRTT = new THREE.Scene();
	this.cameraRTT = new THREE.OrthographicCamera( this.wRTT / - 2, this.wRTT / 2, this.hRTT / 2, this.hRTT / - 2, - 1000, 1000 );
	this.rendererRTT = new THREE.WebGLRenderTarget( this.wRTT, this.hRTT, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat, type: THREE.FloatType } );
	this.materialRTT = new THREE.ShaderMaterial(
	{
		uniforms: this.getUniforms(),
		vertexShader: this.getShaderString("basic.vert"),
		fragmentShader: this.getShaderString(this.fragmentShaderName)
	});
	this.quadRTT = new THREE.Mesh( planeRTT, this.materialRTT );

	this.sceneRTT.add( this.cameraRTT );
	this.sceneRTT.add( this.quadRTT );
	
	this.createControls();
}

//--------------------------------------------------------
animation.prototype.getShaderString = function(name)
{
	return this.fs.readFileSync(this.pathShaders+name).toString();
}

//--------------------------------------------------------
animation.prototype.getUniforms = function()
{
	return {};
}

//--------------------------------------------------------
animation.prototype.sampleAndSendValues = function(renderer_)
{
	var i,j,offset;
	var x = 0;
	var y = 0;
	var stepx = this.wRTT / 17.0;
	var stepy = this.hRTT / 11.0;

	renderer_.readRenderTargetPixels( this.rendererRTT, 0, 0, this.wRTT, this.hRTT, this.read );
	
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
animation.prototype.setUniforms = function()
{
//	this.materialRTT.uniforms.time.value = this.timer.time;
//	this.materialRTT.uniforms.freqSin.value = this.properties.freqSin;
}

//--------------------------------------------------------
animation.prototype.render = function(renderer_)
{
	this.timer.update();
	this.setUniforms();
	renderer_.render( this.sceneRTT, this.cameraRTT, this.rendererRTT, true );
	this.sampleAndSendValues(renderer_);
}
