import { autoUpdater } from 'electron-updater';
import { app, BrowserWindow } from 'electron';
import windowStateKeeper from 'electron-window-state';
import { IpcRendererMessages } from './common/ipc-messages';
import { ProgressInfo } from 'builder-util-runtime';

const isDevelopment = process.env.NODE_ENV !== 'production';

let mainWindow: BrowserWindow | null = null;

app.commandLine.appendSwitch('disable-pinch');

function createMainWindow() {
	const mainWindowState = windowStateKeeper({});

	const window = new BrowserWindow({
		width: 640,
		height: 420,
		x: mainWindowState.x,
		y: mainWindowState.y,

		resizable: true,
		frame: false,
		fullscreenable: true,
		maximizable: true,
		transparent: true,
	});

	mainWindowState.manage(window);
	if (isDevelopment) {
		// Force devtools into detached mode otherwise they are unusable
		window.webContents.openDevTools({
			mode: 'detach',
		});
	}

	let dvdVersion: string;
	if (isDevelopment) {
        dvdVersion = "0.0.0"
    } else {
        dvdVersion = autoUpdater.currentVersion.version
    }

	window.webContents.userAgent = `CrewLink/${dvdVersion} (${process.platform})`;

	window.on('closed', () => {
		mainWindow = null;
	});

	window.webContents.on('devtools-opened', () => {
		window.focus();
		setImmediate(() => {
			window.focus();
		});
	});

	return window;
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
	app.quit();
} else {
	autoUpdater.checkForUpdates();
	autoUpdater.on('update-available', () => {
		mainWindow?.webContents.send(IpcRendererMessages.AUTO_UPDATER_STATE, {
			state: 'available',
		});
	});
	autoUpdater.on('error', (err: string) => {
		mainWindow?.webContents.send(IpcRendererMessages.AUTO_UPDATER_STATE, {
			state: 'error',
			error: err,
		});
	});
	autoUpdater.on('download-progress', (progress: ProgressInfo) => {
		mainWindow?.webContents.send(IpcRendererMessages.AUTO_UPDATER_STATE, {
			state: 'downloading',
			progress,
		});
	});
	autoUpdater.on('update-downloaded', () => {
		mainWindow?.webContents.send(IpcRendererMessages.AUTO_UPDATER_STATE, {
			state: 'downloaded',
		});
		app.relaunch();
		autoUpdater.quitAndInstall();
	});

	// Mock auto-update download
	// setTimeout(() => {
	// 	mainWindow?.webContents.send(IpcRendererMessages.AUTO_UPDATER_STATE, {
	// 		state: 'available'
	// 	});
	// 	let total = 1000*1000;
	// 	let i = 0;
	// 	let interval = setInterval(() => {
	// 		mainWindow?.webContents.send(IpcRendererMessages.AUTO_UPDATER_STATE, {
	// 			state: 'downloading',
	// 			progress: {
	// 				total,
	// 				delta: total * 0.01,
	// 				transferred: i * total / 100,
	// 				percent: i,
	// 				bytesPerSecond: 1000
	// 			}
	// 		} as AutoUpdaterState);
	// 		i++;
	// 		if (i === 100) {
	// 			clearInterval(interval);
	// 			mainWindow?.webContents.send(IpcRendererMessages.AUTO_UPDATER_STATE, {
	// 				state: 'downloaded',
	// 			});
	// 		}
	// 	}, 100);
	// }, 10000);

	app.on('second-instance', () => {
		// Someone tried to run a second instance, we should focus our window.
		if (mainWindow) {
			if (mainWindow.isMinimized()) mainWindow.restore();
			mainWindow.focus();
		}
	});

	// quit application when all windows are closed
	app.on('window-all-closed', () => {
		// on macOS it is common for applications to stay open until the user explicitly quits
		if (process.platform !== 'darwin') {
			app.quit();
		}
	});

	app.on('activate', () => {
		// on macOS it is common to re-create a window even after all windows have been closed
		if (mainWindow === null) {
			mainWindow = createMainWindow();
		}
	});

	// create main BrowserWindow when electron is ready
	app.whenReady().then(() => {
		mainWindow = createMainWindow()
	});
}