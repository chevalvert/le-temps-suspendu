//--------------------------------------------------------
window.$ 		= window.jQuery = require("./Data/Js/jquery-3.2.1.min.js");
var remote 		= require('electron').remote;
var rqcv 		= remote.getGlobal("rqcv");
var leds		= rqcv.leds;
var ipcRenderer = require('electron').ipcRenderer;
var TWEEN 		= require('@tweenjs/tween.js');

//--------------------------------------------------------
// State machine
// timeout en secondes

var state_stand_by 				= {id : 0, name: "stand_by", animation : "sine"};
var state_grid_scroll 			= {id : 1, name: "grid_scroll", animation : "manual", timeout : 5};
var state_grid_scroll_clicked 	= {id : 2, name: "grid_scroll_clicked", timeout : 20};
var state_interagir 			= {id : 3, name: "interagir", animation : "manual", timeout : 10};
var state_rechercher 			= {id : 4, name: "rechercher", timeout : 5};
var state_rechercher_ok 		= {id : 5, name: "rechercher_ok", timeout : 10}; // TODO : timeout depends on animation sequence
var state_rechercher_fail 		= {id : 6, name: "rechercher_fail"};

// Initial state
var state 						= null;
var stateTime 					= 0.0;

//--------------------------------------------------------
// UI
var gridview;
var p5Sketch;
var views;
var btnInteragir, btnInteragirBack;
var btnRechercher, btnRechercherBack;

//--------------------------------------------------------
// Timer
var time;

//--------------------------------------------------------
// Debug
var debug = true;

//--------------------------------------------------------
$(document).ready( function()
{
	// Init views
	createViewGrid();
	createViewInteragir();
	createViewKeyboard();
	initMenu();
	
	views = $("#views");
	
	// Timer
	time = new timer();
	time.reset();

	// State
	changeState(state_stand_by);

	// Start
	ipcRenderer.send("indexPupitre-ready",0);
	window.requestAnimationFrame( animate );

/*
var coords = {x : 0 , y : 0}
var tween = new TWEEN.Tween(coords)
	.to({ x: 100, y: 100 }, 1000)
	.onUpdate(function() {
		console.log(this.x, this.y);
	})
	.start();
*/

	
});


//--------------------------------------------------------
function setAnimation(which)
{
	ipcRenderer.send('indexPupitre-setAnimation', which);
}

//--------------------------------------------------------
function setView(which)
{
	if (which == "grid")
	{
		views.clearQueue().stop().animate({left : -1280});
		enableViewsMouseEvents(false);
		gridview.mask(false);
		gridview.showOverlayImage(false);

	 
		btnInteragir.clearQueue().fadeTo("fast", 1.0);
		btnRechercher.clearQueue().fadeTo("fast", 1.0);
		btnInteragirBack.clearQueue().fadeTo("fast",0.0, function(){$(this).hide()});
		btnRechercherBack.clearQueue().fadeTo("fast",0.0, function(){$(this).hide()});
		
	}
	else if (which == "interagir")
	{
		views.clearQueue().stop().animate({left : 0});
		enableViewsMouseEvents(true);
		p5Sketch.setTouchControl(true);
		gridview.mask(true);
		gridview.showOverlayImage(false);
		

		btnInteragir.clearQueue().fadeTo("fast", 0.0, function(){$(this).hide()});
		btnRechercher.clearQueue().fadeTo("fast", 0.0, function(){$(this).hide()});
		btnInteragirBack.clearQueue().fadeTo("fast",1.0);
		btnRechercherBack.clearQueue().fadeTo("fast",0.0, function(){$(this).hide()});
	}
	else if (which == "rechercher")
	{
		views.clearQueue().stop().animate({left : -2560});
		enableViewsMouseEvents(true);
		keyboardView.reset();
		gridview.mask(false);
		gridview.showOverlayImage(false);

		btnInteragir.clearQueue().fadeTo("fast", 0.0, function(){$(this).hide()});
		btnRechercher.clearQueue().fadeTo("fast", 0.0, function(){$(this).hide()});
		btnInteragirBack.clearQueue().fadeTo("fast",0.0, function(){$(this).hide()});
		btnRechercherBack.clearQueue().fadeTo("fast",1.0);
	}
}

