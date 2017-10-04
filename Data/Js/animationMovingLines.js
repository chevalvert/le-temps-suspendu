//--------------------------------------------------------
function animationMovingLines(){}

//--------------------------------------------------------
animationMovingLines.prototype = Object.create(animationCanvas.prototype);
animationMovingLines.prototype.lines = null;
animationMovingLines.prototype.hLimit = 0;

//--------------------------------------------------------
animationMovingLines.prototype.reset = function()
{
	this.timer.reset();

	if (this.lines == null)
	{
		this.lines = new Array( this.nbColumns );
		var w = this.drawingCanvas.width / this.nbColumns;
		var h = this.drawingCanvas.height / 5;
		var speed = 0;
		var x = 0;
		var y = 0;
		var dir = -1;

		
		for (var i=0;i<this.lines.length;i++)
		{
			 dir = i%2 ? 1 : -1;
			 y = dir == 1 ? -h : this.drawingCanvas.height + Math.random() * 20;
			 this.lines[i] = new movingLine(this, x,y,w,h,dir);
			 x+=w;
		}
		
		this.changeSpeeds();
	}
}

//--------------------------------------------------------
animationMovingLines.prototype.changeSpeeds = function()
{
	var min = this.properties.speedMin;
	var max = this.properties.speedMax;

	for (var i=0;i<this.lines.length;i++)
	{
		this.lines[i].speed = Math.random()*(max-min) + min;
	}
}

//--------------------------------------------------------
animationMovingLines.prototype.loadProperties = function()
{
	this.properties = {}
	this.properties.speedMin = 40.0;
	this.properties.speedMax = 140.0;
	this.properties.rotation = 0.0;

	this.readPropertiesFile();
}

//--------------------------------------------------------
animationMovingLines.prototype.addControls = function()
{
	var sliderSpeedMin = this.gui.add(this.properties, 'speedMin', 	10, 60);
	var sliderSpeedMax = this.gui.add(this.properties, 'speedMax', 	100, 200);
	this.gui.add(this.properties, 'rotation', 	0, 360);
	
	var pThis = this;
	sliderSpeedMin.onChange(function(value){
		pThis.changeSpeeds()
	});
	sliderSpeedMax.onChange(function(){
		pThis.changeSpeeds()
	});


}

//--------------------------------------------------------
animationMovingLines.prototype.render = function(renderer_, bSample)
{
	if (this.properties.rotation > 0 )
		this.hLimit = 30;

	this.drawingContext.fillStyle = "#000000";
	this.drawingContext.fillRect( 0, 0, this.drawingCanvas.width, this.drawingCanvas.height );

	this.drawingContext.save();
	this.drawingContext.translate(this.drawingCanvas.width/2, this.drawingCanvas.height/2);
	this.drawingContext.rotate(this.properties.rotation * Math.PI / 180);
	this.drawingContext.translate(-this.drawingCanvas.width/2, -this.drawingCanvas.height/2);


	if (this.lines)
	{
		var dt = this.timer.update();
		for (var i=0;i<this.lines.length;i++)
		{
			this.lines[i].update(dt);
		}

		this.drawingContext.fillStyle = "#FFFFFF";
		for (var i=0;i<this.lines.length;i++)
		{
			this.lines[i].draw(this.drawingContext);
		}
	}

	this.drawingContext.restore();


	this.texture.needsUpdate = true;

	this.renderOffscreen(renderer_);
	if (bSample)
		this.sampleAndSendValues(renderer_);
}


//--------------------------------------------------------
function movingLine(parent, x,y,w,h,dir)
{
	this.anim		= parent;
	this.pos 		= {x:x, y:y};
	this.dim 		= {w:w, h:h};
	this.speed 		= 0;
	this.dir 		= dir;

	this.update = function(dt)
	{
		this.pos.y += this.dir * this.speed*dt;
		if (this.dir == -1 && this.pos.y < -(this.dim.h+this.anim.hLimit))
		{
			this.pos.y = this.anim.drawingCanvas.height;
		}
		if (this.dir == 1 && this.pos.y > (this.anim.drawingCanvas.height+this.anim.hLimit))
		{
			this.pos.y = -this.dim.h;
		}
	}

	this.draw = function(ctx)
	{
		ctx.fillRect(this.pos.x, this.pos.y, this.dim.w, this.dim.h);
	}
}




