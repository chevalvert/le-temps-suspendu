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
//
// state_rechercher_ok timeout is triggered by its animation

var state_stand_by 				= {id : 0, name: "stand_by", 			animation : "timeline", 	animationGround : "plasma_ground"};
var state_grid_scroll 			= {id : 1, name: "grid_scroll", 		animation : "manualWaves", 	animationGround : "blank_ground", timeout : 5};
var state_grid_scroll_clicked 	= {id : 2, name: "grid_scroll_clicked", animation : "manualWaves", 	animationGround : "blank_ground", timeout : 5};
var state_interagir 			= {id : 3, name: "interagir", 			animation : "manualWaves", 	animationGround : "manualWaves_ground", timeout : 100};
var state_rechercher 			= {id : 4, name: "rechercher", 			timeout : 15};
var state_rechercher_ok 		= {id : 5, name: "rechercher_ok", 		timeout : 10, panel:-1, position:-1, code : -1, animation : "rechercherOK", animationGround : "rechercherOK_ground"}; // state ended by animation exit event
var state_rechercher_fail 		= {id : 6, name: "rechercher_fail", 	animation : "rechercherFail", animationGround : "rechercherFail_ground", timeout : 10};
// debug mode only -> enable in configuration.json
var state_grid_bot 				= {id : 7, name: "grid_bot", 			animation : "sine", delayChange : 1, bQuery:false};

// Initial state
var state 						= null;
var stateTime 					= 0.0;

// Stats
var stats 						= new stats();

var gridPanelClicked			= -1;
var gridPositionClicked			= -1;

//--------------------------------------------------------
// UI
var gridview;
var p5Sketch;
var views;
var bViewsAnimate = false;
var btnInteragir, btnInteragirBack;
var btnRechercher, btnRechercherBack;

//--------------------------------------------------------
// Timer
var time;

//--------------------------------------------------------
// Debug
var bAppStateDebug = true;

//--------------------------------------------------------
$(document).ready( function()
{
	// Log
	Utils.enableLog( rqcv.getConsoleLog() );

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
	if (rqcv.isBotEnabled())
	{
		state_grid_bot.delayChange = rqcv.configuration.pupitre.bot.delayChange;
		changeState(state_grid_bot);
	}
	else
		changeState(state_stand_by);
	
	
	// Mouse
	if (rqcv.configuration.production)
		document.body.style.cursor = "none";
	

	// Start
	ipcRenderer.send("indexPupitre-ready",0);
	window.requestAnimationFrame( animate );
});


//--------------------------------------------------------
function clickAnimation(posNormThumbClicked)
{
	ipcRenderer.send('indexPupitre-clickAnimation', posNormThumbClicked);
}

//--------------------------------------------------------
function setAnimation(which)
{
	var params = {id : which};
	if (arguments.length == 2)
		params.data = arguments[1];

	ipcRenderer.send('indexPupitre-setAnimation', params);
}


//--------------------------------------------------------
function setAnimationGround(which)
{
	var params = {id : which};
	if (arguments.length == 2)
		params.data = arguments[1];

	ipcRenderer.send('indexPupitre-setAnimationGround', params);
}


//--------------------------------------------------------
function onSetViewStart()
{
	bViewsAnimate = true;
}


//--------------------------------------------------------
function onSetViewCompleted()
{
	bViewsAnimate = false;
}

