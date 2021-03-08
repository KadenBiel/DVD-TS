const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const url = require('url');

let mainWindow;

const mainTemplate = [
  {
    label: 'DVD Menu',
    submenu: [
      {
        label: 'Exit',
        click: function() {
          app.quit()
        }
      },
      {
        label: 'Restart',
        click: function() {
          app.relaunch()
          app.quit()
        }
      },
      {
        label: 'Check For Updates',
        click: function() {
          autoUpdater.checkForUpdates()
        }
      },
      {
        label: 'Open Settings',
        click: function() {
          openSettings()
        }
      }
    ]
  }
]

const settingsTemplate = [
  {
    label: 'DVD Menu',
    submenu: [
      {
        label: 'Exit',
        click: function() {
          app.quit()
        }
      },
      {
        label: 'Restart',
        click: function() {
          app.relaunch()
          app.quit()
        }
      },
      {
        label: 'Check For Updates',
        click: function() {
          autoUpdater.checkForUpdates()
        }
      },
      {
        label: 'Close Settings',
        click: function() {
          closeSettings()
        }
      }
    ]
  }
]

const mainMenu = Menu.buildFromTemplate(mainTemplate);
const settingsMenu = Menu.buildFromTemplate(settingsTemplate);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      //devTools: false,
    },
  });
  mainWindow.setThumbarButtons([])
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

function openSettings() {
  console.log('open settings')
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../renderer/settings/settings.html'),
    protocol: 'file:',
    slashes: true,
  }));

  Menu.setApplicationMenu(settingsMenu)
}

function closeSettings() {
  console.log ('close settings')
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../renderer/index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  Menu.setApplicationMenu(mainMenu)
}

app.setUserTasks([]);

app.on('ready', () => {
  createWindow();
  Menu.setApplicationMenu(mainMenu);
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