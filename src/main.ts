const { canvasSizer } = require('canvasSizer');

const electron = require('electron');
const { autoUpdater } = require('electron-updater');
const { ProgressInfo } = require('builder-util-runtime');
const windowStateKeeper = require("electron-window-state");
const path = require('path');
const url = require('url');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const isDevelopment = process.env.NODE_ENV !== 'production';

let mainWindow;

app.on('ready', () => {
	let mainWindow = new BrowserWindow({
		width: 640,
		height: 480,
		webPreferences: {
		  nodeIntegration: true,
		},
	});
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}));
	mainWindow.once('ready-to-show', () => {
		autoUpdater.checkForUpdatesAndNotify();
	});
	mainWindow.on('resized', resize(mainWindow.getSize()[0], mainWindow.getSize()[1]));
});

app.commandLine.appendSwitch('disable-pinch');
  
app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
	  app.quit();
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