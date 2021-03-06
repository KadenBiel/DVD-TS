'use strict';

import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import url from 'url';

let mainWindow;

app.on('ready', () => {
	let mainWindow = new BrowserWindow({
		width: 640,
		height: 480,
		webPreferences: {
		  nodeIntegration: true,
		  devTools: false
		},
	});
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}));

	mainWindow.webContents.on("devtools-opened", () => {
		mainWindow.webContents.closeDevTools();
		console.log('You thought bitch!')
	});

	autoUpdater.checkForUpdates();
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
	console.log('Update Available')
});

autoUpdater.on('update-downloaded', () => {
	mainWindow.webContents.send('update_downloaded');
	console.log('Update Dowloaded')
});

ipcMain.on('restart-app', () => {
	app.relaunch();
	autoUpdater.quitAndInstall();
});

export { getWindowSize }