function timer()
{
	this.time		= 0;
	this.timeNow 	= Date.now();
	this.timeBefore = this.timeNow;
	this.dt 		= 0;
	
	this.update = function()
	{
		this.timeNow = Date.now();
		this.dt = (this.timeNow - this.timeBefore) / 1000.0;
		this.timeBefore = this.timeNow;

		this.time += this.dt;

		return this.dt;
	}
}
