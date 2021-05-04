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
};

const store = new Store({schema: schema});

let mainWindow;
let update = false;
let mainScrn = true;
let menuHide = true;

function createWindow() { // Function for creating the window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      //devTools: false,
    },
  });
  mainWindow.setThumbarButtons([]);
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../renderer/index.html'),
    protocol: 'file:',
    slashes: true,
  }));
  /*mainWindow.webContents.on('devtools-opened', () => {
    mainWindow.webContents.closeDevTools();
  });*/
  mainWindow.on('enter-full-screen', () => {
    if (mainScrn) {
      if (mainWindow.menuBarVisible) {
        mainWindow.setMenuBarVisibility(false);
        menuHide = false;
      } else {
        menuHide = true;
      };
    };
  });
  mainWindow.on('leave-full-screen', () => {
    if (mainScrn && !menuHide) {
      mainWindow.setMenuBarVisibility(true);
    };
  });
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
};

function toggleMenu() {
  mainWindow.setMenuBarVisibility(!mainWindow.menuBarVisible);
};

app.on('ready', () => { // Creates the mainWindow, sets the app menu and checks for updates when the app is ready
  createWindow();
  mainWindow.webContents.openDevTools({ // Opens devTools in detached mode
    mode: 'detach',
  });
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
  });
});

ipcMain.on('save_settings', (event, settings) => { // Saves the settings in storage
  let noError = true;
  store.set('size', settings.size);
  store.set('speed', settings.speed);
  store.set('colors', settings.colors);
});

ipcMain.on('reset_settings', () => { // For debugging, resets settings to defaults
  store.clear();
});

ipcMain.on('lock', (event, args) => { // Sets the lock bool and pin
  if (args.lock) {
    store.set('pin', args.pin);
    store.set('locked', true);
  } else {
    store.set('locked', false);
  };
});

ipcMain.on('quit_app', () => {
  app.quit()
})

ipcMain.on('get_lock', () => { // Returns lock bool and pin when called
  var pin = store.get('pin');
  var locked = store.get('locked');
  mainWindow.webContents.send('return_lock', {
    locked: locked,
    pin: pin,
  });
});