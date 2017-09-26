//--------------------------------------------------------
window.$ 		= window.jQuery = require("./Data/Js/jquery-3.2.1.min.js");
var ipcRenderer = require('electron').ipcRenderer;
var remote 		= require('electron').remote;
var rqcv 		= remote.getGlobal("rqcv");

var pathFolderFigure 	= rqcv.configuration.db_rq.folder_figure;
var pathFolderWeb 		= rqcv.configuration.db_rq.folder_web;

// Current user position on grid
// So that we can change photo list on the run
var userPosCurrent 	= {gridPanel : -1, gridPosition : -1, gridCameraPosition : {}}
var userPosPrevious = {gridPanel : -1, gridPosition : -1, gridCameraPosition : {}}

var gridThumbSize = 0;

//--------------------------------------------------------
$(document).ready( function()
{
	photoView.init("#photo");
	ipcRenderer.send("indexPhoto-ready",0);

	if (rqcv.configuration.production)
		document.body.style.cursor = "none";
});

//--------------------------------------------------------
$(window).resize( function()
{
	photoView.resize();
});


//--------------------------------------------------------
function getQuery(panel, position)
{
	var s = "SELECT * FROM "+ rqcv.configuration.db_rq.table +" WHERE panel="+panel+" AND position="+position;
	return s;
}

//--------------------------------------------------------
function showPhoto(panel, position)
{
   rqcv.connection.query( getQuery(panel, position), function (error, results, fields)
   {
		if (error == null && results.length == 1)
		{
		   var pathFile = getPathPhoto( results[0].filename )
		   photoView.setPhoto( pathFile );

		   console.log("showing '" + pathFile + "'");
		}
   });
}

//--------------------------------------------------------
function addPhotoToList(panel, position)
{
   rqcv.connection.query( getQuery(userPosCurrent.gridPanel, userPosCurrent.gridPosition), function (error, results, fields)
   {
	   if (error == null && results.length == 1)
	   {
		  var pathFile = getPathPhoto( results[0].filename )
		  //console.log(pathFile);
		  
		  photoView.addPhotoToList(pathFile);
	   }
   });
}

//--------------------------------------------------------
function getPathPhoto(filename)
{
	var pathFolder = isFilenameWeb(filename) ? pathFolderWeb : pathFolderFigure;
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
	showPhoto(value.panel, value.position);
});

//--------------------------------------------------------
ipcRenderer.on('showPhotoList', function (event, value)
{
	showPhotoList(value);
});


//--------------------------------------------------------
ipcRenderer.on('photoInterval', function (event, value)
{
	photoView.setIntervalChangePhoto( value )
});


//--------------------------------------------------------
ipcRenderer.on('photoScale', function (event, value)
{
	photoView.setPhotoSize( value )
});

//--------------------------------------------------------
ipcRenderer.on('photoOffsetCenterx', function (event, value)
{
	photoView.setPhotoPositionX( value )
});

//--------------------------------------------------------
ipcRenderer.on('photoOffsetCentery', function (event, value)
{
	photoView.setPhotoPositionY( value )
});

//--------------------------------------------------------
ipcRenderer.on('setGridViewPanelPosition', function (event, value)
{
	// init values
	if (userPosCurrent.gridPanel == -1 && userPosPrevious.gridPanel == -1)
	{
		userPosCurrent.gridPanel 			= userPosPrevious.gridPanel 	= value.panel;
		userPosCurrent.gridPosition 		= userPosPrevious.gridPosition 	= value.position;
		userPosCurrent.gridCameraPosition.x = userPosPrevious.gridCameraPosition.x = value.cameraPosition.x;
		userPosCurrent.gridCameraPosition.y = userPosPrevious.gridCameraPosition.y = value.cameraPosition.y;
		
		gridThumbSize = value.thumbSize;
	}
	else
	{
		userPosCurrent.gridCameraPosition.x = value.cameraPosition.x;
		userPosCurrent.gridCameraPosition.y = value.cameraPosition.y;
		userPosCurrent.gridPanel = value.panel;
		userPosCurrent.gridPosition = value.position;
		
		if (Math.dist(
				userPosCurrent.gridCameraPosition.x,userPosCurrent.gridCameraPosition.y,
				userPosPrevious.gridCameraPosition.x,userPosPrevious.gridCameraPosition.y
			) >= 4*gridThumbSize)
	   	{
			userPosPrevious.gridCameraPosition.x = userPosCurrent.gridCameraPosition.x;
			userPosPrevious.gridCameraPosition.y = userPosCurrent.gridCameraPosition.y;
		
			console.log( " ----> load new photo("+userPosCurrent.gridPanel+","+userPosCurrent.gridPosition+")" );

			addPhotoToList( userPosCurrent.gridPanel, userPosCurrent.gridPosition );
		}

	}

	photoView.setCameraSpeed( value.cameraSpeed );
});





