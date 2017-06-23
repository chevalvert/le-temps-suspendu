//--------------------------------------------------------
function animationShader(){}
animationShader.prototype = Object.create(animation.prototype);

//--------------------------------------------------------
animationShader.prototype.pathShaders = __dirname + "/Data/Shaders/";
animation.prototype.vertexShaderName = "basic.vert";
animation.prototype.fragmentShaderName = "";


//--------------------------------------------------------
animationShader.prototype.getShaderString = function(name)
{
	return this.fs.readFileSync(this.pathShaders+name).toString();
}

//--------------------------------------------------------
animationShader.prototype.getUniforms = function(){return {};}

//--------------------------------------------------------
animationShader.prototype.setUniforms = function(){}

//--------------------------------------------------------
animationShader.prototype.createMaterial = function()
{
	this.materialRTT = new THREE.ShaderMaterial(
	{
		uniforms: this.getUniforms(),
		vertexShader: this.getShaderString(this.vertexShaderName),
		fragmentShader: this.getShaderString(this.fragmentShaderName)
	});
}


//--------------------------------------------------------
animationShader.prototype.render = function(renderer_,bSample)
{
	this.timer.update();
	this.setUniforms();
	this.renderOffscreen(renderer_);
	if (bSample)
		this.sampleAndSendValues(renderer_);
}
