//--------------------------------------------------------
function tool(){}

//--------------------------------------------------------
tool.prototype.id = "tool";
tool.prototype.fs = require("fs");
tool.prototype.pathConfigs = __dirname + "/Data/Configs/";
tool.prototype.properties = {};
tool.prototype.ipcRenderer = require('electron').ipcRenderer;

//--------------------------------------------------------
tool.prototype.loadProperties = function( callback )
{
	var fs 	= require('fs');
	var pThis = this;
	fs.readFile(this.getPathFileProperties(), "utf-8", function(err, data)
	{
		pThis.properties = JSON.parse(data);

		if (typeof callback === 'function')
		{
			callback();
		}
	});
}

//--------------------------------------------------------
tool.prototype.saveProperties = function()
{
	var fs 	= require('fs');
	fs.writeFile(this.getPathFileProperties(), JSON.stringify( this.properties ), function (err)
	{
	});
}

//--------------------------------------------------------
tool.prototype.getPathFileProperties = function()
{
	return this.pathConfigs+this.id+".json";
}

//--------------------------------------------------------
module.exports = tool;


