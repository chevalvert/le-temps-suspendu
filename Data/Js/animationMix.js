//--------------------------------------------------------
function animationMix(){}

//--------------------------------------------------------
animationMix.prototype = Object.create(animationShader.prototype);
animationMix.prototype.anim0 = null;
animationMix.prototype.anim1 = null;


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
	var sliderMix = this.gui.add(this.properties, 'blendFactor', 0, 1);
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
		this.materialRTT.uniforms.tex0.value = this.anim0.rendererRTT.texture;
		this.materialRTT.uniforms.tex1.value =  this.anim1.rendererRTT.texture;
	}
}

//--------------------------------------------------------
animationShader.prototype.render = function(renderer_, bSample)
{
	if (this.anim0)
		this.anim0.render(renderer_, false);
	
	if (this.anim1)
		this.anim1.render(renderer_, false);
	
	this.timer.update();
	this.setUniforms();
	renderer_.render( this.sceneRTT, this.cameraRTT, this.rendererRTT, true );
	if (bSample)
		this.sampleAndSendValues(renderer_);
}



