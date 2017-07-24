//--------------------------------------------------------
window.$ 		= window.jQuery = require("./Data/Js/jquery-3.2.1.min.js");
var ipcRenderer = require('electron').ipcRenderer;
var remote 		= require('electron').remote;
var rqcv 		= remote.getGlobal("rqcv");

var pathFolderFigure 	= rqcv.configuration.db_rq.folder_figure;
var pathFolderWeb 		= rqcv.configuration.db_rq.folder_web;

//--------------------------------------------------------
$(document).ready( function()
{
	photoView.init("#photo");
	ipcRenderer.send("indexPhoto-ready",0);
});

//--------------------------------------------------------
$(window).resize( function()
{
	photoView.resize();
});


//--------------------------------------------------------
function showPhoto(info)
{
   var query = "SELECT * FROM "+ rqcv.configuration.db_rq.table +" WHERE panel="+info.panel+" AND position="+info.position;

   rqcv.connection.query(query, function (error, results, fields)
   {
		if (error == null)
		{
			// Only one result
			if (results.length == 1)
			{
			   var pathFile = getPathPhoto( results[0].filename )
			   photoView.setPhoto( pathFile );

			   console.log("showing '" + pathFile + "'");
			}
		}
   });
}

//--------------------------------------------------------
function getPathPhoto(filename)
{
	var pathFolder = isFilenameWeb(filename) ? pathFolderWeb : pathFolderFigure;;
	return __dirname+"/"+pathFolder + filename
}

//--------------------------------------------------------
function isFilenameWeb(filename)
{
  return filename.indexOf('_') > 0;
}

//--------------------------------------------------------
function showPhotoList(info)
{
	photoView.setPhotoList(info);
}


//--------------------------------------------------------
ipcRenderer.on('showPhoto', function (event, value)
{
	showPhoto(value);
});

//--------------------------------------------------------
ipcRenderer.on('showPhotoList', function (event, value)
{
	showPhotoList(value);
});


//--------------------------------------------------------
ipcRenderer.on('photoScale', function (event, value)
{
	photoView.setPhotoSize( value )
});

