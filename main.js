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
let mainWindow, toolWindow;
// mySQL
let connection;
// Artnet
//let leds;

// --------------------------------------------------
app.on('ready', () =>
{
	loadConfiguration("Data/Configs/"+configurationName);
});

// --------------------------------------------------
app.on('window-all-closed', function()
{
	if (connection)
		connection.end();
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
		'width' : 1280,
		'height' : 1024,
		'x' : 0/*externalDisplay.bounds.x*/,
		'y' : 0/*externalDisplay.bounds.y*/,
		'frame' : false
	}, true);

	// Artnet
	leds.init( configuration );
	leds.reset();

	// save some objects on global
	global.rqcv = {};
	global.rqcv.connection = connection;
	global.rqcv.leds = leds;
	
	// events from windows
	ipcMain.on('toolPupitre-gridTouchControl', (event, value) =>
	{
		if (mainWindow.content())
			mainWindow.content().send('gridTouchControl', value);
	})

	ipcMain.on('toolPupitre-listAnimations', (event, value) =>
	{
		if (mainWindow.content())
			mainWindow.content().send('listAnimations', value);
	})

	
	ipcMain.on('toolPupitre-radiusInfluence', (event, value) =>
	{
		if (mainWindow.content())
			mainWindow.content().send('radiusInfluence', value);
	})

	ipcMain.on('toolPupitre-radiusHeight', (event, value) =>
	{
		if (mainWindow.content())
			mainWindow.content().send('radiusHeight', value);
	})

	ipcMain.on('toolPupitre-ledGreyOut', (event, value) =>
	{
		if (mainWindow.content())
			mainWindow.content().send('ledGreyOut', value);
	})

	ipcMain.on('animation-leds', (event, value) =>
	{
		if (mainWindow.content())
			mainWindow.content().send('leds', value);
	})
	
	
	ipcMain.on('indexPupitre-ready', (event, value) =>
	{
		console.log( "indexPupitre-ready" );

		// Tool window
		if (configuration.tool.enable)
		{
			toolWindow = windowManager.open('tool', 'Le temps suspendu : outil de simulation', getFile('indexTool.html'),{},
			{
				'x' : 0,
				'y' : 0
				},true);
		}

	})
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
