//--------------------------------------------------------
function animationManualWaves(){}

//--------------------------------------------------------
animationManualWaves.prototype = Object.create(animationCanvas.prototype);
animationManualWaves.prototype.waves = new Array(); // array of animationWave
animationManualWaves.prototype.posEllipse = {x:0,y:0};
animationManualWaves.prototype.gradEllipse = null;

//--------------------------------------------------------
animationManualWaves.prototype.loadProperties = function()
{
	this.properties = {}
	this.properties.radius = 10;
	this.properties.widthWave = 15;
	this.properties.speedWave = 20;
	this.properties.ageMaxWave = 4;
	this.readPropertiesFile();
}


//--------------------------------------------------------
animationManualWaves.prototype.setData = function(posNorm)
{
	if (posNorm)
		this.generateWave(posNorm.x, 1.0-posNorm.y);
}


//--------------------------------------------------------
animationManualWaves.prototype.setCamPosNormalized = function(pos)
{
	this.posEllipse.x = pos.x * this.container.width();
	this.posEllipse.y = (1.0 - pos.y) * this.container.height();
}

//--------------------------------------------------------
animationManualWaves.prototype.addControls = function()
{
	this.gui.add(this.properties, 'radius', 	10, 60);
	this.gui.add(this.properties, 'widthWave', 	1, 30);
	this.gui.add(this.properties, 'speedWave', 	5, 60);
	this.gui.add(this.properties, 'ageMaxWave', 0.1, 5);
}


//--------------------------------------------------------
animationManualWaves.prototype.onThumbClicked = function(posNorm)
{
	this.generateWave(posNorm.x, 1.0-posNorm.y);
}

//--------------------------------------------------------
animationManualWaves.prototype.generateWave = function(x,y)
{
	this.waves.push( new animationWave(x * this.container.width(), y * this.container.height(), this.properties.widthWave, this.properties.radius, this.properties.speedWave,this.properties.ageMaxWave) );
}


//--------------------------------------------------------
animationManualWaves.prototype.render = function(renderer_, bSample)
{
	var dt = this.timer.update();

	var scalex = 128.0 / 120.0;
	var scaley = 128.0 / 180.0;

	var r = this.properties.radius;

//	this.gradEllipse = this.drawingContext.createRadialGradient(this.posEllipse.x,this.posEllipse.y,0, pulsex,pulsey, 30);
//	this.gradEllipse.addColorStop(0,		"rgba(255,255,255,"+this.alphaPulse*this.alphaPulse2+")");
//	this.gradEllipse.addColorStop(1,		"rgba(0,0,0,"+this.alphaPulse*this.alphaPulse2+")");


	this.drawingContext.fillStyle = "#000000";
	this.drawingContext.fillRect( 0, 0, this.drawingCanvas.width, this.drawingCanvas.height );

	this.drawingContext.save();
	
	this.drawingContext.scale(scalex, scaley);

	this.drawingContext.beginPath();
	this.drawingContext.ellipse(this.posEllipse.x,this.posEllipse.y,r,r,0,0,2*Math.PI);
	this.drawingContext.fillStyle = "#FFFFFF";
	this.drawingContext.fill();

	this.waves = this.waves.filter( function(wave){ return !wave.dead } )
	for (var i=0; i<this.waves.length; i++)
	{
		this.waves[i].update(dt);
		this.waves[i].draw(this.drawingContext);
	}

	this.drawingContext.restore();
	
	this.renderOffscreen(renderer_);
	this.texture.needsUpdate = true;
	if (bSample)
		this.sampleAndSendValues(renderer_);
}


//--------------------------------------------------------
function animationWave(x,y,w,rstart, speed,ageMax)
{
	this.pos 		= {x:x, y:y};
	this.width		= w;
	this.speed		= speed;
	this.age 		= 0;
	this.ageMax 	= ageMax;
	this.radius		= rstart;
	this.dead 		= false;
	this.alpha 		= 0;

	this.update = function(dt)
	{
		this.age += dt;
		if (this.age >= this.ageMax)
			this.dead = true;
		this.alpha = 1.0-Math.min(1.0, this.age / this.ageMax);

		this.radius += this.speed*dt;
		// console.log("r="+this.radius.toFixed(1)+";age="+this.age.toFixed(1)+";alpha="+this.alpha.toFixed(1));
	}

	this.draw = function(ctx)
	{
		ctx.beginPath();
		ctx.lineWidth = this.width;
		ctx.strokeStyle = "rgba(255,255,255,"+this.alpha+")";
		ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2*Math.PI);
		ctx.stroke();
	}
}

