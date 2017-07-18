//--------------------------------------------------------
window.$ 		= window.jQuery = require("./Data/Js/jquery-3.2.1.min.js");
var ipcRenderer = require('electron').ipcRenderer;

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
	photoView.setPhoto(info);
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

ipcRenderer.on('showPhotoList', function (event, value)
{
	showPhotoList(value);
});


ipcRenderer.on('photoScale', function (event, value)
{
	photoView.setPhotoSize( value )
});

