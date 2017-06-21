// --------------------------------------------
function toolPupitre()
{
	// --------------------------------------------
	this.id = "toolPupitre";

	// --------------------------------------------
	// DOM
	this.container = null;
	this.gui = null;
	this.animView = null;

	// --------------------------------------------
	// Properties
	this.properties.gridTouchDebug = false;
	this.properties.gridTouchControl = false;
	this.properties.animations = [];
	this.properties.radiusInfluence = 70;
	this.properties.radiusHeight = 100;
	this.properties.ledGreyOut = 100;

	// --------------------------------------------
	// Animation
	this.animManager = new animationManager();
	
	// --------------------------------------------
	this.init = function(containerId)
	{
		this.container = $(containerId);
		this.container.keydown(function(event){
		
			console.log(event);
		
		});

		// Animations
		this.animManager = new animationManager();
		this.animManager.setup();
//		this.animManager.loadProperties();

		this.properties.animations = Object.keys(this.animManager.animations);
	
		// UI
		this.animView = new animationView();
		this.animView.init();

		this.gui = new dat.GUI({ autoPlace: false , width : 300});
		
		// Properties
		var gridViewFolder = this.gui.addFolder("Grid view");

  		var chkGridTouchDebug = gridViewFolder.add(this.properties, 'gridTouchDebug', false);
  		var chkGridTouchControl = gridViewFolder.add(this.properties, 'gridTouchControl', true);
  		var sliderRadiusInfluence = gridViewFolder.add(this.properties, 'radiusInfluence', 60, 100);


  		var listAnimations = this.gui.add(this.properties, 'animations', this.properties.animations);
/*  		var sliderRadiusHeight = this.gui.add(this.properties, 'radiusHeight', 0, 100).listen();
  		var sliderLedGreyOut = this.gui.add(this.properties, 'ledGreyOut', 0, 100).listen();
*/

		listAnimations.onChange(function(value){
			toolPupitre.setAnimation(value)
		});

		chkGridTouchDebug.onChange(function(value)
		{
			toolPupitre.ipcRenderer.send('toolPupitre-gridTouchDebug', value);
		});



		chkGridTouchControl.onChange(function(value)
		{
			toolPupitre.ipcRenderer.send('toolPupitre-gridTouchControl', value);
		});

		sliderRadiusInfluence.onChange(function(value)
		{
			toolPupitre.ipcRenderer.send('toolPupitre-radiusInfluence', value);
		});

/*		sliderRadiusHeight.onChange(function(value)
		{
			toolPupitre.ipcRenderer.send('toolPupitre-radiusHeight', value);
		});

		sliderLedGreyOut.onChange(function(value)
		{
			toolPupitre.ipcRenderer.send('toolPupitre-ledGreyOut', value);
		});
*/


		this.loadProperties(function(){
//			toolPupitre.createUI(containerId);
		});

		// Apply our own style :)
		this.container.find("#properties-globals").append( this.gui.domElement );
		$(".dg").css( {"font-family" : "Friction-Regular", "font-size" : "13px"} );

		this.setAnimation("plasma");
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

//toolPupitre.saveProperties();
//toolPupitre.loadProperties();


