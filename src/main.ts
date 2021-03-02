const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const { ProgressInfo } = require('builder-util-runtime');
const windowStateKeeper = require("electron-window-state");

const isDevelopment = process.env.NODE_ENV !== 'production';

let mainWindow;

app.commandLine.appendSwitch('disable-pinch');

function createWindow () {
	mainWindow = new BrowserWindow({
	  width: 640,
	  height: 480,

	  webPreferences: {
		nodeIntegration: true,
	  },
	});
	mainWindow.loadFile('index.html');
	mainWindow.on('closed', function () {
	  mainWindow = null;
	});
	mainWindow.once('ready-to-show', () => {
		autoUpdater.checkForUpdatesAndNotify();
	});
};

app.on('ready', () => {
	createWindow();
});
  
app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
	  app.quit();
	}
});
  
app.on('activate', function () {
	if (mainWindow === null) {
	  createWindow();
	}
});
  
ipcMain.on('app_version', (event) => {
	event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('update-available', () => {
	mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
	mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
	autoUpdater.quitAndInstall();
});