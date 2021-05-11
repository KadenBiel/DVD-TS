import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import Store from 'electron-store';
import { format as formatUrl } from 'url';
import { join as joinPath } from 'path';
import { AutoUpdaterState, IpcMessages, IpcRendererMessages } from '../common/ipc-messages';
import { ProgressInfo, UpdateInfo } from 'builder-util-runtime';
import { ISettings } from '../common/ISettings';

const args = require('minimist')(process.argv); // eslint-disable-line

const isDevelopment = process.env.NODE_ENV !== 'production';
const devTools = (isDevelopment || args.dev === 1) && true;

const store = new Store<ISettings>();

let mainWindow: BrowserWindow;

function createWindow() { // Function for creating the window
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		frame: false,
		webPreferences: {
			nodeIntegration: true,
			devTools: devTools,
		},
	});

	if (devTools) {
		mainWindow.webContents.openDevTools({
			mode: 'detach',
		});
	}

	if (isDevelopment) {
		mainWindow.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}?version=DEV&view=app`);
	} else {
		mainWindow.loadURL(
			formatUrl({
				pathname: joinPath(__dirname, 'index.html'),
				protocol: 'file',
				query: {
					version: autoUpdater.currentVersion.version,
					view: 'app',
				},
				slashes: true,
			})
		);
	}

	mainWindow.webContents.on('devtools-opened', () => {
		mainWindow.focus();
		setImmediate(() => {
			mainWindow.focus();
		});
	});

	mainWindow.on('closed', () => {
		try {
			mainWindow?.destroy();
		} catch {
			/* empty */
		}
	});
}

app.on('ready', () => { // Creates the mainWindow, sets the app menu and checks for updates when the app is ready
	createWindow();
	autoUpdater.checkForUpdates();
});

autoUpdater.on('update-available', () => { // Tells the window and update is available
	mainWindow.webContents.send(IpcRendererMessages.AUTO_UPDATER_STATE, {
		state: 'available'
	});
});
autoUpdater.on('error', (err: string) => { // Tells the window there was an error
	mainWindow.webContents.send(IpcRendererMessages.AUTO_UPDATER_STATE, {
		state: 'error',
		error: err,
	});
});
autoUpdater.on('download-progress', (progress: ProgressInfo) => { // Updates the window on the progress of the update
	mainWindow.webContents.send(IpcRendererMessages.AUTO_UPDATER_STATE, {
		state: 'downloading',
		progress
	});
});
autoUpdater.on('update-downloaded', (info: UpdateInfo) => { // Tells the window an update was downloaded
	mainWindow.webContents.send(IpcRendererMessages.AUTO_UPDATER_STATE, {
		state: 'downloaded',
		info
	});
});

/*setTimeout(() => {
 	mainWindow?.webContents.send(IpcRendererMessages.AUTO_UPDATER_STATE, {
 		state: 'available'
 	});
 	let total = 1000*1000;
 	let i = 0;
 	let interval = setInterval(() => {
 		mainWindow?.webContents.send(IpcRendererMessages.AUTO_UPDATER_STATE, {
 			state: 'downloading',
 			progress: {
 				total,
 				delta: total * 0.01,
 				transferred: i * total / 100,
 				percent: i,
 				bytesPerSecond: 1000
 			}
 		} as AutoUpdaterState);
 		i++;
 		if (i === 100) {
 			clearInterval(interval);
			mainWindow?.webContents.send(IpcRendererMessages.AUTO_UPDATER_STATE, {
				state: 'downloaded',
			});
		}
	}, 100);
}, 10000);*/

ipcMain.on(IpcMessages.RESTART_AND_UPDATE, () => { // Installs new update and restarts app
	autoUpdater.quitAndInstall();
});

ipcMain.on(IpcRendererMessages.GET_SETTINGS, (event) => {
	var size = store.get('size');
  	var dspeed = store.get('speed');
  	var colors = store.get('colors');
	var askUpdate = store.get('askUpdate');
	event.sender.send(IpcRendererMessages.RETURN_SETTINGS, {
		dvdSpeed: dspeed,
    	size: size,
    	colors: colors,
		askUpdate: askUpdate
	})
})

ipcMain.on(IpcRendererMessages.SAVE_SETTINGS, (event, settings) => { // Saves the settings in storage
	store.set('size', settings.size);
	store.set('speed', settings.speed);
	store.set('colors', settings.colors);
	store.set('askUpdate', settings.askUpdate)
});

ipcMain.on(IpcRendererMessages.CLEAR_SETTINGS, () => { // For debugging, resets settings to defaults
	store.clear();
});

ipcMain.on(IpcMessages.QUIT_DVD, () => { // Closes the app
	app.quit();
});

ipcMain.on(IpcMessages.RESTART_DVD, () => { // Restarts app
	app.relaunch();
	app.quit();
});