//--------------------------------------------------------
function setView(which)
{
	var duration = 500;
	var options = {duration : duration, start : onSetViewStart.bind(this), complete : onSetViewCompleted.bind(this)};

	if (which == "grid")
	{
		views.clearQueue().stop().animate({left : -1280}, options);
		enableViewsMouseEvents(false);
		gridview.mask(false,0.025);
		gridview.showOverlayImage(false);

	 
		btnInteragir.clearQueue().fadeTo("fast", 1.0);
		btnRechercher.clearQueue().fadeTo("fast", 1.0);
		btnInteragirBack.clearQueue().fadeTo("fast",0.0, function(){$(this).hide()});
		btnRechercherBack.clearQueue().fadeTo("fast",0.0, function(){$(this).hide()});
	}
	else if (which == "interagir")
	{
		views.clearQueue().stop().animate({left : 0}, options);
		enableViewsMouseEvents(true);
		p5Sketch.setTouchControl(true);
		p5Sketch.showLabel();
		gridview.mask(true);
		gridview.showOverlayImage(false);
		

		btnInteragir.clearQueue().fadeTo("fast", 0.0, function(){$(this).hide()});
		btnRechercher.clearQueue().fadeTo("fast", 0.0, function(){$(this).hide()});
		btnInteragirBack.clearQueue().fadeTo("fast",1.0);
		btnRechercherBack.clearQueue().fadeTo("fast",0.0, function(){$(this).hide()});
		
//		console.log("p5 z-index="+$("#view-p5").css("z-index"));
	}
	else if (which == "rechercher")
	{
		views.clearQueue().stop().animate({left : -2560}, options);
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
function enableGridViewMouseDrag(is)
{
	gridview.enableMouseDrag(is);
}

//--------------------------------------------------------
function gotoPanelWithPosition(panel, position)
{
	gridview.gotoPanelWithPosition( panel, position );
}

//--------------------------------------------------------
function teleportPanelWithPosition(panel, position)
{
	return gridview.teleportPanelWithPosition( panel, position );
}

//--------------------------------------------------------
function enableMenuMouseEvents(is)
{
	$("#menu").css("pointer-events", is ? "auto" : "none");
}

//--------------------------------------------------------
function enableViewsMouseEvents(is)
{
	views.css("pointer-events", is ? "auto" : "none");
}


//--------------------------------------------------------
function showPhoto(panel, position)
{
	ipcRenderer.send('indexPupitre-showPhoto', {panel:panel, position:position});
}

//--------------------------------------------------------
function hidePhoto()
{
	ipcRenderer.send('indexPupitre-hidePhoto', {});
}

//--------------------------------------------------------
function showPhotoList()
{
	ipcRenderer.send('indexPupitre-showPhotoList', {}); // TODO : parameters ?
}


//--------------------------------------------------------
function resetGridPanelPositionInfos()
{
	gridPanelClicked = gridPositionClicked = -1;
}

//--------------------------------------------------------
function enterState(newState)
{
	if (newState === state_stand_by || newState === state_grid_bot)
	{
		setView("grid");
		setAnimation(newState.animation);
		setAnimationGround(newState.animationGround);
		enableGridViewMouseDrag(true);
		showPhotoList();
		gridview.showOverlayImage(false);
	}
	else if (newState === state_grid_scroll_clicked )
	{
		gridview.showOverlayImage(true);
		gridview.setPositionOverlayImageClicked();


		if (gridview.panelClicked != gridPanelClicked || gridview.panelPositionClicked != gridPositionClicked)
		{
			enableGridViewMouseDrag(true);
			showPhoto( gridview.panelClicked, gridview.panelPositionClicked  );
		
			var posNormThumbClicked = gridview.getThumbPositionNormalized(gridview.panelClicked, gridview.panelPositionClicked);

			if (gridPanelClicked == -1)
			{
				setAnimation(state_grid_scroll_clicked.animation,  posNormThumbClicked);
			}

			clickAnimation(posNormThumbClicked);

			gridPanelClicked = gridview.panelClicked;
			gridPositionClicked = gridview.panelPositionClicked;

			stats.save( {panel : gridview.panelClicked, position : gridview.panelPositionClicked}, stats.actionOnClick );


		}
	}
	else if (newState === state_rechercher_ok)
	{
		setView("grid");
		teleportPanelWithPosition( state_rechercher_ok.panel, state_rechercher_ok.position );
		enableGridViewMouseDrag(false);
		
		var thumbPosNormalized = gridview.getThumbPositionNormalized(state_rechercher_ok.panel, state_rechercher_ok.position);
		thumbPosNormalized.panel = state_rechercher_ok.panel; // JS RULEZ ! :-D
		
		setAnimation(state_rechercher_ok.animation, thumbPosNormalized);
		setAnimationGround(state_rechercher_ok.animationGround, thumbPosNormalized);

		hidePhoto();
	}
}

//--------------------------------------------------------
function changeState(newState)
{
	let bChangeState = false;

	// ----------------------------------
	// ----- start
	// ----------------------------------
	if (state == null)
	{
		if (newState === state_stand_by || newState === state_grid_bot)
		{
			// Notify
			bChangeState = true;
		}
	}

	// ----------------------------------
	// ----- state_grid_bot
	// ----------------------------------
	else
	if (state === state_grid_bot)
	{
		if (newState === state_rechercher_ok)
		{
			bChangeState = true;
		}
	}

	// ----------------------------------
	// ----- state_stand_by
	// ----------------------------------
	else
	if (state === state_stand_by)
	{
		if (newState === state_interagir)
		{
			setView("interagir");
			setAnimation(state_interagir.animation);
			setAnimationGround(state_interagir.animationGround);
			enableGridViewMouseDrag(false);

			bChangeState = true;
		}
		else if (newState === state_rechercher)
		{
			setView("rechercher");
			enableGridViewMouseDrag(false);
		
			bChangeState = true;
		}
		else if (newState === state_grid_scroll)
		{
			setAnimation(state_grid_scroll.animation);
			setAnimationGround(state_grid_scroll.animationGround);
			enableGridViewMouseDrag(true);

			bChangeState = true;
		}
		else if (newState === state_grid_scroll_clicked)
		{
			bChangeState = true;
		}
	}



	// ----------------------------------
	// ----- state_grid_scroll
	// ----------------------------------
	else
	if (state === state_grid_scroll)
	{
		if (newState === state_stand_by)
		{
			bChangeState = true;
		}
		else if (newState === state_interagir)
		{
			setView("interagir");
			setAnimation(state_interagir.animation);
			setAnimationGround(state_interagir.animationGround);
			enableGridViewMouseDrag(false);

			bChangeState = true;
		}
		else if (newState === state_rechercher)
		{
			setView("rechercher");
			enableGridViewMouseDrag(false);

			bChangeState = true;
		}
		else if (newState === state_grid_scroll_clicked)
		{
			bChangeState = true;
		}

	}


	// ----------------------------------
	// ----- state_grid_scroll_clicked
	// ----------------------------------
	else
	if (state === state_grid_scroll_clicked)
	{
		if (newState === state_grid_scroll_clicked)
		{
			bChangeState = true;
		}
		else
		if (newState === state_stand_by)
		{
			bChangeState = true;
			resetGridPanelPositionInfos();
		}
		else if (newState === state_interagir)
		{
			setView("interagir");
			setAnimation(state_interagir.animation);
			setAnimationGround(state_interagir.animationGround);
			enableGridViewMouseDrag(false);
			resetGridPanelPositionInfos();

			bChangeState = true;
		}
		else if (newState === state_rechercher)
		{
			setView("rechercher");
			enableGridViewMouseDrag(false);
			resetGridPanelPositionInfos();

			bChangeState = true;
		}
		else if (newState === state_grid_scroll)
		{
			gridview.showOverlayImage(false);
			enableGridViewMouseDrag(true);
			resetGridPanelPositionInfos();

			bChangeState = true;
		}
	}


	// ----------------------------------
	// ----- state_interagir
	// ----------------------------------
	else
	if (state === state_interagir)
	{
		if (newState === state_stand_by)
		{
			bChangeState = true;
			
			var camPos = {x : p5Sketch.mousePositionNormalized.x, y : 1.0 - p5Sketch.mousePositionNormalized.y};
			var camPosOffset = {x:0.05 * Math.random(), y:0.05 * Math.random()}
			gridview.setCameraPositionNorm( camPos, camPosOffset);
//			gridview.mask(false, 0.01);
		}
	}

	// ----------------------------------
	// ----- state_rechercher
	// ----------------------------------
	else
	if (state === state_rechercher)
	{
		if (newState === state_stand_by)
		{
			bChangeState = true;
		}
		else if (newState === state_rechercher_ok)
		{
			bChangeState = true;
		}
		else if (newState === state_rechercher_fail)
		{
			keyboardView.reset();
			keyboardView.shake();
			enableGridViewMouseDrag(false);
			setAnimation(state_rechercher_fail.animation);
			setAnimationGround(state_rechercher_fail.animationGround);


			newState = state_rechercher;

			bChangeState = true;
		}

	}

	// ----------------------------------
	// ----- state_rechercher_ok
	// ----------------------------------
	else
	if (state === state_rechercher_ok)
	{
		if (newState === state_stand_by)
		{
			bChangeState = true;

			if (rqcv.isBotEnabled())
			{
				newState = state_grid_bot;
				state_grid_bot.bQuery = false;
			}

		}
		else if (newState === state_rechercher)
		{
			setView("rechercher");
			enableGridViewMouseDrag(true);

			bChangeState = true;
		}
		else if (newState === state_interagir)
		{
			setView("interagir");
			setAnimation(state_interagir.animation);
			setAnimationGround(state_interagir.animationGround);
			enableGridViewMouseDrag(true);

			bChangeState = true;
		}
	}

	// ----------------------------------
	// ----- state_rechercher_fail
	// ----------------------------------
	else
	if (state === state_rechercher_fail)
	{
		if (newState === state_rechercher)
		{
			bChangeState = true;
		}
	}


	// ----------------------------------
	if (bChangeState)
	{
		state = newState;
		stateTime = 0;
		enterState(state);
	}
}

//--------------------------------------------------------
function onBtnInteragirClicked()
{
	if (bViewsAnimate)
		return;

	changeState( state_interagir );
}

//--------------------------------------------------------
function onBtnInteragirBackClicked()
{
	if (bViewsAnimate)
		return;

	changeState( state_stand_by );
}

//--------------------------------------------------------
function onBtnRechercherClicked()
{
	if (bViewsAnimate)
		return;

	changeState( state_rechercher );
}

//--------------------------------------------------------
function onBtnRechercherBackClicked()
{
	if (bViewsAnimate)
		return;

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
	// Timer update
	var dt = time.update();
	stateTime += dt;
	TWEEN.update();

	// Handle time outs
	if (state === state_interagir || state === state_rechercher || state === state_grid_scroll || state === state_grid_scroll_clicked || state === state_rechercher_fail /*|| state === state_rechercher_ok*/)
	{
		if (stateTime >= state.timeout)
			changeState(state_stand_by);
	}

	if (state === state_grid_bot)
	{
		if (stateTime >= state.delayChange)
		{
			if (state.bQuery == false)
			{
				state.bQuery = true;
				selectRandomCode(); // Call onCodeEntered to change state to rechercher_ok
			}
		}
	}

	
	if (state === state_interagir)
	{
		ipcRenderer.send('indexPupitre-setInteragirMousePos', p5Sketch.mousePositionNormalized);
	
		// "Fake" camera speed !
		var camPos = {
			x : p5Sketch.mousePositionNormalized.x * this.gridview.gridWidth,
			y : p5Sketch.mousePositionNormalized.y * this.gridview.gridHeight
			}

		var camPosPrev = {
			x : p5Sketch.mousePositionNormalizedPrev.x * this.gridview.gridWidth,
			y : p5Sketch.mousePositionNormalizedPrev.y * this.gridview.gridHeight
			}


		var cameraSpeed = Math.dist(camPos.x,camPos.y,camPosPrev.x,camPosPrev.y);
		cameraSpeed /= dt;


	  ipcRenderer.send('indexPupitre-setGridCemeraSpeed',{cameraSpeed : cameraSpeed});
	}
	else
	{
	  // send gridview infos to main
	  // can be distributed to any windows (tool (for animations that need those infos), photo for cam speed for example)
	  ipcRenderer.send(
	  'indexPupitre-setGridViewInfos',
	  {
		  panel						:	this.gridview.panelOver,
		  position					:	this.gridview.positionOver,
		  cameraPosition 			: 	this.gridview.cameraPosition,
		  cameraPositionNormalized  :	this.gridview.cameraPositionNormalized,
		  cameraSpeed 				: 	this.gridview.cameraSpeed,
		  thumbSize 				: 	this.gridview.thumbSize
	   });
	 }

	// Updates
	gridview.update(dt);
	keyboardView.update(dt);

	// render
	gridview.render();
 
 	// Debug
 	renderDebug();
	
	// Request a new animation frame
	window.requestAnimationFrame( animate );
}

//--------------------------------------------------------
function renderDebug()
{
	if (bAppStateDebug)
	{
	 if (state)
	 {
		 var strDebug = state.name+" ( "+stateTime.toFixed(1) + "s )";
		 strDebug += "<br />animation ceil  = " + (state ? state.animation : "-");
		 strDebug += "<br />animation ground = " + (state ? state.animationGround : "-" );
		 if (state === state_grid_scroll || state === state_grid_scroll_clicked  || state === state_stand_by)
		 {
			 strDebug += "<br />panel = " + (this.gridview.panelOver > -1 ?  this.gridview.panelOver : "-");
			 strDebug += "<br />position = " + (this.gridview.positionOver > -1 ?  this.gridview.positionOver : "-");
			 strDebug += "<br />(imgI,imgJ) = (" + this.gridview.imgI + "," + this.gridview.imgJ + ")";
			 strDebug += "<br />(thumbI,thumbJ) = (" + this.gridview.thumbI + "," + this.gridview.thumbJ + ")";
			 strDebug += "<br />(thumbPos.x,thumbPos.y) = (" + this.gridview.thumbPos.x.toFixed(1) + "," + this.gridview.thumbPos.y.toFixed(1) + ")";
			 strDebug += "<br />camSpeed = " + this.gridview.cameraSpeed.toFixed(1);
			 strDebug += "<br />camPos = (" + this.gridview.cameraPosition.x.toFixed(1)+"," + this.gridview.cameraPosition.y.toFixed(1) + ")";
			 strDebug += "<br />camPosNorm = (" + this.gridview.cameraPositionNormalized.x.toFixed(1)+"," + this.gridview.cameraPositionNormalized.y.toFixed(1) + ")";
		 }
		 if (state === state_grid_scroll_clicked)
		 {
			 strDebug += "<br />panel clicked = " + this.gridview.panelClicked;
			 strDebug += "<br />position clicked = " + this.gridview.panelPositionClicked;
		 }
		 if (state === state_interagir)
		 {
			 strDebug += "<br />(mouseX, mouseY) = ("+p5Sketch.mousePositionNormalized.x.toFixed(2)+","+p5Sketch.mousePositionNormalized.y.toFixed(2)+")";
			 strDebug += "<br />camPos = (" + this.gridview.cameraPosition.x.toFixed(1)+"," + this.gridview.cameraPosition.y.toFixed(1) + ")";
		 }
		 if (state === state_rechercher_ok)
		 {
			 strDebug += "<br />code = "+state_rechercher_ok.code;
			 strDebug += "<br />(panel, position) = ("+state_rechercher_ok.panel+","+state_rechercher_ok.position+")";
		 }
		 
		 $("#view-debug").html ( strDebug );
	 }
	}
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
	
	if (rqcv.configuration.pupitre.menu.transition)
	{
	  btnInteragir.mouseover(onBtnMouseDown)
	  btnInteragir.mouseout(onBtnMouseUp)
	  btnInteragir.mousedown(onBtnMouseDown)
	  btnInteragir.mouseup(onBtnMouseUp)

	  btnRechercher.mouseover(onBtnMouseDown)
	  btnRechercher.mouseout(onBtnMouseUp)
	  btnRechercher.mousedown(onBtnMouseDown)
	  btnRechercher.mouseup(onBtnMouseUp)

	  btnInteragirBack.mouseover(onBtnMouseDown)
	  btnInteragirBack.mouseout(onBtnMouseUp)
	  btnInteragirBack.mousedown(onBtnMouseDown)
	  btnInteragirBack.mouseup(onBtnMouseUp)

	  btnRechercherBack.mouseover(onBtnMouseDown)
	  btnRechercherBack.mouseout(onBtnMouseUp)
	  btnRechercherBack.mousedown(onBtnMouseDown)
	  btnRechercherBack.mouseup(onBtnMouseUp)
	}
		
	
	if (rqcv.configuration.production == false)
		$(".menu-item").css("cursor", "pointer")
}

function onBtnMouseDown()
{
	$(this).addClass("mouse-down").removeClass("mouse-up");
}

function onBtnMouseUp()
{
	$(this).addClass("mouse-up").removeClass("mouse-down");
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
	enableMenuMouseEvents(false); // continue drag event on menu
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
	enableMenuMouseEvents(true);
}

//--------------------------------------------------------
function createViewGrid()
{
	gridview.init("#view-grid");
	gridview.cbMouseClick 		=  onGridViewMouseClick.bind(this) ;
	gridview.cbMouseDragStart 	=  onGridViewMouseDragStart.bind(this) ;
	gridview.cbMouseDrag 		=  onGridViewMouseDrag.bind(this) ;
	gridview.cbMouseDragEnd 	=  onGridViewMouseDragEnd.bind(this) ;
}

//--------------------------------------------------------
function createViewInteragir()
{
	// p5.js sketch
	p5Sketch = new p5(sketchInteragir);
	
	// Center "interagir" label
	var label = $("#view-interagir #view-label");
	var wLabel = label.width();
	var hLabel = label.height();
	label.css({"top" : 0.5 * ($(window).height()-hLabel) - 26, "left" : 0.5 * ($(window).width()-wLabel)});
}

//--------------------------------------------------------
function checkSpecialCode(code)
{
	var special_codes = rqcv.configuration.db_rq.special_codes;
	for (var i=0 ; i<special_codes.length; i++)
	{
		if (special_codes[i].code == code)
			return special_codes[i];
	}
	return null;
}

//--------------------------------------------------------
function onCodeEntered(code)
{
   var query = "";
   var specialCode = checkSpecialCode(code);

   if (specialCode != null)
   {
	   query = "SELECT * FROM "+ rqcv.configuration.db_rq.table +" WHERE panel="+specialCode.panel+" AND position="+specialCode.position;
   }
   else
   {
	   query = "SELECT * FROM "+ rqcv.configuration.db_rq.table +" WHERE code='"+code+"'";
   }

   state_rechercher_ok.code 		= code;
   state_rechercher_ok.panel 		= "";
   state_rechercher_ok.position 	= "";


   rqcv.connection.query(query, function (error, results, fields)
   {
		if (error == null)
		{
			// Only one result
			if (results.length == 1)
			{
				state_rechercher_ok.panel 		= results[0].panel;
				state_rechercher_ok.position 	= results[0].position;
			
				changeState(state_rechercher_ok);
				stats.save( results[0], stats.actionOnCodeEntered);
			}
			else
			{
				changeState(state_rechercher_fail);
			}
		}
   });
	
}

//--------------------------------------------------------
function onCodeCloseEntered()
{
	ipcRenderer.send("indexPupitre-quitApp", 0);
}


//--------------------------------------------------------
function selectRandomCode()
{
   var query = "SELECT code FROM "+ rqcv.configuration.db_rq.table +" WHERE `code` <> \"NULL\" ORDER BY RAND() LIMIT 1";

   rqcv.connection.query(query, function (error, results, fields)
   {
		var code = null;

		if (error == null)
		{
			if (results.length == 1)
			{
				// console.log("code = " + results[0].code)
				onCodeEntered(results[0].code);
			}
		 }
   });
}


//--------------------------------------------------------
function createViewKeyboard()
{
	keyboardView.init("#view-keyboard");
	keyboardView.cbCodeEntered = onCodeEntered.bind(this);
	keyboardView.cbCodeCloseEntered = onCodeCloseEntered.bind(this);
}

//--------------------------------------------------------
// Events
ipcRenderer.on('appStateDebug', function (event, value)
{
	bAppStateDebug = value;
	if (bAppStateDebug == false)
		$("#view-debug").hide();
	else
		$("#view-debug").show();
});

//--------------------------------------------------------
ipcRenderer.on('gridFactorMouseDrag', function(event, value)
{
	if (gridview)
		gridview.factorMouseDrag = value;
});


//--------------------------------------------------------
ipcRenderer.on('gridFactorCamSpeed', function(event, value)
{
	if (gridview)
		gridview.cameraSpeedFactorDrag = value;
});

//--------------------------------------------------------
ipcRenderer.on('gridTouchDebug', function (event, value)
{
	if (p5Sketch)
		p5Sketch.setDebug(value);
});

//--------------------------------------------------------
ipcRenderer.on('listAnimations', function (event, value)
{
});

//--------------------------------------------------------
ipcRenderer.on('radiusInfluence', function (event, value)
{
	radiusInfluence = value; // defined in interagirView.js
});

//--------------------------------------------------------
ipcRenderer.on('radiusHeight', function (event, value)
{
	radiusHeight = value; // defined in interagirView.js
});

//--------------------------------------------------------
ipcRenderer.on('leds', function(event, value)
{
	if (p5Sketch)
		p5Sketch.setLedValues( value );
});

//--------------------------------------------------------
ipcRenderer.on('ledsValueMin', function(event, value)
{
	if (p5Sketch)
		p5Sketch.setLedValueMin( value );
});


//--------------------------------------------------------
ipcRenderer.on('ledsValueMax', function(event, value)
{
	if (p5Sketch)
		p5Sketch.setLedValueMax( value );
});

//--------------------------------------------------------
ipcRenderer.on('animationRechercherOK_setPhoto', function(event, value)
{
	if (state === state_rechercher_ok)
	{
		showPhoto( state_rechercher_ok.panel, state_rechercher_ok.position );
	}
});

//--------------------------------------------------------
ipcRenderer.on('animationRechercherOK_done', function(event, value)
{
	if (state === state_rechercher_ok)
	{
		changeState(state_stand_by);
	}
});












