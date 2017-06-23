function timeline()
{
	this.events = [];
	this.time = 0;
	this.indexCurrent = 0;
	this.callbackDefault = null;


	//--------------------------------------------------------
	this.setCallbackDefault = function(callback)
	{
		this.callbackDefault = callback;
	}

	//--------------------------------------------------------
	this.add = function(event)
	{
		this.events.push( event );
	}

	//--------------------------------------------------------
	this.reset = function()
	{
		this.indexCurrent = 0;
		this.time = 0;
	}


	//--------------------------------------------------------
	this.update = function(dt)
	{
		this.time += dt;

		if (this.indexCurrent < this.events.length)
		{
			var e = this.events[this.indexCurrent];
			if (this.time >= e.time)
			{
				this.indexCurrent = this.indexCurrent+1 ;
				var callback = e.callback ? e.callback : this.callbackDefault;
				if (callback)
					callback(e);
			}
		}
	}
}
