//--------------------------------------------------------
window.$ 		= window.jQuery = require("./Data/Js/jquery-3.2.1.min.js");
var remote 		= require('electron').remote;
var rqcv 		= remote.getGlobal("rqcv");
var leds		= rqcv.leds;
var ipcRenderer = require('electron').ipcRenderer;
var gridview;
var p5Sketch;

//--------------------------------------------------------
$(document).ready( function()
{
	initToolBar();
	selectToolBarItem("etincelles");
	createViewGrid();
	createViewEtincelles();
	createViewKeyboard();

	ipcRenderer.send("indexPupitre-ready",0);
	window.requestAnimationFrame( animate );
});


//--------------------------------------------------------
function animate()
{
	window.requestAnimationFrame( animate );
	if (p5Sketch)
		leds.set( p5Sketch.ledValues );
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
}

//--------------------------------------------------------
function selectToolBarItem(id)
{
	$("#toolBar .toolItem").removeClass("selected");
	$("#toolBar #"+id).addClass("selected");

	$(".view").hide();
	$("#view-"+id).show();
}

//--------------------------------------------------------
function createViewGrid()
{
	gridview.init("#gridView"); // defined in gridview.js
}

//--------------------------------------------------------
function createViewEtincelles()
{
	p5Sketch = new p5(sketchEtincelles);
	p5Sketch.setTouchControl(false);
}

//--------------------------------------------------------
function createViewKeyboard()
{
	keyboardView.init("#view-keyboard");
}

//--------------------------------------------------------
// Events
ipcRenderer.on('gridTouchControl', function (event, value)
{
	if (p5Sketch)
		p5Sketch.setTouchControl(value);
});

ipcRenderer.on('listAnimations', function (event, value)
{
	console.log( toolPupitre )
});



ipcRenderer.on('radiusInfluence', function (event, value)
{
	radiusInfluence = value; // defined in etincellesView.js
});

ipcRenderer.on('radiusHeight', function (event, value)
{
	radiusHeight = value; // defined in etincellesView.js
});

ipcRenderer.on('leds', function (event, value)
{
	if (p5Sketch && value)
		p5Sketch.setLedValues(value);
});










