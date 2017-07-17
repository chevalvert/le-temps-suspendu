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
function onConfigLoaded()
{
	// External displays
	let displays = electron.screen.getAllDisplays()
 	externalDisplay = displays.find((display) => {
    	return display.bounds.x !== 0 || display.bounds.y !== 0
  	})

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
		'x' : externalDisplay ? externalDisplay.bounds.x : 0,
		'y' : externalDisplay ? externalDisplay.bounds.y : 0,
		'frame' : false
	}, configuration.pupitre.devtools);

	// Photo  window
	
	photoWindow = windowManager.open('photo', 'Le temps suspendu : photo', getFile('indexPhoto.html'), {},
	{
		'width' : configuration.photo.w,
		'height' : configuration.photo.h,
		'x' : 800,
		'y' : 600,
		'frame' : false
	}, configuration.photo.devtools);


	// Artnet
	leds.init( configuration );
	leds.reset();

	// save some objects on global
	global.rqcv = {};
	global.rqcv.connection = connection;
	global.rqcv.leds = leds;
	
	// events from windows
	ipcMain.on('toolPupitre-gridTouchDebug', (event, value) =>
	{
		if (mainWindow)
			mainWindow.content().send('gridTouchDebug', value);
	})
	
/*	ipcMain.on('toolPupitre-gridTouchControl', (event, value) =>
	{
		if (mainWindow)
			mainWindow.content().send('gridTouchControl', value);
	})
*/

	ipcMain.on('toolPupitre-listAnimations', (event, value) =>
	{
		if (mainWindow)
			mainWindow.content().send('listAnimations', value);
	})

	
	ipcMain.on('toolPupitre-radiusInfluence', (event, value) =>
	{
		if (mainWindow)
			mainWindow.content().send('radiusInfluence', value);
	})

	ipcMain.on('toolPupitre-radiusHeight', (event, value) =>
	{
		if (mainWindow)
			mainWindow.content().send('radiusHeight', value);
	})

	ipcMain.on('toolPupitre-ledGreyOut', (event, value) =>
	{
		if (mainWindow)
			mainWindow.content().send('ledGreyOut', value);
	})
	

	ipcMain.on('toolPupitre-photoScale', (event, value) =>
	{
		if (photoWindow)
			photoWindow.content().send('photoScale', value);
	})
	

	ipcMain.on('animation-leds', (event, value) =>
	{
		if (mainWindow && mainWindow.content() != null)
			mainWindow.content().send('leds', value);
	})

	ipcMain.on('animation-floor-leds', (event, value) =>
	{
		if (mainWindow && mainWindow.content() != null)
			mainWindow.content().send('floor-leds', value);
	})
	
	
	ipcMain.on('indexPupitre-ready', (event, value) =>
	{
		// Tool window
		if (configuration.tool.enable && toolWindow == null)
		{
			toolWindow = windowManager.open('tool', 'Le temps suspendu : outil de simulation', getFile('indexTool.html'),{},
			{
				'x' : configuration.tool.x,
				'y' : configuration.tool.y,
				'w' : configuration.tool.w,
				'h' : configuration.tool.h,
				}, configuration.tool.devtools);
		}

	});


	ipcMain.on('indexPupitre-setAnimation', (event, value) =>
	{
		if (toolWindow)
		{
			toolWindow.content().send('setAnimation', value);
		}
	
	});

	ipcMain.on('indexPupitre-setGridViewCamPos', (event, value) =>
	{
		if (toolWindow)
		{
			toolWindow.content().send('setGridViewCamPos', value);
		}
	
	});

	ipcMain.on('indexPupitre-showPhoto', (event, value) =>
	{
		console.log('indexPupitre-showPhoto');
		if (photoWindow)
		{
			photoWindow.content().send('showPhoto', value);
		}
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
