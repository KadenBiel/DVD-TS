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
      minLength: 1
    }
  },
  locked: {
    type: 'boolean',
    default: false
  },
  pin: {
    type: 'string',
    default: ''
  }
}

const store = new Store({schema: schema});

let mainWindow;
let update = false;

const mainTemplate = [ // Menu template for main page
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

const settingsTemplate = [ // Menu template for settings page
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

const mainMenu = Menu.buildFromTemplate(mainTemplate); // Builds menu for main screen
const settingsMenu = Menu.buildFromTemplate(settingsTemplate); // Build menu for settings screen

function createWindow() { // Function for creating the window
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

function openSettings() { // Function for opening the settings page
  console.log('open settings')
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../renderer/settings/settings.html'),
    protocol: 'file:',
    slashes: true,
  }));

  Menu.setApplicationMenu(settingsMenu)
}

function closeSettings() { // Function for closing the settings page
  console.log ('close settings')
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../renderer/index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  Menu.setApplicationMenu(mainMenu)
}

app.on('ready', () => { // Creates the mainWindow, sets the app menu and checks for updates when the app is ready
  createWindow();
  Menu.setApplicationMenu(mainMenu);
  /*mainWindow.webContents.openDevTools({ // Opens devTools in detached mode
    mode: 'detach',
  });*/
  autoUpdater.checkForUpdates();
});

autoUpdater.on('update-available', () => { // Tells the window and update is available
  mainWindow.webContents.send('update_available');
  update = true;
});

autoUpdater.on('update-downloaded', () => { // Tells the window an update was downloaded
  mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('get_version', (event) => { // Returns app version when called
  event.sender.send('return_version', { version: app.getVersion(), url: autoUpdater.getFeedURL() });
});

ipcMain.on('restart', () => { // Installs new update and restarts app
  autoUpdater.quitAndInstall();
});

ipcMain.on('get_settings', (event) => { // Returns settings when called
  var size = store.get('size');
  var dspeed = store.get('speed');
  var colors = store.get('colors');
  event.sender.send('return_settings', {
    dvdSpeed: parseInt(dspeed),
    size: parseInt(size),
    colors: colors,
  })
});

ipcMain.on('save_settings', (event, settings) => { // Saves the settings in storage
  let noError = true;
  store.set('size', settings.size);
  store.set('speed', settings.speed);
  store.set('colors', settings.colors)
  closeSettings();
});

ipcMain.on('reset_settings', () => { // For debugging, resets settings to defaults
  store.clear()
})

ipcMain.on('lock', (event, args) => { // Sets the lock bool and pin
  if (args.lock) {
    store.set('pin', args.pin)
    store.set('locked', true)
  } else {
    store.set('locked', false)
  }
})

ipcMain.on('get_lock', () => { // Returns lock bool and pin when called
  var pin = store.get('pin')
  var locked = store.get('locked')
  mainWindow.webContents.send('return_lock', {
    locked: locked,
    pin: pin,
  })
})

ipcMain.on('closeSettings', () => { // Listener for debugging situations
  closeSettings()
})