//--------------------------------------------------------
function enableViewsMouseEvents(is)
{
	views.css("pointer-events", is ? "auto" : "none");
}


//--------------------------------------------------------
function showPhoto(imgId, thumbId)
{
	ipcRenderer.send('indexPupitre-showPhoto', {imgId:imgId, thumbId:thumbId});
}


//--------------------------------------------------------
function changeState(newState)
{
	let bChangeState = false;


	if (state == null)
	{
		if (newState === state_stand_by)
		{
			setView("grid");
			setAnimation(state_stand_by.animation);

			// Notify
			bChangeState = true;
		}
	}
	else
	if (state === state_stand_by)
	{
		if (newState === state_interagir)
		{
			// View
			setView("interagir");
			setAnimation(state_interagir.animation);

			bChangeState = true;
		}
		else if (newState === state_rechercher)
		{
			// View
			setView("rechercher");
		
			bChangeState = true;
		}
		else if (newState === state_grid_scroll)
		{
			bChangeState = true;
			setAnimation(state_grid_scroll.animation);
		}
		else if (newState === state_grid_scroll_clicked)
		{
			bChangeState = true;
		}
	}
	else
	if (state === state_grid_scroll)
	{
		if (newState === state_stand_by)
		{
			bChangeState = true;
			setAnimation(state_stand_by.animation);
		}
		else if (newState === state_interagir)
		{
			bChangeState = true;
			setView("interagir");
			setAnimation(state_interagir.animation);
		}
		else if (newState === state_rechercher)
		{
			bChangeState = true;
			setView("rechercher");
		}
		else if (newState === state_grid_scroll_clicked)
		{
			bChangeState = true;
			gridview.showOverlayImage(true);
			showPhoto( gridview.imageClickedId, gridview.thumbClickedId  ); // TEMP ?
		}

	}
	else
	if (state === state_grid_scroll_clicked)
	{
		if (newState === state_stand_by)
		{
			bChangeState = true;
			setAnimation(state_stand_by.animation);
		}
		else if (newState === state_interagir)
		{
			bChangeState = true;
			setView("interagir");
			setAnimation(state_interagir.animation);
		}
		else if (newState === state_rechercher)
		{
			bChangeState = true;
			setView("rechercher");
		}
		else if (newState === state_grid_scroll)
		{
			bChangeState = true;
			gridview.showOverlayImage(false);
		}
	}
	else
	if (state === state_interagir)
	{
		if (newState === state_stand_by)
		{
			// View
			setView("grid");
			setAnimation(state_stand_by.animation);

			bChangeState = true;
		}
	}
	else
	if (state === state_rechercher)
	{
		if (newState === state_stand_by)
		{
			// View
			setView("grid");
			setAnimation(state_stand_by.animation);

			bChangeState = true;
		}
		else if (newState === state_rechercher_ok)
		{
			setView("grid");
			// TODO : set animation ok here
			gridview.gotoThumb( 0,0, parseInt( Math.random()*899 ) );
		
			bChangeState = true;
		}
		else if (newState === state_rechercher_fail)
		{
			keyboardView.reset();
			// TODO : set animation fail here

			bChangeState = true;
		}

	}

	else
	if (state === state_rechercher_ok)
	{
		if (newState === state_stand_by)
		{
			setView("grid");
			bChangeState = true;
		}
		else if (newState === state_grid_scroll)
		{
			bChangeState = true;
			gridview.showOverlayImage(false);
		}
		else if (newState === state_rechercher)
		{
			setView("rechercher");
			bChangeState = true;
		}
		else if (newState === state_interagir)
		{
			setView("interagir");
			bChangeState = true;
		}
	}



	if (bChangeState)
	{
		state = newState;
		stateTime = 0;
	}
}

//--------------------------------------------------------
function onBtnInteragirClicked()
{
	console.log("onBtnInteragirClicked()");
	changeState( state_interagir );
}

//--------------------------------------------------------
function onBtnInteragirBackClicked()
{
	changeState( state_stand_by );
}

//--------------------------------------------------------
function onBtnRechercherClicked()
{
	changeState( state_rechercher );
}

