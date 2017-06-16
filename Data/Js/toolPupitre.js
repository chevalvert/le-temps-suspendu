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
	this.properties.gridTouchControl = false;
	this.properties.animations = [];
	this.properties.radiusInfluence = 70;
	this.properties.radiusHeight = 100;
	this.properties.ledGreyOut = 100;

	// --------------------------------------------
	// Animation
	this.animManager = new animationManager();
//	this.animation 	= null;
//	this.animations = [];
	
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

		this.properties.animations = Object.keys(this.animManager.animations);
	
		// UI
		this.animView = new animationView();
		this.animView.init();

		this.gui = new dat.GUI({ autoPlace: false , width : 300});
		
		// Properties
  		var chkGridTouchControl = this.gui.add(this.properties, 'gridTouchControl', true).listen();
  		var listAnimations = this.gui.add(this.properties, 'animations', this.properties.animations).listen();
  		var sliderRadiusInfluence = this.gui.add(this.properties, 'radiusInfluence', 60, 100).listen();
  		var sliderRadiusHeight = this.gui.add(this.properties, 'radiusHeight', 0, 100).listen();
  		var sliderLedGreyOut = this.gui.add(this.properties, 'ledGreyOut', 0, 100).listen();

		listAnimations.onChange(function(value){
			toolPupitre.setAnimation(value)
		});

		chkGridTouchControl.onChange(function(value)
		{
			toolPupitre.ipcRenderer.send('toolPupitre-gridTouchControl', value);
		});

		sliderRadiusInfluence.onChange(function(value)
		{
			toolPupitre.ipcRenderer.send('toolPupitre-radiusInfluence', value);
		});

		sliderRadiusHeight.onChange(function(value)
		{
			toolPupitre.ipcRenderer.send('toolPupitre-radiusHeight', value);
		});

		sliderLedGreyOut.onChange(function(value)
		{
			toolPupitre.ipcRenderer.send('toolPupitre-ledGreyOut', value);
		});


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
	this.createUI = function(containerId)
	{

//			toolPupitre.ipcRenderer.send('toolPupitre-radiusInfluence', this.properties.radiusInfluence);

	
	}

}


// --------------------------------------------
toolPupitre.prototype = Object.create(tool.prototype);
var toolPupitre = new toolPupitre();

//toolPupitre.saveProperties();
//toolPupitre.loadProperties();


