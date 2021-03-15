const speed = document.getElementById('speed');
const speedP = document.getElementById('speedP');
const dvdSize = document.getElementById('size');
const sizeP = document.getElementById('sizeP');
/*const color0 = document.getElementById('color0');
const color1 = document.getElementById('color1');
const color2 = document.getElementById('color2');
const color3 = document.getElementById('color3');
const color4 = document.getElementById('color4');
const color5 = document.getElementById('color5');
const color6 = document.getElementById('color6');
const color7 = document.getElementById('color7');*/
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

/*function changeColor0() {
    console.log('color change')
}

function changeColor1() {
    console.log('color change')
}

function changeColor2() {
    console.log('color change')
}

function changeColor3() {
    console.log('color change')
}

function changeColor4() {
    console.log('color change')
}

function changeColor5() {
    console.log('color change')
}

function changeColor6() {
    console.log('color change')
}

function changeColor7() {
    console.log('color change')
}*/

function changeAll() {
    changeSize();
    changeSpeed();
    /*changeColor0();
    changeColor1();
    changeColor2();
    changeColor3();
    changeColor4();
    changeColor5();
    changeColor6();
    changeColor7();*/
    if (locked) {
        lockBut.value = 'Unlock'
    }
}

function restore() {
    speed.value = "1";
    dvdSize.value = "54";
    /*color0.value = "#0079fe";
    color1.value = "#0ed145";
    color2.value = "#ff7f27";
    color3.value = "#b83dba";
    color4.value = "#ec1c24";
    color5.value = "#fff200";
    color6.value = "#ff71ff";
    color7.value = "#ffffff";*/
    changeAll();
}

function save() {
    ipcRenderer.send('save-settings', {
        size: dvdSize.value,
        speed: speed.value,
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