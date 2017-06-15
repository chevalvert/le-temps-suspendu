// --------------------------------------------
function toolPupitre()
{
	// --------------------------------------------
	this.id = "toolPupitre";

	// --------------------------------------------
	// DOM
	this.container = null;
	this.gui = null;
	
	// --------------------------------------------
	// Properties
	this.properties.gridTouchControl = false;
//	this.properties.animations = ["plasma", "sine"];
	this.properties.animations = ["sine"];
	this.properties.radiusInfluence = 70;
	this.properties.radiusHeight = 100;
	this.properties.ledGreyOut = 100;

	// --------------------------------------------
	// Animation
	this.animation 	= null;
	this.animations = [];
	
	// --------------------------------------------
	this.init = function(containerId)
	{
		this.container = $(containerId);
		this.container.keydown(function(event){
		
			console.log(event);
		
		});

		// UI
		this.gui = new dat.GUI({ autoPlace: false , width : 300});
		
		// Properties
  		var chkGridTouchControl = this.gui.add(this.properties, 'gridTouchControl', true).listen();
  		var listAnimations = this.gui.add(this.properties, 'animations', this.properties.animations).listen();
  		var sliderRadiusInfluence = this.gui.add(this.properties, 'radiusInfluence', 60, 100).listen();
  		var sliderRadiusHeight = this.gui.add(this.properties, 'radiusHeight', 0, 100).listen();
  		var sliderLedGreyOut = this.gui.add(this.properties, 'ledGreyOut', 0, 100).listen();

		listAnimations.onChange(function(value){
//			toolPupitre.ipcRenderer.send('toolPupitre-listAnimations', value);
			if (value == "plasma")
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
		this.container.append( this.gui.domElement );
		$(".dg").css( {"font-family" : "Friction-Regular", "font-size" : "13px"} );
		
		// Animations (temp)

		var animation01 = new animation();
		animation01.setup({wRTT : 120/3, fragmentShaderId : "sine"});
		this.animations["sine"] =  animation01;

/*		var animation02 = new animation();
		animation02.setup({wRTT : 120/3, fragmentShaderId : "plasma"});
		this.animations["plasma"] = animation02 ;
*/

		this.setAnimation("sine");
	}

	// --------------------------------------------
	this.setAnimation = function(id)
	{
//		if (index < this.animations.length)
		{
			if (this.animation)
				this.animation.exit();
		
			this.animation = this.animations[id];
			this.animation.enter();
		}
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


