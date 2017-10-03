//--------------------------------------------------------
function animationMix(){}

//--------------------------------------------------------
animationMix.prototype = Object.create(animationShader.prototype);
animationMix.prototype.anim0 = null;
animationMix.prototype.anim1 = null;

animationMix.prototype.timeline 			= null;

animationMix.prototype.animNamePrev 	 	= "blank";
animationMix.prototype.animNameCurrent 		= "blank";
animationMix.prototype.durationAnimation	= 5.0;
	
animationMix.prototype.bTransition 			= false;
animationMix.prototype.timeTransition		= 0.0;
animationMix.prototype.durationTransition	= 1.0;


animationMix.prototype.sequence 			= ["sine", "plasma", "sine2", "plasma2"];
animationMix.prototype.animationManager		= null;
animationMix.prototype.animations			= null;
//--------------------------------------------------------
animationMix.prototype.setAnimationManager	= function(animManager)
{
	this.animationManager 	= animManager;
	this.animations			= this.animationManager.animations;
}

//--------------------------------------------------------
animationMix.prototype.createTimeline = function()
{
	this.timeline = new timeline();
	this.timeline.setCallbackDefault( this.onTimelineEvent.bind(this) );
	for (var i=0; i<this.sequence.length; i++)
		this.timeline.add( {time : i*this.durationAnimation, animName : this.sequence[i]} );

	this.timeline.add( {time : this.sequence.length*this.durationAnimation, callback : this.onTimelineEnd.bind(this)} );
}

//--------------------------------------------------------
animationMix.prototype.setAnim0 = function(anim)
{
	this.anim0 = anim;
}

//--------------------------------------------------------
animationMix.prototype.setAnim1 = function(anim)
{
	this.anim1 = anim;
}

//--------------------------------------------------------
animationMix.prototype.loadProperties = function()
{

	this.vertexShaderName = "mix.vert";
	this.fragmentShaderName = "mix.frag";
	this.properties = {}
	this.properties.blendFactor = 0.5;

	this.readPropertiesFile();
}

//--------------------------------------------------------
animationMix.prototype.addControls = function()
{
	var sliderMix = this.gui.add(this.properties, 'blendFactor', 0, 1).listen();
}

//--------------------------------------------------------
animationMix.prototype.getUniforms = function()
{
	return {
		  time: { value: 0.0 },
		  w: { value: this.wRTT },
		  h: { value: this.hRTT },
		  blendFactor : { value : this.properties.blendFactor },
		  tex0 : { type : "t", value : this.anim0 ? this.anim0.rendererRTT.texture : null },
		  tex1 : { type : "t", value : this.anim1 ? this.anim1.rendererRTT.texture : null }
	}
}

//--------------------------------------------------------
animationMix.prototype.setUniforms = function()
{
	if (this.materialRTT)
	{
		this.materialRTT.uniforms.time.value = this.timer.time;
		this.materialRTT.uniforms.blendFactor.value = this.properties.blendFactor;
		this.materialRTT.uniforms.tex0.value = this.anim0 ? this.anim0.rendererRTT.texture : null;
		this.materialRTT.uniforms.tex1.value = this.anim1 ? this.anim1.rendererRTT.texture : null;
	}
}


//--------------------------------------------------------
animationMix.prototype.onTimelineEvent = function(event)
{
	this.animNamePrev = this.animNameCurrent;
	this.animNameCurrent = event.animName;

	this.properties.blendFactor = 0.0;

	this.setAnim0( this.animations[this.animNamePrev] );
	this.setAnim1( this.animations[this.animNameCurrent] );
	
	this.bTransition = true;
	this.timeTransition = 0.0;
}

//--------------------------------------------------------
animationMix.prototype.onTimelineEnd = function(event)
{
//	console.log("onTimelineEnd");
	this.timeline.reset();
}


//--------------------------------------------------------
animationMix.prototype.render = function(renderer_, bSample)
{
	var dt = this.timer.update();

	if (this.timeline)
		this.timeline.update(dt);

	if (this.bTransition)
	{
		this.timeTransition += dt;
		this.properties.blendFactor = Math.min(1.0, this.timeTransition / this.durationTransition);
		if (this.properties.blendFactor == 1)
			this.bTransition = false;
	}


	if (this.anim0)
		this.anim0.render(renderer_, false);
	
	if (this.anim1)
		this.anim1.render(renderer_, false);
	
	this.setUniforms();
	renderer_.render( this.sceneRTT, this.cameraRTT, this.rendererRTT, true );
	if (bSample)
		this.sampleAndSendValues(renderer_);
}



