const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const url = require('url');
var updateOnClose = false;

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
		if (updateOnClose) {
			autoUpdater.quitAndInstall()
		} else {
			app.quit();
		}
	}
});
  
ipcMain.on('app_version', (event) => {
	event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('update-available', () => {
	mainWindow.webContents.send('update_available');
	console.log('Update Available')
});

autoUpdater.on('update-downloaded', () => {
	mainWindow.webContents.send('update_downloaded');
	console.log('Update Dowloaded')
});

ipcMain.on('wait_update', () => {
	updateOnClose = true
});

ipcMain.on('restart_app', () => {
	autoUpdater.quitAndInstall();
});
export { getWindowSize }