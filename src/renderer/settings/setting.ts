const speed = document.getElementById('speed');
const speedP = document.getElementById('speedP');
const dvdSize = document.getElementById('size');
const sizeP = document.getElementById('sizeP');
const lockBut = document.getElementById('lock');
const setDiv = document.getElementById('setDiv');
const usrIn = document.getElementById('code');
const message = document.getElementById('message');
const colorDiv = document.getElementById('colorDiv');

let locked;
let code;
let colors = [];
let dColors = ['#0079fe','#0ed145','#ff7f27','#b83dba','#ec1c24','#fff200','#ff71ff','#ffffff'];

const { ipcRenderer } = require('electron');
const version = document.getElementById('version');
      
ipcRenderer.send('get_version');
ipcRenderer.on('return_version', (event, arg) => {
    ipcRenderer.removeAllListeners('return_version');
    version.innerText = 'DVD Screen v' + arg.version;
});

ipcRenderer.send('get_settings')
ipcRenderer.on('return_settings', (event, settings) => {
    ipcRenderer.removeAllListeners('return_settings');
    dvdSize.value = settings.size;
    speed.value = settings.dvdSpeed;
    locked = settings.lock;
    for (var i=0; i<settings.colors.length; i++) {
        var nColor = document.createElement('input');
        nColor.className = 'color';
        nColor.id = 'color'+i.toString;
        nColor.type = 'color';
        nColor.value = settings.colors[i];
        colors[i] = nColor
        colorDiv.appendChild(nColor)
    }
    changeAll();
});

ipcRenderer.send('get_lock');
ipcRenderer.on('return_lock', (event, args) => {
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

function newColor(val='#ffffff') {
    var nColor = document.createElement('input');
    nColor.className = 'color';
    nColor.id = 'color'+colors.length.toString;
    nColor.type = 'color';
    nColor.value = val;
    colors[colors.length] = nColor;
    colorDiv.appendChild(nColor)
}

function remColor(oColor=null) {
    if (oColor == null) {
        if (colors.length != 1) {
            var oColor = colors.pop()
            oColor.remove()
        }
    } else {
        oColor.remove()
    }
}

function restore() {
    speed.value = "1";
    dvdSize.value = "54";
    var len = colors.length
    for (var i=0; i<len; i++) {
        var oC = colors.pop()
        remColor(oC)
    }
    for (var i=0; i<dColors.length; i++) {
        newColor(dColors[i])
    }
    changeAll();
}

function save() {
    var sColors = []
    for (var i=0; i<colors.length; i++) {
        sColors[i] = colors[i].value
    }
    ipcRenderer.send('save_settings', {
        size: parseInt(dvdSize.value),
        speed: parseInt(speed.value),
        colors: sColors,
    });
}

function lock() {
    if (locked) {
        var userIn = usrIn.value;
        if (userIn == code) {
            locked = !locked
            ipcRenderer.send('lock', {lock: locked, pin: code});
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
        ipcRenderer.send('lock', {lock: locked, pin: code});
        setDiv.className = 'hide'
        usrIn.value = ''
    }
}