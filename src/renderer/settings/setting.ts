const speed = document.getElementById('speed');
const speedP = document.getElementById('speedP');
const dvdSize = document.getElementById('size');
const sizeP = document.getElementById('sizeP');
const color0 = document.getElementById('color0');
const color1 = document.getElementById('color1');
const color2 = document.getElementById('color2');
const color3 = document.getElementById('color3');
const color4 = document.getElementById('color4');
const color5 = document.getElementById('color5');
const color6 = document.getElementById('color6');
const color7 = document.getElementById('color7');
const lockBut = document.getElementById('lock');
const setDiv = document.getElementById('setDiv');
const usrIn = document.getElementById('code');
const message = document.getElementById('message');

let locked;
let code;

const { ipcRenderer } = require('electron');
const version = document.getElementById('version');
      
ipcRenderer.send('app_version');
ipcRenderer.on('app_version', (event, arg) => {
    ipcRenderer.removeAllListeners('app_version');
    version.innerText = 'DVD Screen v' + arg.version;
});

ipcRenderer.send('get-settings')
ipcRenderer.on('send-settings', (event, settings) => {
    ipcRenderer.removeAllListeners('send-settings');
    dvdSize.value = settings.size;
    speed.value = settings.dvdSpeed;
    color0.value = settings.colors[0];
    color1.value = settings.colors[1];
    color2.value = settings.colors[2];
    color3.value = settings.colors[3];
    color4.value = settings.colors[4];
    color5.value = settings.colors[5];
    color6.value = settings.colors[6];
    color7.value = settings.colors[7];
    locked = settings.lock;
    changeAll();
});

ipcRenderer.send('getLock');
ipcRenderer.on('sendLock', (event, args) => {
    if (args.locked) {
        code = args.pin;
        locked = args.locked;
        setDiv.className = 'hide'
        lockBut.value = 'Unlock'
    } else {
        locked = args.locked
    }
});


function changeSpeed() {
    speedP.innerText = "DVD Speed: "+speed.value;
}

function changeSize() {
    sizeP.innerText = "DVD Size: "+dvdSize.value+"px";
}

function changeAll() {
    changeSize();
    changeSpeed();
    if (locked) {
        lockBut.value = 'Unlock'
    }
}

function restore() {
    speed.value = "1";
    dvdSize.value = "54";
    color0.value = "#0079fe";
    color1.value = "#0ed145";
    color2.value = "#ff7f27";
    color3.value = "#b83dba";
    color4.value = "#ec1c24";
    color5.value = "#fff200";
    color6.value = "#ff71ff";
    color7.value = "#ffffff";
    changeAll();
}

function save() {
    ipcRenderer.send('save-settings', {
        size: parseInt(dvdSize.value),
        speed: parseInt(speed.value),
        colors: [color0.value,color1.value,color2.value,color3.value,color4.value,color5.value,color6.value,color7.value,]
    });
}

function lock() {
    if (locked) {
        var userIn = usrIn.value;
        if (userIn == code) {
            locked = !locked
            ipcRenderer.send('Lock', {lock: locked, pin: code});
            setDiv.className = 'settings'
            lockBut.value = 'Lock'
            usrIn.value = ''
            message.innerText = ''
        } else {
            message.innerText = 'Incorrect passcode'
            usrIn.value = ''
        }
    } else {
        message.innerText = ''
        var userIn = usrIn.value;
        locked = !locked
        code = userIn
        lockBut.value = 'Unlock'
        ipcRenderer.send('Lock', {lock: locked, pin: code});
        setDiv.className = 'hide'
        usrIn.value = ''
    }
}