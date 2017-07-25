//--------------------------------------------------------
function tool(){}

//--------------------------------------------------------
tool.prototype.id = "tool";
tool.prototype.fs = require("fs");
tool.prototype.pathConfigs = __dirname + "/Data/Configs/";
tool.prototype.properties = {};
tool.prototype.ipcRenderer = require('electron').ipcRenderer;

//--------------------------------------------------------
tool.prototype.loadProperties = function()
{
	var fs 	= require('fs');

	var p = this.getPathFileProperties();
	if (this.fs.existsSync(p))
	{
		this.properties = JSON.parse( this.fs.readFileSync(p).toString() );
//		 console.log( this.properties )
	}
	else
	{
		console.log("cannot find \""+p+"\"");
	}
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


