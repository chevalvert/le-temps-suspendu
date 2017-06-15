//--------------------------------------------------------
window.$ = window.jQuery = require("./Data/Js/jquery-3.2.1.min.js");
var ipcRenderer = require('electron').ipcRenderer;

//--------------------------------------------------------
$(document).ready( function()
{
	initToolBar();
	resizeViews();

	initTools();

	selectToolBarItem("pupitre");
});

//--------------------------------------------------------
$(window).resize( function()
{
	resizeToolBar();
	resizeViews();
	resizeTools();
});

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
	tool3D.init("#tool-3d");
}

//--------------------------------------------------------
function resizeTools()
{
	tool3D.resize();
}


