const { app, BrowserWindow, ipcMain, Menu, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const Store = require('electron-store');
const path = require('path');
const url = require('url');

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
      minLength: 7,
      maxLength: 7
    }
  },
}

const store = new Store({schema});

let mainWindow;
let update = false;

const mainTemplate = [
  {
    label: 'DVD Menu',
    submenu: [
      {
        role: 'quit'
      },
      {
        label: 'Restart',
        click: function() {
          app.relaunch()
          app.quit()
        }
      },
      {
        role: 'reload'
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
      },
      {
        label: 'Change log',
        click: function() {
          shell.openExternal('https://github.com/KadenBiel/DVD-TS/blob/master/CHANGELOG.md')
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
        role: 'quit'
      },
      {
        label: 'Restart',
        click: function() {
          app.relaunch()
          app.quit()
        }
      },
      {
        role: 'reload'
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
  var size = store.get('size');
  var dspeed = store.get('speed');
  var colors = store.get('colors');
  event.sender.send('send-settings', {
    dvdSpeed: parseInt(dspeed),
    size: parseInt(size),
    colors: colors,
  })
});

ipcMain.on('save-settings', (event, settings) => {
  let noError = true;
  store.set('size', settings.size);
  store.set('speed', settings.speed);
  store.set('colors', settings.colors)
  event.sender.send('saved-settings', {
    success: noError,
  })
  closeSettings();
});

ipcMain.on('delete-settings', () => {
  store.delete('size');
  store.delete('speed');
  store.delete('colors')
})

ipcMain.on('Lock', (event, args) => {
  if (args.lock) {
    store.set('pin', args.pin)
    store.set('locked', 'true')
  } else {
    store.set('locked', 'false')
  }
})

ipcMain.on('getLock', () => {
  var pin = store.get('pin')
  var locked = store.get('locked')
  if (locked == 'true') {
    locked = true
  } else {
    locked = false
  }
  mainWindow.webContents.send('sendLock', {
    locked: locked,
    pin: pin,
  })
})

ipcMain.on('closeSettings', () => {
  closeSettings()
})