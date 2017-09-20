//--------------------------------------------------------
function animationTransition(){}

//--------------------------------------------------------
animationTransition.prototype = Object.create(animationShader.prototype);
animationTransition.prototype.anim0 = null;
animationTransition.prototype.anim1 = null;
//animationTransition.prototype.anim0Name = null;
//animationTransition.prototype.anim1Name = null;

animationTransition.prototype.blendFactor			= 0.0;
animationTransition.prototype.bTransition 			= false;
animationTransition.prototype.timeTransition		= 0.0;
animationTransition.prototype.durationTransition	= 1.0;
animationTransition.prototype.tweenTransition 		= null;

animationTransition.prototype.animationManager		= null;
animationTransition.prototype.animations			= null;

//--------------------------------------------------------
animationTransition.prototype.setAnimationManager	= function(animManager)
{
	this.animationManager 	= animManager;
	this.animations			= this.animationManager.animations;
}

//--------------------------------------------------------
animationTransition.prototype.setAnim0 = function(id, data)
{
	if (id)
	{
		this.anim0 = this.animations[id];
		this.anim0.setData(data);
		this.anim0.reset();
	}
	else
	{
		this.anim0 = null;
	}
}

//--------------------------------------------------------
animationTransition.prototype.setAnim1 = function(id, data)
{
	if (id)
	{
		this.anim1 = this.animations[id];
		this.anim1.setData(data);
		this.anim1.reset();
	}
	else
	{
		this.anim1 = null;
	}
}

//--------------------------------------------------------
animationTransition.prototype.loadProperties = function()
{
	this.vertexShaderName = "mix.vert";
	this.fragmentShaderName = "mix.frag";
	this.properties = {}

	this.readPropertiesFile();
}

//--------------------------------------------------------
animationTransition.prototype.addControls = function()
{
}

//--------------------------------------------------------
animationTransition.prototype.getUniforms = function()
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
animationTransition.prototype.setUniforms = function()
{
	if (this.materialRTT)
	{
		this.materialRTT.uniforms.time.value = this.timer.time;
		this.materialRTT.uniforms.blendFactor.value = this.blendFactor;
		this.materialRTT.uniforms.tex0.value = this.anim0 ? this.anim0.rendererRTT.texture : null;
		this.materialRTT.uniforms.tex1.value = this.anim1 ? this.anim1.rendererRTT.texture : null;
	}
}


//--------------------------------------------------------
animationTransition.prototype.setGridPos = function(gridx,gridy)
{
	if (this.anim0 && this.anim0.id == "manual")
	{
		this.anim0.gridx = gridx;
		this.anim0.gridy = gridy;
	}

	if (this.anim1 && this.anim1.id == "manual")
	{
		this.anim1.gridx = gridx;
		this.anim1.gridy = gridy;
	}

}


//--------------------------------------------------------
animationTransition.prototype.setAnimation = function(params)
{
	var id = Utils.extractAnimParams("id", params)
	var data = Utils.extractAnimParams("data", params)

	if (this.anim0 == null && this.anim1 == null)
	{
		this.setAnim0( id, data);
		this.setAnim1( null );
		this.blendFactor = 0.0;
	}
	else
	{
		if (this.bTransition == false)
		{
		
			var blendFactorTarget = 0;
			if (this.blendFactor == 1)
			{
//				console.log("this.setAnim0("+id+")");
				this.setAnim0( id,data );
				blendFactorTarget = 0;
			}
			else
			{
//				console.log("this.setAnim1("+id+")");
				this.setAnim1( id,data );
				blendFactorTarget = 1;
			}

			if (this.tweenTransition)
			{
				TWEEN.remove( this.tweenTransition );
				this.tweenTransition = null;
			}
			
			this.tweenTransition = new TWEEN.Tween(this).to({ blendFactor: blendFactorTarget }, 500.0).onComplete( this.onTransitionComplete.bind(this) );
			this.tweenTransition.start();
		}
	}
}

//--------------------------------------------------------
animationTransition.prototype.onTransitionComplete = function(obj)
{
	this.bTransition = false;
	// console.log("animationTransition.prototype.onTransitionComplete()");
}

//--------------------------------------------------------
animationTransition.prototype.render = function(renderer_, bSample)
{
//	 console.log("this.setAnim0="+this.anim0+";this.anim1="+this.anim1);
	
	if (this.anim0 && this.blendFactor < 1)
		this.anim0.render(renderer_, false);
	
	if (this.anim1 && this.blendFactor > 0)
		this.anim1.render(renderer_, false);
	
	this.setUniforms();
	renderer_.render( this.sceneRTT, this.cameraRTT, this.rendererRTT, true );
	if (bSample)
		this.sampleAndSendValues(renderer_);
}