//--------------------------------------------------------
function onBtnRechercherBackClicked()
{
	changeState( state_stand_by );
}

//--------------------------------------------------------
function activity()
{
	stateTime = 0;
}

//--------------------------------------------------------
function animate(t)
{
// TWEEN.update(t);

	// Timer update
	var dt = time.update();
	stateTime += dt;

	// Handle time outs
	if (state === state_interagir || state === state_rechercher || state === state_grid_scroll || state === state_grid_scroll_clicked || state === state_rechercher_ok)
	{
		if (stateTime >= state.timeout)
			changeState(state_stand_by);
	}
	if (state === state_grid_scroll)
	{
		ipcRenderer.send('indexPupitre-setGridViewCamPos', this.gridview.cameraPositionNormalized);
	}


	// TEMP
	if (p5Sketch)
		leds.set( p5Sketch.ledValues );
 
	if (state)
	{
	 	var strDebug = state.name+" ( "+stateTime.toFixed(1) + "s )";
		if (state === state_grid_scroll || state === state_stand_by)
		{
			strDebug += "<br />img id = " + (this.gridview.imgCam ?  this.gridview.imgCam.id : "-");
			strDebug += "<br />thumb clicked id = " + this.gridview.thumbClickedId;
		}
		
		
		$("#view-debug").html ( strDebug );
	}
	
	// Request a new animation frame
	window.requestAnimationFrame( animate );
}

//--------------------------------------------------------
function initMenu()
{
	btnInteragir = $(".menu-item#interagir");
	btnRechercher = $(".menu-item#rechercher");
	btnInteragirBack = $(".menu-item#back-interagir");
	btnRechercherBack = $(".menu-item#back-rechercher");
	
	btnInteragir.click(onBtnInteragirClicked);
	btnRechercher.click(onBtnRechercherClicked);
	btnInteragirBack.click(onBtnInteragirBackClicked);
	btnRechercherBack.click(onBtnRechercherBackClicked);
}


//--------------------------------------------------------
function onGridViewMouseClick()
{
	changeState(state_grid_scroll_clicked);
}

//--------------------------------------------------------
function onGridViewMouseDragStart()
{
	changeState(state_grid_scroll);
}

//--------------------------------------------------------
function onGridViewMouseDrag()
{
	changeState(state_grid_scroll);
	activity();
}

//--------------------------------------------------------
function onGridViewMouseDragEnd()
{
	console.log("onGridViewMouseDragEnd()");
//	changeState(state_stand_by);
}

//--------------------------------------------------------
function createViewGrid()
{
	gridview.init("#view-grid");
	gridview.cbMouseClick 		=  onGridViewMouseClick.bind(this) ;
	gridview.cbMouseDragStart 	=  onGridViewMouseDragStart.bind(this) ;
	gridview.cbMouseDrag 		=  onGridViewMouseDrag.bind(this) ;
	gridview.cbMouseDragEnd 	=  onGridViewMouseDragEnd.bind(this) ;
	
	// gridview.gotoThumb(0,0,400);
}

//--------------------------------------------------------
function createViewInteragir()
{
	p5Sketch = new p5(sketchInteragir);
}


//--------------------------------------------------------
function onCodeEntered(code)
{
	// TODO : mysql request to check code here
	if (code == "12345")
	{
		changeState(state_rechercher_ok);
	}
	else
	{
		changeState(state_rechercher_fail);
	}
}

//--------------------------------------------------------
function createViewKeyboard()
{
	keyboardView.init("#view-keyboard");
	keyboardView.cbCodeEntered = onCodeEntered.bind(this);
}

//--------------------------------------------------------
// Events
ipcRenderer.on('gridTouchDebug', function (event, value)
{
	if (p5Sketch)
		p5Sketch.setDebug(value);
});

ipcRenderer.on('listAnimations', function (event, value)
{
});

ipcRenderer.on('radiusInfluence', function (event, value)
{
	radiusInfluence = value; // defined in interagirView.js
});

ipcRenderer.on('radiusHeight', function (event, value)
{
	radiusHeight = value; // defined in interagirView.js
});

ipcRenderer.on('leds', function (event, values)
{
//	if (p5Sketch && values)
//		p5Sketch.setLedValues(values);
});










