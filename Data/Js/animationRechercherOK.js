//--------------------------------------------------------
function animationRechercherOK(){}

//--------------------------------------------------------
animationRechercherOK.prototype = Object.create(animationCanvas.prototype);
animationRechercherOK.prototype.state_wave_to = {id:1};
animationRechercherOK.prototype.state_wait_do_pulse = {id:2, timeout : 1};
animationRechercherOK.prototype.state_do_pulse = {id:3};
animationRechercherOK.prototype.state_wave_stop = {id:4};

animationRechercherOK.prototype.state 		= null;
animationRechercherOK.prototype.hWave 		= 0;
animationRechercherOK.prototype.dirWave 	= 1;
animationRechercherOK.prototype.posWave 	= null;
animationRechercherOK.prototype.speedWave 	= 80.0;
animationRechercherOK.prototype.alphaWave 	= 1.0;
animationRechercherOK.prototype.alphaWaveTarget = 1.0;


animationRechercherOK.prototype.posPulse 	= null;
animationRechercherOK.prototype.gradPulse 	= null;
animationRechercherOK.prototype.alphaPulse 	= 0.0;
animationRechercherOK.prototype.alphaPulse2 = 0.0;
animationRechercherOK.prototype.anglePulse2 = 0.0
animationRechercherOK.prototype.nbPulses = 0;
animationRechercherOK.prototype.bPulseGradient = false;

animationRechercherOK.prototype.panel = -1;

animationRechercherOK.prototype.bReset = false;

animationRechercherOK.prototype.timeWaitDoPulse = 0;

//--------------------------------------------------------
animationRechercherOK.prototype.loadProperties = function()
{
	this.properties = {}
	
	this.properties.speedWave = 80.0;
	this.properties.radiusPulse = .5;
	this.properties.freqPulse = 4;
	this.properties.nbPulses = 1;

	this.readPropertiesFile();
}

//--------------------------------------------------------
animationRechercherOK.prototype.addControls = function()
{
 	this.gui.add(this.properties, 'speedWave', 10.0, 200.0);
 	this.gui.add(this.properties, 'radiusPulse', 0.0, 0.1);
	this.gui.add(this.properties, 'freqPulse', 1, 8).step(1);
	this.gui.add(this.properties, 'nbPulses',  1, 8).step(1);
}

//--------------------------------------------------------
animationRechercherOK.prototype.reset = function()
{
	this.bReset = true;
}

//--------------------------------------------------------
animationRechercherOK.prototype.setData = function(thumbPosNormalized)
{
	// console.log("animationRechercherOK.prototype.setData");
	// console.log(thumbPosNormalized);


	if (thumbPosNormalized != null)
	{
		this.panel = thumbPosNormalized.panel;

/*		var nbx = parseInt(this.container.width() / 8);
		var nby = parseInt(this.container.height() / 11);
	
		var xx = parseInt( thumbPosNormalized.x * 8 )
		var yy = parseInt( (1.0 - thumbPosNormalized.y) * 11 )

		this.posPulse = {
			x : (xx+0.5)*nbx,
			y : (yy+0.5)*nby,
		}

		this.properties.radiusPulse = 1 / 8 * 0.5;
*/

	
/*		this.posPulse =
		{
			x : thumbPosNormalized.x * this.container.width(),
		    y : (1.0-thumbPosNormalized.y) * this.container.height()
		} // Y-axis reversed relative to gridview
*/


		

	
		// console.log(this.posPulse);
	}
}

//--------------------------------------------------------
// Called when photo was just shown on screen
// For animation ground
animationRechercherOK.prototype.triggerForPhoto = function()
{
	// console.log("animationRechercherOK.prototype.triggerForPhoto");
	if (this.type == "ceil")
	{
		this.state = this.state_wave_to;
		this.timer.reset();
	}
}

//--------------------------------------------------------
animationRechercherOK.prototype.showPulse = function()
{
	if (this.type == "ceil")
		this.state = this.state_do_pulse;
	this.alphaWaveTarget = 0.0;
	this.alphaPulse = 1.0;
	this.timer.reset();
}


//--------------------------------------------------------
animationRechercherOK.prototype.drawPanel = function(canvas, panel, alpha)
{
	var nbPanelsColumns = this.nbColumns / 2;
	var nbPanelsRows = this.nbRows;

	var panelI = parseInt(panel % nbPanelsColumns);
	var panelJ = parseInt(panel / nbPanelsColumns);

	var stepx = parseInt(canvas.width / nbPanelsColumns);
	var stepy = parseInt(canvas.height / nbPanelsRows);

	var x = panelI * stepx;
	var y = canvas.height - panelJ * stepy - stepy;

	this.drawingContext.fillStyle = "rgba(255,255,255,"+alpha+")";
	this.drawingContext.fillRect( x, y, stepx, stepy );
}


