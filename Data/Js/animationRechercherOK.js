//--------------------------------------------------------
function animationRechercherOK(){}

//--------------------------------------------------------
animationRechercherOK.prototype = Object.create(animationCanvas.prototype);
animationRechercherOK.prototype.state_wave_to = {id:1};
animationRechercherOK.prototype.state_wave_back = {id:2};
animationRechercherOK.prototype.state_pulse_photo = {id:3};

animationRechercherOK.prototype.state 		= null;
animationRechercherOK.prototype.dimWave 	= {h:50};
animationRechercherOK.prototype.gradWave 	= null;
animationRechercherOK.prototype.posWave 	= {y:0};
animationRechercherOK.prototype.speedWave 	= 80.0;
animationRechercherOK.prototype.posPulse 	= {x:0, y:0};
animationRechercherOK.prototype.gradPulse 	= null;
animationRechercherOK.prototype.bDoPulse 	= true;
animationRechercherOK.prototype.tweenPulseAppear = null;
animationRechercherOK.prototype.alphaPulse 	= 0.0;
animationRechercherOK.prototype.alphaPulse2 = 0.0;
animationRechercherOK.prototype.bReset = false;
animationRechercherOK.prototype.anglePulse2 = 0.0
animationRechercherOK.prototype.nbPulsesTodo = 2; // number of pulses before exit
animationRechercherOK.prototype.nbPulses = 0;


//--------------------------------------------------------
animationRechercherOK.prototype.loadProperties = function()
{
	this.properties = {}
	
	this.properties.speedWave = 80.0;
	this.properties.radiusPulse = .5;

	this.readPropertiesFile();
}

//--------------------------------------------------------
animationRechercherOK.prototype.addControls = function()
{
 	this.gui.add(this.properties, 'speedWave', 10.0, 100.0);
 	this.gui.add(this.properties, 'radiusPulse', 0.1, 1.0);
}

//--------------------------------------------------------
animationRechercherOK.prototype.reset = function()
{
	this.bReset = true;
}

//--------------------------------------------------------
animationRechercherOK.prototype.setData = function(thumbPosNormalized)
{
	if (this.type=="ceil" && thumbPosNormalized != null)
	{
		this.posPulse.x = thumbPosNormalized.x * this.container.width();
		this.posPulse.y = (1.0-thumbPosNormalized.y) * this.container.height(); // Y-axis reversed relative to gridview
	}
}

//--------------------------------------------------------
animationRechercherOK.prototype.render = function(renderer_, bSample)
{
	if (this.bReset)
	{
		this.state = this.state_wave_to;
		this.posWave.y = this.drawingCanvas.height;
		this.anglePulse2 = 0.0;
		this.alphaPulse = 0.0;
		this.alphaPulse2 = 0.0;
		this.nbPulses = 0;
		this.timer.reset();
		TWEEN.remove(this.tweenPulseAppear);

		if (this.type == "floor")
			this.bDoPulse = false;

		this.bReset = false;
	}

	var dt = this.timer.update();

	this.drawingContext.fillStyle = "#000000";
	this.drawingContext.fillRect( 0, 0, this.drawingCanvas.width, this.drawingCanvas.height );

	this.gradWave = this.drawingContext.createLinearGradient(0,this.posWave.y,0,this.posWave.y+this.dimWave.h);
	this.gradWave.addColorStop(0,	"black");
	this.gradWave.addColorStop(0.5,	"white");
	this.gradWave.addColorStop(1,	"black");

	this.drawingContext.fillStyle = this.gradWave;
	this.drawingContext.fillRect(0, this.posWave.y,this.drawingCanvas.width, this.dimWave.h );
	
	if (this.bDoPulse && this.alphaPulse>0.0)
	{
		var w = this.container.width();
		var h = this.container.height();
	
		// Coords + size in view space
		var r = this.properties.radiusPulse * w;
		var pulsex = this.posPulse.x;
		var pulsey = this.posPulse.y;

		var scalex = 128.0 / 120.0;
		var scaley = 128.0 / 180.0;
		
		this.anglePulse2 += 0.5*Math.PI*dt;
		if (this.anglePulse2 >= 2.0*Math.PI)
		{
			this.anglePulse2 -= 2.0*Math.PI;
			this.nbPulses++;
			if (this.nbPulses == this.nbPulsesTodo)
			{
				this.anglePulse2 = 0;

				// Exit now
				ipcRenderer.send('animationRechercherOK_done', {});
			}
		}
		this.alphaPulse2 = 0.5 * ( 1.0+Math.sin( this.anglePulse2 ) );
	
		this.gradPulse = this.drawingContext.createRadialGradient(pulsex,pulsey,0, pulsex,pulsey,r);
		this.gradPulse.addColorStop(0,		"rgba(255,255,255,"+this.alphaPulse*this.alphaPulse2+")");
		this.gradPulse.addColorStop(1,		"rgba(0,0,0,"+this.alphaPulse*this.alphaPulse2+")");

		this.drawingContext.save();
		
		this.drawingContext.scale(scalex, scaley);

		this.drawingContext.beginPath();
		this.drawingContext.ellipse(pulsex,pulsey,r,r,0,0,2*Math.PI);
		this.drawingContext.fillStyle = this.gradPulse;
		this.drawingContext.fill();


		this.drawingContext.restore();

	}


	if (this.state === this.state_wave_to)
	{
		this.posWave.y = this.posWave.y - this.properties.speedWave * dt;
		if (this.posWave.y <= -0.5*this.dimWave.h)
		{
			// HIT
			this.state = this.state_wave_back;

			// Emit event => show photo
			ipcRenderer.send('animationRechercherOK_setPhoto', {});
		}

	}
	else if (this.state === this.state_wave_back)
	{
		this.posWave.y = this.posWave.y + this.properties.speedWave * dt;
		if (this.posWave.y > this.drawingCanvas.height)
		{
			if (this.bDoPulse)
			{
				TWEEN.remove(this.tweenPulseAppear);
				this.tweenPulseAppear = new TWEEN.Tween(this).to({ alphaPulse: 1.0 }, 1000).start();
			}
		}
	}

//	this.drawingContext.fillRect(0, 50,this.drawingCanvas.width, this.dimWave.h );

	this.renderOffscreen(renderer_);
	this.texture.needsUpdate = true;
	if (bSample)
		this.sampleAndSendValues(renderer_);
}
