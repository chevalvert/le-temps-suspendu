//--------------------------------------------------------
function animationSine(){}

//--------------------------------------------------------
animationSine.prototype = Object.create(animationShader.prototype);

//--------------------------------------------------------
animationSine.prototype.loadProperties = function()
{
	this.fragmentShaderName = "sine.frag";
	this.properties.freqSin = 8;
}

//--------------------------------------------------------
animationSine.prototype.addControls = function()
{
	var sliderFreqSin = this.gui.add(this.properties, 'freqSin', 2, 20);
}

//--------------------------------------------------------
animationSine.prototype.getUniforms = function()
{
	return {
		  time: { value: 0.0 },
		  w: { value: this.wRTT },
		  h: { value: this.hRTT },
		  freqSin : { value : this.properties.freqSin }
	}
}

//--------------------------------------------------------
animationSine.prototype.setUniforms = function()
{
	if (this.materialRTT)
	{
		this.materialRTT.uniforms.time.value = this.timer.time;
		this.materialRTT.uniforms.freqSin.value = this.properties.freqSin;
	}
}