//--------------------------------------------------------
animationRechercherOK.prototype.render = function(renderer_, bSample)
{
	if (this.bReset)
	{
		this.state 		= this.state_wave_stop;
		this.hWave 		= this.drawingCanvas.height;
		this.posWave 	= {x:0, y:-this.hWave};
		this.dirWave	= 1;
		this.alphaWave	= this.alphaWaveTarget = 1;
		
		this.anglePulse2 = 0.0;
		this.alphaPulse = 0.0;
		this.alphaPulse2 = 0.0;
		this.nbPulses = 0;

		this.timer.reset();

		if (this.type == "floor")
		{
			this.state 		= this.state_wave_to;
			this.dirWave 	= -1;
			this.posWave.y 	= this.drawingCanvas.height;
		}

		this.bReset = false;
	}

	var dt = this.timer.update();

	// Background
	this.drawingContext.fillStyle = "#000000";
	this.drawingContext.fillRect( 0, 0, this.drawingCanvas.width, this.drawingCanvas.height );


	// Wave
	this.alphaWave += (this.alphaWaveTarget - this.alphaWave) * 0.99 * dt;
	this.drawingContext.fillStyle = "rgba(255,255,255,"+this.alphaWave+")";
	this.drawingContext.fillRect(0, this.posWave.y,this.drawingCanvas.width, this.hWave );
	
	// Propagation
	if (this.state === this.state_wave_to)
	{
		this.posWave.y = this.posWave.y + this.dirWave * this.properties.speedWave * dt;
		
		// for ceil
		if (this.dirWave == 1)
		{
			if (this.posWave.y >= 0.0)
			{
				// force stop
				this.posWave.y = 0.0;
				// this.state = this.state_wave_stop;
				this.timeWaitDoPulse = 0.0;
				this.state = this.state_wait_do_pulse;

			}
		}
		
		// for ground
		else if (this.dirWave == -1)
		{
			if (this.posWave.y <= 0)
			{
				// force stop
				this.posWave.y = 0;
				this.state = this.state_wave_stop;

				// ceil : Emit event => show photo => trigger wave_to for ground
				ipcRenderer.send('animationRechercherOK_setPhoto', {});

			}
		}

	}

	// Pulse
	else if (this.state === this.state_wait_do_pulse)
	{
		this.timeWaitDoPulse += dt;
		if (this.timeWaitDoPulse >= this.state.timeout)
		{
			this.state = this.state_wave_stop;
			// Emit event => show pulse
			ipcRenderer.send('animationRechercherOK_showPulse', {});
		}
	}
	
	// Pulse
	else if (this.state === this.state_do_pulse)
	{
	
//		var w = this.container.width();
//		var h = this.container.height();
	
		// Coords + size in view space
//		var r = this.properties.radiusPulse * w;
//		var pulsex = this.posPulse.x;
//		var pulsey = this.posPulse.y;

//		var scalex = 128.0 / 120.0;
//		var scaley = 128.0 / 180.0;
		
		this.anglePulse2 += 0.5*Math.PI*dt;
		if (this.anglePulse2 >= 2.0*Math.PI)
		{
			this.anglePulse2 -= 2.0*Math.PI;
			this.nbPulses += this.properties.freqPulse;
			if (this.nbPulses == this.properties.nbPulses * this.properties.freqPulse)
			{
				this.anglePulse2 = 0;

				// Exit now
				if (this.type == "ceil")
					ipcRenderer.send('animationRechercherOK_done', {});
			}
		}
		this.alphaPulse2 = 0.5 * ( 1.0 + Math.cos( this.properties.freqPulse * this.anglePulse2 ) );
	

/*
		if (this.bPulseGradient)
		{
			this.gradPulse = this.drawingContext.createRadialGradient(pulsex,pulsey,0, pulsex,pulsey,r);
			this.gradPulse.addColorStop(0,		"rgba(255,255,255,"+this.alphaPulse*this.alphaPulse2+")");
			this.gradPulse.addColorStop(1,		"rgba(0,0,0,"+this.alphaPulse*this.alphaPulse2+")");
		}
	

		this.drawingContext.save();
		this.drawingContext.scale(scalex, scaley);
		this.drawingContext.beginPath();
		this.drawingContext.ellipse(pulsex,pulsey,r,r,0,0,2*Math.PI);
		this.drawingContext.fillStyle = this.bPulseGradient ? this.gradPulse : "rgba(255,255,255,"+this.alphaPulse*this.alphaPulse2+")";
		this.drawingContext.fill();
		this.drawingContext.restore();
*/

		this.drawPanel(this.drawingCanvas, this.panel, this.alphaPulse*this.alphaPulse2);

	}
	
	

	// Stop
	else if (this.state === this.state_wave_stop)
	{
	}


	this.renderOffscreen(renderer_);
	this.texture.needsUpdate = true;
	if (bSample)
		this.sampleAndSendValues(renderer_);
}
