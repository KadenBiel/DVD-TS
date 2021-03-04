import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
const path = require('path');
const url = require('url');

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
});

function getWindowSize() {
	console.log("retrieved size")
	return mainWindow.getSize()
};

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
export { getWindowSize }