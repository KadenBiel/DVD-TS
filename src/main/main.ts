const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      //devTools: false,
    },
  });
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../renderer/index.html'),
    protocol: 'file:',
    slashes: true,
  }));
  /*mainWindow.webContents.on('devtools-opened', () => {
    mainWindow.webContents.closeDevTools();
  });*/
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
};

app.on('ready', () => {
  createWindow();
  autoUpdater.checkForUpdates();
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
  app.relaunch();
  autoUpdater.quitAndInstall();
});