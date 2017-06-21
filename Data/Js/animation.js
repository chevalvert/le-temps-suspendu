//--------------------------------------------------------
function animation(){}

animation.prototype.fs = require("fs");
animation.prototype.id = "__animation__";
animation.prototype.pathConfigs = __dirname + "/Data/Configs/";

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

//--------------------------------------------------------
animation.prototype.resetLedValues = function()
{
	for (var i=0; i<18*12; i++)
		this.ledValues[i] = 0.0;
}


//--------------------------------------------------------
animation.prototype.readPropertiesFile = function()
{
	var p = this.getPathFileProperties();
	if (this.fs.existsSync(p))
	{
		this.properties = JSON.parse( this.fs.readFileSync(this.getPathFileProperties()).toString() );
		console.log( this.properties )
	}
	else
	{
		console.log("cannot find \""+p+"\"");
	}
}

//--------------------------------------------------------
animation.prototype.loadProperties = function()
{
}

//--------------------------------------------------------
animation.prototype.saveProperties = function()
{
	this.fs.writeFile(this.getPathFileProperties(), JSON.stringify( this.properties ), function (err)
	{
	});
}

//--------------------------------------------------------
animation.prototype.getPathFileProperties = function()
{
	return this.pathConfigs+"animation_"+this.id+".json";
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

	this.createMaterial();

	this.quadRTT = new THREE.Mesh( planeRTT, this.materialRTT );
	this.sceneRTT.add( this.cameraRTT );
	this.sceneRTT.add( this.quadRTT );

	this.createControls();
}

//--------------------------------------------------------
animation.prototype.render = function(renderer_)
{
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
animation.prototype.render = function(renderer_)
{
}
