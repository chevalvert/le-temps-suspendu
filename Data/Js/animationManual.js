//--------------------------------------------------------
function animationManual(){}

//--------------------------------------------------------
animationManual.prototype = Object.create(animationShader.prototype);
animationManual.prototype.gridx = 0.5;
animationManual.prototype.gridy = 0.5;
animationManual.prototype.type = "floor";

//--------------------------------------------------------
animationManual.prototype.loadProperties = function()
{

	this.fragmentShaderName = "manual.frag";
	this.properties = {}
	
	this.readPropertiesFile();
}

//--------------------------------------------------------
animationManual.prototype.addControls = function()
{
}

//--------------------------------------------------------
animationManual.prototype.getUniforms = function()
{
	return {
		  w: { value: this.wRTT },
		  h: { value: this.hRTT },
		  x: { value: this.gridx },
		  y: { value: this.gridy }
	}
}

//--------------------------------------------------------
animationManual.prototype.setUniforms = function()
{
	if (this.materialRTT)
	{
		this.materialRTT.uniforms.x.value = this.gridx;
		this.materialRTT.uniforms.y.value = this.gridy;
	}
}






