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

function changeSpeed() {
    speedP.innerText = "DVD Speed: "+speed.value;
}

function changeSize() {
    sizeP.innerText = "DVD Size: "+dvdSize.value+"px";
}

function changeColor0() {
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
}

function changeAll() {
    changeSize();
    changeSpeed();
    changeColor0();
    changeColor1();
    changeColor2();
    changeColor3();
    changeColor4();
    changeColor5();
    changeColor6();
    changeColor7();
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