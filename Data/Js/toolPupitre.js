// --------------------------------------------
function toolPupitre()
{
	// --------------------------------------------
	this.id = "toolPupitre";

	// --------------------------------------------
	// DOM
	this.container = null;
	this.guiGlobals = null;
	this.guiAnimationList = null;
	this.guiAnimationGroundList = null;
	this.animView = null;
	this.animGroundView = null;

	// --------------------------------------------
	// Properties
	this.properties.gridTouchDebug = false;
	// this.properties.gridTouchControl = false;
	this.properties.animations = [];
	this.properties.timeline = false;
	this.properties.radiusInfluence = 70;
	this.properties.photoScale = 0.5;

	// --------------------------------------------
	// Animation
	this.animManager = new animationManager();

	// --------------------------------------------
	// Timer
	this.timer = new timer();
	
	// --------------------------------------------
	this.init = function(containerId)
	{
		this.container = $(containerId);

		// Timer
		this.timer.reset();

		// Animations
		this.animManager = new animationManager();
		this.animManager.setup();

		this.properties.animations 			= Object.keys(this.animManager.animations);
		this.properties.animationsGround 	= Object.keys(this.animManager.animationsGround);
	
		// UI
		this.animView = new animationView();
		this.animView.init();

		this.animGroundView = new animationGroundView();
		this.animGroundView.init();

		this.guiGlobals 			= new dat.GUI({ autoPlace: false , width : 300});
		this.guiAnimationList 		= new dat.GUI({ autoPlace: false , width : 300});
		this.guiAnimationGroundList = new dat.GUI({ autoPlace: false , width : 300});
		
		// Properties
		var gridViewFolder = this.guiGlobals.addFolder("Grid view");

  		var chkGridTouchDebug = gridViewFolder.add(this.properties, 'gridTouchDebug', false);
  		var sliderRadiusInfluence = gridViewFolder.add(this.properties, 'radiusInfluence', 60, 100);

  		var listAnimations 			= this.guiAnimationList.add(this.properties, 'animations', 				this.properties.animations);
  		var listAnimationsGround 	= this.guiAnimationGroundList.add(this.properties, 'animationsGround', 	this.properties.animationsGround);


		listAnimations.onChange(function(value)
		{
			toolPupitre.setAnimation(value)
		});

		listAnimationsGround.onChange(function(value)
		{
			toolPupitre.setAnimationGround(value)
		});
		
		chkGridTouchDebug.onChange(function(value)
		{
			toolPupitre.ipcRenderer.send('toolPupitre-gridTouchDebug', value);
		});

		sliderRadiusInfluence.onChange(function(value)
		{
			toolPupitre.ipcRenderer.send('toolPupitre-radiusInfluence', value);
		});
		
		
		
		var photoViewFolder = this.guiGlobals.addFolder("Photo view");
  		var sliderPhotoScale = photoViewFolder.add(this.properties, 'photoScale', 0.1, 1.0);

		sliderPhotoScale.onChange(function(value)
		{
			toolPupitre.ipcRenderer.send('toolPupitre-photoScale', value);
		});
		


		// Apply our own style :)
		this.container.find("#properties-globals").append( this.guiGlobals.domElement );
		this.container.find("#properties-animation-list").append( this.guiAnimationList.domElement );
		this.container.find("#properties-animationGround-list").append( this.guiAnimationGroundList.domElement );


		$(".dg").css( {"font-family" : "Friction-Regular", "font-size" : "13px"} );

		this.setAnimation("timeline");
		this.setAnimationGround("sine_ground");

//	   this.animGroundView.setAnimation( this.animManager.animations["sine_ground"] );

	   window.requestAnimationFrame(this.update.bind(this));
	}
	
	
	// --------------------------------------------
	this.setGridViewCamPos = function(value)
	{
		if (this.animManager.animation && this.animManager.animation.id == "manual")
		{
			this.animManager.animation.gridx = value.x;
			this.animManager.animation.gridy = value.y;

		}
	}

	// --------------------------------------------
	this.setAnimation = function(id)
	{
		with(this.animManager)
		{
			if (animation)
				animation.showControls(false);

			animation = animations[id];
			animation.showControls(true);
		}

		this.animView.setAnimation( this.animManager.animation );
	}


	// --------------------------------------------
	this.setAnimationGround = function(id)
	{
		with(this.animManager)
		{
			if (animationGround)
				animationGround.showControls(false);

			animationGround = animationsGround[id];
			animationGround.showControls(true);
		}

		this.animGroundView.setAnimation( this.animManager.animationGround );
	}

	// --------------------------------------------
	this.update = function()
	{
	   window.requestAnimationFrame(this.update.bind(this));
	}

	// --------------------------------------------
	this.resize = function()
	{
	}


	// --------------------------------------------
	this.saveProperties = function()
	{
		// not sure how to call parent
		var fs 	= require('fs');
		fs.writeFile(this.getPathFileProperties(), JSON.stringify( this.properties ), function (err)
		{
		});

		this.animManager.saveProperties();
	}

}


// --------------------------------------------
toolPupitre.prototype = Object.create(tool.prototype);
var toolPupitre = new toolPupitre();


