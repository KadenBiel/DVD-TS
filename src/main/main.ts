import { app, BrowserWindow, ipcMain, Menu, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import Store from 'electron-store';
import { format as formatUrl } from 'url';
import { join as joinPath } from 'path';
import { IpcMessages, IpcRendererMessages } from '../common/ipc-messages';
import { ProgressInfo, UpdateInfo } from 'builder-util-runtime';

const schema = {
  size: {
    type: 'number',
    minimum: 10,
    maximum: 200,
    default: 54
  },
  speed: {
    type: 'number',
    minimum: 1,
    maximum: 100,
    default: 1
  },
  colors: {
    type: 'array',
    items: {
      type: 'string',
      minLength: 1
    }
  },
};

const store = new Store({schema: schema});

let mainWindow;
let update = false;
let mainScrn = true;

function createWindow() { // Function for creating the window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      //devTools: false,
    },
  });
  mainWindow.setThumbarButtons([]);
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
  mainWindow.setMenuBarVisibility(false)
  /*mainWindow.webContents.on('devtools-opened', () => {
    mainWindow.webContents.closeDevTools();
  });*/
}

app.on('ready', () => { // Creates the mainWindow, sets the app menu and checks for updates when the app is ready
  createWindow();
  mainWindow.webContents.openDevTools({ // Opens devTools in detached mode
    mode: 'detach',
  });
  autoUpdater.checkForUpdates();
});

autoUpdater.on('update-available', () => { // Tells the window and update is available
  mainWindow.webContents.send(IpcRendererMessages.AUTO_UPDATER_STATE, {
    state: 'available'
  });
  update = true;
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
  })
});
autoUpdater.on('update-downloaded', (info: UpdateInfo) => { // Tells the window an update was downloaded
  mainWindow.webContents.send(IpcRendererMessages.AUTO_UPDATER_STATE, {
    state: 'downloaded',
    info
  })
});

ipcMain.on(IpcMessages.RESTART_AND_UPDATE, () => { // Installs new update and restarts app
  autoUpdater.quitAndInstall();
});

ipcMain.on(IpcRendererMessages.SAVE_SETTINGS, (event, settings) => { // Saves the settings in storage
  let noError = true;
  store.set('size', settings.size);
  store.set('speed', settings.speed);
  store.set('colors', settings.colors);
});

ipcMain.on(IpcRendererMessages.CLEAR_SETTINGS, () => { // For debugging, resets settings to defaults
  store.clear();
});

ipcMain.on(IpcMessages.QUIT_DVD, () => { // Closes the app
  app.quit()
})

ipcMain.on(IpcMessages.RESTART_DVD, () => { // Restarts app
  app.relaunch();
  app.quit()
})