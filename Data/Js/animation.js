//--------------------------------------------------------
function animation(){}

animation.prototype.fs = require("fs");
animation.prototype.id = "__animation__";
animation.prototype.type = "ceil";
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
animation.prototype.readValues = null;
animation.prototype.ipcLedsKey = "animation-leds";
animation.prototype.propertiesAnimName = "#properties-animation";


animation.prototype.nbColumns 	= 18;
animation.prototype.nbRows 		= 12;

animation.prototype.timer = null;

animation.prototype.properties = {}


//--------------------------------------------------------
animation.prototype.reset 	= function(){} // called just once when animation is set
animation.prototype.setData = function(data){} // called just once when animation is set
animation.prototype.setCamPosNormalized = function(posNorm){} // called during render
animation.prototype.onThumbClicked = function(posNorm){}
animation.prototype.triggerForPhoto = function(){} // called when recherche is OK and photo show
animation.prototype.showPulse = function(){} // called when recherche is OK and pulse must be shown

//--------------------------------------------------------
animation.prototype.resetLedValues = function()
{
	for (var i=0; i<this.nbColumns * this.nbRows; i++)
		this.ledValues[i] = 0.0;
}

//--------------------------------------------------------
animation.prototype.readPropertiesFile = function()
{
	var p = this.getPathFileProperties();
	if (this.fs.existsSync(p))
	{
		this.properties = JSON.parse( this.fs.readFileSync(p).toString() );
		// console.log( this.properties )
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
	
	$(this.propertiesAnimName).append( this.gui.domElement );
	this.gui.domElement.style.display = "none";
}

//--------------------------------------------------------
animation.prototype.setup = function(options)
{
	if (this.type == "floor")
	{
		this.ipcLedsKey 		= "animation-floor-leds";
		this.propertiesAnimName = "#properties-animationGround";

		this.nbColumns = 7;
		this.nbRows = 12; // TODO add + 1 because of the entrace led
	}

	this.readValues = new Array(this.nbColumns*this.nbRows);

	this.timer = new timer();
	this.timer.reset();

	// TODO : adjust this to ratio nbColumns / nbRows ?
	var containerId = this.type == "ceil" ? "#animation" : "#animationGround";

	this.container = $(containerId);
	var w = this.container.width();
	var h = this.container.height();

	var ratio = w/h;
	if (this.type == "floor")
	{
		this.wRTT = parseInt(options.floor.wRTT); // mandatory
	}
	else
	{
		this.wRTT = parseInt(options.ceil.wRTT); // mandatory
	}
	this.hRTT = parseInt(this.wRTT / ratio);
	this.read = new Float32Array( 4 * this.wRTT * this.hRTT  );
	
	
	this.resetLedValues();
	this.loadProperties();

	// Offscreen rendering
	var planeRTT = new THREE.PlaneBufferGeometry( this.wRTT, this.hRTT );

	this.sceneRTT = new THREE.Scene();
	this.cameraRTT = new THREE.OrthographicCamera( this.wRTT / - 2, this.wRTT / 2, this.hRTT / 2, this.hRTT / - 2, - 1000, 1000 );
	this.rendererRTT = new THREE.WebGLRenderTarget( this.wRTT, this.hRTT, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat, type: THREE.FloatType } );

	this.createMaterial();

	this.quadRTT = new THREE.Mesh( planeRTT, this.materialRTT );
	this.sceneRTT.add( this.cameraRTT );
	this.sceneRTT.add( this.quadRTT );

	this.createControls();
}

//--------------------------------------------------------
animation.prototype.sampleAndSendValues = function(renderer_)
{
	var i,j,offset;
	var x = 0;
	var y = 0;
	var stepx = this.wRTT / this.nbColumns;
	var stepy = this.hRTT / this.nbRows;

	//  origin @ lower left corner
	// https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/glReadPixels.xhtml
	renderer_.readRenderTargetPixels( this.rendererRTT, 0, 0, this.wRTT, this.hRTT, this.read );
	
	for (j=0;j<this.nbRows;j++)
	{
		for (i=0;i<this.nbColumns;i++)
		{
			offset = i + this.nbColumns * j;
			this.readValues[offset] = this.read[4*(parseInt(stepx*i) + this.wRTT * parseInt(stepy*j))];
		
			if (this.readValues[offset] < 0) this.readValues[offset] = 0; // TODO : why negative values ?
		}
	}

	// Send the values !
	// ceil : this.ipcLedsKey = "animation-leds"
	// floor : this.ipcLedsKey = "animation-floor-leds"
	this.ipcRenderer.send(this.ipcLedsKey, this.readValues);
 
	// Set in the tool3D
	if (rqcv.isTool3DEnabled())
	{
	  if (this.type == "ceil")
	  {
		  tool3D.setLedCeilValues(this.readValues);
	  }
	  else
	  if (this.type == "floor")
	  {
		  tool3D.setLedFloorValues(this.readValues);
	  }
	}
}


//--------------------------------------------------------
animation.prototype.renderOffscreen = function(renderer_)
{
	renderer_.render( this.sceneRTT, this.cameraRTT, this.rendererRTT, true );
}
