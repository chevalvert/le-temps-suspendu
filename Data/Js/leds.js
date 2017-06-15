var leds = function(){}

leds.prototype.init = function(configuration)
{
	console.log( "leds.init()" );
	console.log( " - host="+configuration.artnet.host );

	this.artnet = require('artnet')({host: configuration.artnet.host});
	

	this.set = function(a)
	{
		this.artnet.set(a);
	}


	this.reset = function()
	{
		var a = [];
		for(var i=0; i<255;i++)
			a[i]=0;
		this.set(a);
	}
	

	return this;
}

module.exports = new leds();
