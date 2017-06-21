//--------------------------------------------------------
function animationShader(){}
animationShader.prototype = Object.create(animation.prototype);

//--------------------------------------------------------
animationShader.prototype.pathShaders = __dirname + "/Data/Shaders/";
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
		vertexShader: this.getShaderString("basic.vert"),
		fragmentShader: this.getShaderString(this.fragmentShaderName)
	});
}


//--------------------------------------------------------
animationShader.prototype.render = function(renderer_)
{
	this.timer.update();
	this.setUniforms();
	renderer_.render( this.sceneRTT, this.cameraRTT, this.rendererRTT, true );
	this.sampleAndSendValues(renderer_);
}
