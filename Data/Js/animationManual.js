//--------------------------------------------------------
function animationManual(){}

//--------------------------------------------------------
animationManual.prototype = Object.create(animationShader.prototype);
animationManual.prototype.gridx = 0.5;
animationManual.prototype.gridy = 0.5;

//--------------------------------------------------------
animationManual.prototype.loadProperties = function()
{

	this.fragmentShaderName = "manual.frag";
	this.properties = {}
	this.properties.distFactor = 0.5;
	
	this.readPropertiesFile();
}

//--------------------------------------------------------
animationManual.prototype.addControls = function()
{
	this.gui.add(this.properties, 'distFactor', 0.2, 0.6);
}

//--------------------------------------------------------
animationManual.prototype.getUniforms = function()
{
	return {
		  w: { value: this.wRTT },
		  h: { value: this.hRTT },
		  x: { value: this.gridx },
		  y: { value: this.gridy },
		  distFactor: { value: this.properties.distFactor }
	}
}

//--------------------------------------------------------
animationManual.prototype.setUniforms = function()
{
	if (this.materialRTT)
	{
		this.materialRTT.uniforms.x.value = this.gridx;
		this.materialRTT.uniforms.y.value = this.gridy;
		this.materialRTT.uniforms.distFactor.value = this.properties.distFactor;
	}
}






