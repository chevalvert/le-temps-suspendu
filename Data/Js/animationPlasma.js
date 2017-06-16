//--------------------------------------------------------
function animationPlasma(){}

//--------------------------------------------------------
animationPlasma.prototype = Object.create(animation.prototype);

//--------------------------------------------------------
animationPlasma.prototype.loadProperties = function()
{
	this.fragmentShaderName = "plasma.frag";
	this.properties.freqSin2 = 4;
	this.properties.divSin2 = 60;
}

//--------------------------------------------------------
animationPlasma.prototype.addControls = function()
{
	this.gui.add(this.properties, 'freqSin2', 0.2, 4);
	this.gui.add(this.properties, 'divSin2', 30, 100);
}

//--------------------------------------------------------
animationPlasma.prototype.getUniforms = function()
{
	return{
		  time: { value: 0.0 },
		  w: { value: this.wRTT },
		  h: { value: this.hRTT },
		  freqSin2 : { value : this.properties.freqSin2 },
		  divSin2 : { value : this.properties.divSin2 },
	}
}

//--------------------------------------------------------
animationPlasma.prototype.setUniforms = function()
{
	if (this.materialRTT)
	{
		this.materialRTT.uniforms.time.value = this.timer.time;
		this.materialRTT.uniforms.freqSin2.value = this.properties.freqSin2;
		this.materialRTT.uniforms.divSin2.value = this.properties.divSin2;
	}
}
