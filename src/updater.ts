const elect = require('electron')

const notification = document.getElementById('notification');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-button');
const ipcRenderer = elect.ipcRenderer;
const BWindow = elect.BrowserWindow.getAllWindows()[0];
var ctx = document.getElementById('c').getContext('2d');


declare module 'canvasSizer' {
    export function resize(w, h) {
        ctx.canvas.width = w;
        ctx.canvas.height = h;
        console.log('resizing')
    }
}
ipcRenderer.on('update_available', () => {
    ipcRenderer.removeAllListeners('update_available');
    message.innerText = 'A new update is available. Downloading now...';
    notification.classList.remove('hidden');
});

ipcRenderer.on('update_downloaded', () => {
    ipcRenderer.removeAllListeners('update_downloaded');
    message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
    restartButton.classList.remove('hidden');
    notification.classList.remove('hidden');
});

function closeNotification() {
    notification.classList.add('hidden');
};

function restartApp() {
    ipcRenderer.send('restart_app');
}