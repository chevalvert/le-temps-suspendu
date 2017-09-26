// --------------------------------------------------
// if inspector in window devtools does not work -> https://github.com/electron/electron/issues/8876#issuecomment-296445185

// --------------------------------------------------
const {app, BrowserWindow, ipcMain} 		= require('electron');
const electron 								= require('electron');
const windowManager 						= require('electron-window-manager');
var mysql 									= require('mysql');
var fs 										= require('fs'); // file system
var leds									= require(__dirname+'/Data/Js/leds.js')

// --------------------------------------------------
// Configuration
let configuration;
let configurationName = "configuration.json";

// Displays
let externalDisplay;

// Windows
let mainWindow, toolWindow, photoWindow;

// mySQL
let connection;

// Flags
let bIndexPupitreReady = false;
let bIndexPhotoReady = false;

// --------------------------------------------------
app.on('ready', () =>
{
	loadConfiguration("Data/Configs/"+configurationName);
});

// --------------------------------------------------
app.on('window-all-closed', function()
{
	if (leds)
		leds.close();

	if (connection)
		connection.end();

	mainWindow = null;
	toolWindow = null;
});


// --------------------------------------------------
function loadConfiguration(pathRel)
{
	fs.readFile(getFilePathAbsolute(pathRel), 'utf-8', (err, data) =>
	{
        if(err)
		{
        	console.log("An error ocurred reading the file :" + err.message);
            return;
        }
		configuration = JSON.parse(data);
		onConfigLoaded();
    });
}

// --------------------------------------------------
function getExternalDisplay()
{
	let displays = electron.screen.getAllDisplays();
 	let externalDisplay = displays.find( (display) => {
		return display.bounds.x !== 0 || display.bounds.y !== 0
  	})
	return externalDisplay;
}

// --------------------------------------------------
function openToolWindow()
{

   // Tool window
   if (configuration.tool.enable && toolWindow == null)
   {
	 	let externalDisplay = getExternalDisplay();

		var w = configuration.production ? 1 : configuration.tool.w;
		var h = configuration.production ? 1 : configuration.tool.h;

	
	   toolWindow = windowManager.open('tool', 'Le temps suspendu : outils', getFile('indexTool.html'),{},
	   {
		   'x' : externalDisplay ? externalDisplay.bounds.x : configuration.tool.x,
		   'y' : externalDisplay ? externalDisplay.bounds.y : configuration.tool.y,
		   'width' : w,
		   'height' : h,
		   }, configuration.production ? false : configuration.tool.devtools);
   }
}


