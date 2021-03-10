const { app, BrowserWindow, ipcMain, Menu, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const Store = require('electron-store');
const path = require('path');
const url = require('url');

const store = new Store();

let mainWindow;
let update = false;

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
        label: 'Open Settings',
        click: function() {
          openSettings()
        }
      },
      {
        role: 'togglefullscreen'
      }
    ]
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'Report a Bug',
        click: function() {
          shell.openExternal('https://github.com/KadenBiel/DVD-TS/issues')
        }
      },
      {
        label: 'Ask a Question',
        click: function() {
          shell.openExternal('https://github.com/KadenBiel/DVD-TS/issues')
        }
      },
      {
        label: 'Github',
        click: function() {
          shell.openExternal('https://github.com/KadenBiel/DVD-TS')
        }
      },
      {
        label: 'Discord',
        click: function() {
          shell.openExternal('https://discord.gg/t76fzaYJcr')
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
        label: 'Close Settings',
        click: function() {
          closeSettings()
        }
      },
      {
        role: 'togglefullscreen'
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
      devTools: false,
    },
  });
  mainWindow.setThumbarButtons([])
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../renderer/index.html'),
    protocol: 'file:',
    slashes: true,
  }));
  mainWindow.webContents.on('devtools-opened', () => {
    mainWindow.webContents.closeDevTools();
  });
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

app.on('ready', () => {
  createWindow();
  Menu.setApplicationMenu(mainMenu);
  /*mainWindow.webContents.openDevTools({
    mode: 'detach',
  });*/
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

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
  update = true;
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion(), url: autoUpdater.getFeedURL() });
});

ipcMain.on('restart_app', () => {
  app.relaunch();
  autoUpdater.quitAndInstall();
});

ipcMain.on('get-settings', (event) => {
  let noError = true;
  let dspeed = '1';
  let size = '50';
  size = store.get('size');
  dspeed = store.get('speed');
  if (!size) size = '50';
  if (!dspeed) dspeed = '1';
  event.sender.send('send-settings', {
    success: noError,
    dvdSpeed: parseInt(dspeed),
    size: parseInt(size),
    /*color0: '#0079fe',
    color1: '#0ed145',
    color2: '#ff7f27',
    color3: '#b83dba',
    color4: '#ec1c24',
    color5: '#fff200',
    color6: '#ff71ff',
    color7: '#ffffff'*/
  })
});

ipcMain.on('save-settings', (event, settings) => {
  let noError = true;
  store.set('size', settings.size.toString());
  store.set('speed', settings.speed.toString());
  event.sender.send('saved-settings', {
    success: noError,
  })
  closeSettings();
});