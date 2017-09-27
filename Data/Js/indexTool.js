//--------------------------------------------------------
window.$ = window.jQuery = require("./Data/Js/jquery-3.2.1.min.js");
var remote 		= require('electron').remote;
var ipcRenderer = require('electron').ipcRenderer;
var TWEEN 		= require('@tweenjs/tween.js');
var rqcv 		= remote.getGlobal("rqcv");

//--------------------------------------------------------
$(document).ready( function()
{
	initToolBar();
	resizeViews();
	initTools();
	initSaveButton();

	selectToolBarItem("pupitre");

	window.requestAnimationFrame( animate );
});

//--------------------------------------------------------
$(window).resize( function()
{
	resizeToolBar();
	resizeViews();
	resizeTools();
});

//--------------------------------------------------------
function animate()
{
	TWEEN.update();
	window.requestAnimationFrame( animate );
}

//--------------------------------------------------------
function resizeToolBar()
{
	$("#toolBar").width( $(window).width() );
}

//--------------------------------------------------------
function resizeViews()
{
	var hToolBar = $("#toolBar").height()+3; // TODO : border ?

	$("#mainView")
	.width( $(window).width() )
	.height( $(window).height() - hToolBar )
	.offset({left : 0,top : hToolBar});

	$(".toolView")
	.width( $(window).width() )
	.height( $(window).height() - hToolBar )

	$("#save-button")
	.offset({left : $(window).width()-74	,top : $(window).height()-34});
}

//--------------------------------------------------------
function selectToolBarItem(id)
{
	$("#toolBar .toolItem").removeClass("selected");
	$("#toolBar #"+id).addClass("selected");
	$(".toolView").hide();
	$("#tool-"+id).show();
}

//--------------------------------------------------------
function initToolBar()
{
	$("#toolBar .toolItem")
	.css({"cursor" : "pointer"})
	.click(function()
	{
		selectToolBarItem( $(this).attr("id") );

	});
	resizeToolBar();
}

//--------------------------------------------------------
function initTools()
{
	console.log("initTools()");
	toolPupitre.init("#tool-pupitre");
//	tool3D.init("#tool-3d");
}

//--------------------------------------------------------
function initSaveButton()
{
	$("#save-button")
	.css({"cursor" : "pointer"})
	.click( function()
	{
		toolPupitre.saveProperties();
//		tool3D.saveProperties();
	} )
}



//--------------------------------------------------------
function resizeTools()
{
//	tool3D.resize();
	toolPupitre.resize();
}

//--------------------------------------------------------
// Events
ipcRenderer.on('setAnimation', function (event, value)
{
	toolPupitre.setAnimationTransition(value);
});

ipcRenderer.on('setAnimationGround', function (event, value)
{
	toolPupitre.setAnimationGroundTransition(value);
});

ipcRenderer.on('clickAnimation', function (event, value)
{
	toolPupitre.clickAnimation(value);
});


//--------------------------------------------------------
ipcRenderer.on('setGridViewInfos', function (event, value)
{
	toolPupitre.setGridViewCamPosNormalized(value.cameraPositionNormalized);
});

//--------------------------------------------------------
ipcRenderer.on('setInteragirMousePos', function (event, value)
{
	toolPupitre.setInteragirMousePos(value);
});








