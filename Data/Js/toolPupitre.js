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
	this.properties.gridTouchDebug 		= false;
	this.properties.gridFactorMouseDrag	= 2.0;
	this.properties.gridFactorCamSpeed	= 0.1;
	this.properties.appStateDebug 		= true;
	this.properties.animations 			= [];
	this.properties.timeline 			= false;
	this.properties.radiusInfluence 	= 70;
	this.properties.photoScale 			= 0.5;
	this.properties.photoInterval 		= 0.05; // secondes

	this.properties.ledsLuminosityMin	= 0.2;
	this.properties.ledsLuminosityMax	= 1.0;

	this.properties.ledsValueMin		= 0.2;
	this.properties.ledsValueMax		= 1.0;
	
	this.properties.useAnimTransition		= true;

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
	
		// UI
		this.animView = new animationView();
		this.animView.init();

		this.animGroundView = new animationGroundView();
		this.animGroundView.init();

		this.guiGlobals 			= new dat.GUI({ autoPlace: false , width : $("#column1").width()});
		this.guiAnimationList 		= new dat.GUI({ autoPlace: false , width : $("#column2").width()});
		this.guiAnimationGroundList = new dat.GUI({ autoPlace: false , width : $("#column3").width()});
		
		// Properties
		this.loadProperties();

		this.properties.animations 			= Object.keys(this.animManager.animations);
		this.properties.animationsGround 	= Object.keys(this.animManager.animationsGround);


		// UI > Globals
		var globalsFolder 			= this.guiGlobals.addFolder("Globals");
  		var chkAppStateDebug 		= globalsFolder.add(this.properties, 				'appStateDebug', 	this.properties.appStateDebug);

		chkAppStateDebug.onChange		(function(value){ toolPupitre.ipcRenderer.send('toolPupitre-appStateDebug', 	value); });

		// UI > LEDs
		var ledsFolder 				= this.guiGlobals.addFolder("LEDs");
		var sliderLedsLuminosityMin	= ledsFolder.add(this.properties,				'ledsLuminosityMin',	0.0, 1.0);
		var sliderLedsLuminosityMax	= ledsFolder.add(this.properties,				'ledsLuminosityMax',	0.0, 1.0);

		sliderLedsLuminosityMin.onChange	(function(value){ toolPupitre.ipcRenderer.send('toolPupitre-ledsLuminosityMin', 	value); });
		sliderLedsLuminosityMax.onChange	(function(value){ toolPupitre.ipcRenderer.send('toolPupitre-ledsLuminosityMax', 	value); });


		// UI > Grid view
		var gridViewFolder 				= this.guiGlobals.addFolder("Grid view");
		var sliderGridFactorMouseDrag	= gridViewFolder.add(this.properties,			'gridFactorMouseDrag',	0.5, 3);
		var sliderGridFactorCamSpeed	= gridViewFolder.add(this.properties,			'gridFactorCamSpeed',	0.1, 0.5);

		sliderGridFactorMouseDrag.onChange	(function(value){ toolPupitre.ipcRenderer.send('toolPupitre-gridFactorMouseDrag', 	value); });
		sliderGridFactorCamSpeed.onChange	(function(value){ toolPupitre.ipcRenderer.send('toolPupitre-gridFactorCamSpeed', 	value); });

		// UI > Interactive view
		var interactiveViewFolder 	= this.guiGlobals.addFolder("Interactive view");

  		var chkGridTouchDebug 		= interactiveViewFolder.add(this.properties, 		'gridTouchDebug', 	this.properties.gridTouchDebug);
  		var sliderRadiusInfluence 	= interactiveViewFolder.add(this.properties, 		'radiusInfluence', 	60, 100);
		var sliderLedsValueMin		= interactiveViewFolder.add(this.properties, 		'ledsValueMin', 	0, 1);
		var sliderLedsValueMax		= interactiveViewFolder.add(this.properties, 		'ledsValueMax', 	0, 1);

		chkGridTouchDebug.onChange		(function(value){ toolPupitre.ipcRenderer.send('toolPupitre-gridTouchDebug', 	value); });
		sliderRadiusInfluence.onChange	(function(value){ toolPupitre.ipcRenderer.send('toolPupitre-radiusInfluence', 	value); });
		sliderLedsValueMin.onChange		(function(value){ toolPupitre.ipcRenderer.send('toolPupitre-ledsValueMin', 		value); });
		sliderLedsValueMax.onChange		(function(value){ toolPupitre.ipcRenderer.send('toolPupitre-ledsValueMax', 		value); });


		// UI > Animations
  		var listAnimations 			= this.guiAnimationList.add(this.properties, 		'animations', 		this.properties.animations);
  		var listAnimationsGround 	= this.guiAnimationGroundList.add(this.properties, 	'animationsGround', this.properties.animationsGround);

		listAnimations.onChange			(function(value){ toolPupitre.setAnimation(value) });
		listAnimationsGround.onChange	(function(value){ toolPupitre.setAnimationGround(value) });

		
  		var chkUseTransition 		= this.guiAnimationList.add(this.properties, 		'useAnimTransition', 	this.properties.useAnimTransition);
		chkUseTransition.onChange(function(value){ console.log("chkUseTransition="+value) })


		// UI > Photo view
		var photoViewFolder 		= this.guiGlobals.addFolder("Photo view");
  		var sliderPhotoScale 		= photoViewFolder.add(this.properties, 				'photoScale', 		0.1, 1.0);
  		var sliderPhotoInterval 	= photoViewFolder.add(this.properties, 				'photoInterval', 	0.05, 0.5);

		sliderPhotoScale.	onChange(function(value){ toolPupitre.ipcRenderer.send('toolPupitre-photoScale', 	value); });
		sliderPhotoInterval.onChange(function(value){ toolPupitre.ipcRenderer.send('toolPupitre-photoInterval', value); });

		// Apply values
		chkAppStateDebug.			setValue( this.properties.appStateDebug );
		sliderGridFactorMouseDrag.	setValue( this.properties.gridFactorMouseDrag );
		sliderGridFactorCamSpeed.	setValue( this.properties.gridFactorCamSpeed );
		chkGridTouchDebug.			setValue( this.properties.gridTouchDebug );
		sliderRadiusInfluence.		setValue( this.properties.radiusInfluence );
		sliderPhotoScale.			setValue( this.properties.photoScale ); // Hmmmmmmmmm doing this to call onChange @ start
		sliderLedsLuminosityMin.	setValue( this.properties.ledsLuminosityMin );
		sliderLedsLuminosityMax.	setValue( this.properties.ledsLuminosityMax );
		sliderLedsValueMin.			setValue( this.properties.ledsValueMin );
		sliderLedsValueMax.			setValue( this.properties.ledsValueMax );
		

		// Apply our own style :)
		this.applyStyleControls();

		// Set animations
		var animTransition = this.setAnimation("transition");
		animTransition.setAnimation("sine2");
		animTransition.setAnimation("plasma");
		this.setAnimationGround("sine_ground");

	   window.requestAnimationFrame(this.update.bind(this));
	}

	
	// --------------------------------------------
	this.applyStyleControls = function()
	{
		this.container.find("#properties-globals").append( this.guiGlobals.domElement );
		this.container.find("#properties-animation-list").append( this.guiAnimationList.domElement );
		this.container.find("#properties-animationGround-list").append( this.guiAnimationGroundList.domElement );


		$(".dg").css( {"font-family" : "Friction-Regular", "font-size" : "13px"} );
	}
	
	// --------------------------------------------
	this.setGridViewCamPos = function(value)
	{
		var bUseTransition = this.properties.useAnimTransition;
		if (bUseTransition)
		{
			if (this.animManager.animation && this.animManager.animation.id == "transition")
			{
			 this.animManager.animation.setGridPos(value.x,value.y);
			}
		}
		else
		{
			if (this.animManager.animation && this.animManager.animation.id == "manual")
			{
				this.animManager.animation.gridx = value.x;
				this.animManager.animation.gridy = value.y;
			}
		}
	
	}

	// --------------------------------------------
	this.setInteragirMousePos = function(value)
	{
		var bUseTransition = this.properties.useAnimTransition;
		if (bUseTransition)
		{
			if (this.animManager.animation && this.animManager.animation.id == "transition")
			{
			 this.animManager.animation.setGridPos(value.x,1.0-value.y);
			}
		}
		else
		{

			if (this.animManager.animation && this.animManager.animation.id == "manual")
			{
				this.animManager.animation.gridx = value.x;
				this.animManager.animation.gridy = 1.0-value.y;
			}
		}
	}

	// --------------------------------------------
	this.setAnimationTransition = function(params)
	{
		var bUseTransition = this.properties.useAnimTransition;
	
		if (bUseTransition)
		{
			if (this.animManager.animation == null)
			{
				this.setAnimation("transition");
			}
			else
			{
				if (this.animManager.animation.id != "transition")
				{
					this.setAnimation("transition");
				}
			}
			
			var animTransition = this.animManager.animation;
			if (animTransition)
			{
				 animTransition.setAnimation(params);
			}
		}
		else
		{
			this.setAnimation(params);
		}
	}

	// --------------------------------------------
	this.setAnimation = function(params)
	{
		if (this.animView == null) return;


		var id = Utils.extractAnimParams("id", params)
		var data = Utils.extractAnimParams("data", params)

		// Animation
		with(this.animManager)
		{
			if (animation)
				animation.showControls(false);

			animation = animations[id];
			if (animation)
			{
				animation.showControls(true);
				animation.setData(data);
				animation.reset();
			}
		}

		if (this.animManager.animation)
		{
			this.animView.setAnimation( this.animManager.animation );
		}
		
	
		return this.animManager.animation;
	}


	// --------------------------------------------
	this.setAnimationGround = function(params)
	{
		if (this.animGroundView == null) return;

		var id = "";
		var data = null;


		var id = Utils.extractAnimParams("id", params)
		var data = Utils.extractAnimParams("data", params)


		with(this.animManager)
		{
			if (animationGround)
				animationGround.showControls(false);

			animationGround = animationsGround[id];
			if (animationGround)
			{
				animationGround.showControls(true);
				animationGround.setData(data);
				animationGround.reset();
			}
		}

		if (this.animManager.animationGround)
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


