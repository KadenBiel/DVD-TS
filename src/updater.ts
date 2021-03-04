import { ipcRenderer } from 'electron';

const notification = document.getElementById('notification');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-button');

ipcRenderer.on('update_available', () => {
    alert('Dowloading new update...')
});

ipcRenderer.on('update_downloaded', () => {
    ipcRenderer.removeAllListeners('update_downloaded');
    if (confirm("Update downloaded. Press ok to restart and install.")) {
        ipcRenderer.send('restart_app')
    } else {
        ipcRenderer.send('wait_update')
    }
});

function closeNotification() {
    notification.classList.add('hidden');
};

function restartApp() {
    ipcRenderer.send('restart_app');
}
export {}