// --------------------------------------------------
function onConfigLoaded()
{
	// External displays
 	let externalDisplay = getExternalDisplay();

	// MySQL
	// console.log("create connection");
	connection = mysql.createConnection( configuration.db_rq );
	connection.connect();

	// Windows
	windowManager.init();
	
	// Main window
	mainWindow = windowManager.open('home', 'Le temps suspendu : pupitre', getFile('indexPupitre.html'), {},
	{
		'width' : configuration.pupitre.w,
		'height' : configuration.pupitre.h,
		'x' : 0,
		'y' : 0,
		'fullscreen' : configuration.production ? true : false,
		'frame' : false
	}, configuration.production ? false : configuration.pupitre.devtools);

	// Photo  window
	photoWindow = windowManager.open('photo', 'Le temps suspendu : photo', getFile('indexPhoto.html'), {},
	{
		'width' : configuration.photo.w,
		'height' : configuration.photo.h,
		'x' : externalDisplay ? externalDisplay.bounds.x : configuration.photo.x,
		'y' : externalDisplay ? externalDisplay.bounds.y : configuration.photo.y,
		'fullscreen' : configuration.production ? true : false,
		'frame' : false
	}, configuration.production ? false : configuration.photo.devtools);


	// Artnet
	leds.init( configuration );
	leds.reset();

	// save some objects on global
	global.rqcv = {};
	global.rqcv.configuration = configuration;
	global.rqcv.connection = connection;
	global.rqcv.leds = leds;
	
	
	// --------------------------------------------------
	// events from windows
	ipcMain.on('toolPupitre-appStateDebug', (event, value) =>
	{
		if (mainWindow)
			mainWindow.content().send('appStateDebug', value);
	})

	// --------------------------------------------------
	ipcMain.on('toolPupitre-gridFactorMouseDrag', (event, value) =>
	{
		if (mainWindow)
			mainWindow.content().send('gridFactorMouseDrag', value);
	})

	// --------------------------------------------------
	ipcMain.on('toolPupitre-gridFactorCamSpeed', (event, value) =>
	{
		if (mainWindow)
			mainWindow.content().send('gridFactorCamSpeed', value);
	})


	// --------------------------------------------------
	ipcMain.on('toolPupitre-gridTouchDebug', (event, value) =>
	{
		if (mainWindow)
			mainWindow.content().send('gridTouchDebug', value);
	})
	
	// --------------------------------------------------
	ipcMain.on('toolPupitre-listAnimations', (event, value) =>
	{
		if (mainWindow)
			mainWindow.content().send('listAnimations', value);
	})

	
	// --------------------------------------------------
	ipcMain.on('toolPupitre-radiusInfluence', (event, value) =>
	{
		if (mainWindow)
			mainWindow.content().send('radiusInfluence', value);
	})

	// --------------------------------------------------
	ipcMain.on('toolPupitre-radiusHeight', (event, value) =>
	{
		if (mainWindow)
			mainWindow.content().send('radiusHeight', value);
	})

	// --------------------------------------------------
	ipcMain.on('toolPupitre-ledGreyOut', (event, value) =>
	{
		if (mainWindow)
			mainWindow.content().send('ledGreyOut', value);
	})
	

	// --------------------------------------------------
	ipcMain.on('toolPupitre-photoScale', (event, value) =>
	{
		if (photoWindow)
			photoWindow.content().send('photoScale', value);
	})

	// --------------------------------------------------
	ipcMain.on('toolPupitre-photoInterval', (event, value) =>
	{
		if (photoWindow)
			photoWindow.content().send('photoInterval', value);
	})

	// --------------------------------------------------
	ipcMain.on('toolPupitre-photoOffsetCenterx', (event, value) =>
	{
		if (photoWindow)
			photoWindow.content().send('photoOffsetCenterx', value);
	})

	// --------------------------------------------------
	ipcMain.on('toolPupitre-photoOffsetCentery', (event, value) =>
	{
		if (photoWindow)
			photoWindow.content().send('photoOffsetCentery', value);
	})

	

	// --------------------------------------------------
	ipcMain.on('animationRechercherOK_setPhoto', (event, value) =>
	{
		if (mainWindow)
			mainWindow.content().send('animationRechercherOK_setPhoto', value)
	});
	
	// --------------------------------------------------
	ipcMain.on('animationRechercherOK_done', (event, value) =>
	{
		if (mainWindow)
			mainWindow.content().send('animationRechercherOK_done', value)
	});

	// --------------------------------------------------
	// TODO : get called when exiting
	ipcMain.on('animation-leds', (event, value) =>
	{
		try
		{
			leds.updateCeil( value );
				if (mainWindow)
			mainWindow.content().send('leds', value);
		} catch (e){}
	})

	// --------------------------------------------------
	ipcMain.on('animation-floor-leds', (event, value) =>
	{
		leds.updateFloor( value );
	})

	// --------------------------------------------------
	ipcMain.on('indexPhoto-ready', (event, value) =>
	{
		bIndexPhotoReady = true;
		openToolWindow();
	});
	
	// --------------------------------------------------
	ipcMain.on('indexPupitre-ready', (event, value) =>
	{
		bIndexPupitreReady = true;
		openToolWindow();
	});

	// --------------------------------------------------
	ipcMain.on('indexPupitre-setAnimation', (event, value) =>
	{
		if (toolWindow)
		{
			toolWindow.content().send('setAnimation', value);
		}
	});

	// --------------------------------------------------
	ipcMain.on('indexPupitre-setAnimationGround', (event, value) =>
	{
		if (toolWindow)
		{
			toolWindow.content().send('setAnimationGround', value);
		}
	});

	// --------------------------------------------------
	ipcMain.on('indexPupitre-setGridViewCamPos', (event, value) =>
	{
		if (toolWindow)
		{
			toolWindow.content().send('setGridViewCamPos', value);
		}
	});

	// --------------------------------------------------
	ipcMain.on('indexPupitre-setGridViewPanelPosition', (event, value) =>
	{
		if (photoWindow)
		{
			photoWindow.content().send('setGridViewPanelPosition', value);
		}
	});
	
	// --------------------------------------------------
	ipcMain.on('indexPupitre-setInteragirMousePos', (event, value) =>
	{
		if (toolWindow)
		{
			toolWindow.content().send('setInteragirMousePos', value);
		}
	});

	// --------------------------------------------------
	ipcMain.on('indexPupitre-showPhoto', (event, value) =>
	{
		try
		{
			if (photoWindow)
			{
				photoWindow.content().send('showPhoto', value);
			}
		} catch(e){}
	});

	// --------------------------------------------------
	ipcMain.on('indexPupitre-showPhotoList', (event, value) =>
	{
		if (photoWindow)
		{
			photoWindow.content().send('showPhotoList', value);
		}
	});

	
	// --------------------------------------------------
	ipcMain.on('toolPupitre-ledsLuminosityMin', (event, value) =>
	{
		leds.setValueAppliedMin(value);
	});
	
	// --------------------------------------------------
	ipcMain.on('toolPupitre-ledsLuminosityMax', (event, value) =>
	{
		leds.setValueAppliedMax(value);
	});


	// --------------------------------------------------
	ipcMain.on('toolPupitre-ledsLuminosityMinFloor', (event, value) =>
	{
		leds.setValueAppliedMinFloor(value);
	});
	
	// --------------------------------------------------
	ipcMain.on('toolPupitre-ledsLuminosityMaxFloor', (event, value) =>
	{
		leds.setValueAppliedMaxFloor(value);
	});


	// --------------------------------------------------
	ipcMain.on('toolPupitre-ledsValueMin', (event, value) =>
	{
		if (mainWindow)
			mainWindow.content().send('ledsValueMin', value);
	});
	
	// --------------------------------------------------
	ipcMain.on('toolPupitre-ledsValueMax', (event, value) =>
	{
		if (mainWindow)
			mainWindow.content().send('ledsValueMax', value);
	});

}

// --------------------------------------------------
function getFilePathAbsolute(pathRel)
{
	return __dirname + '/' + pathRel;
}

// --------------------------------------------------
function getFile(pathRel)
{
	return 'file://' + getFilePathAbsolute(pathRel);
}
