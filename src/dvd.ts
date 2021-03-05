var x = 0;
var y = 0;
var vx = 1;
var vy = 1;
var w = 75;
var h = 54;
var colors = ['blue', 'green', 'yellow', 'orange', 'purple', 'red']
var img = document.getElementById('dvd');

const canDiv = document.getElementById('cDiv');

//get sive of the div containing the canvas
function getDivSize() {
    var rect = canDiv.getBoundingClientRect();
    return [rect.width, rect.height]
};

//set initial size of the canvas to fill the div
let size = getDivSize();
let W = size[0];
let H = size[1];

//function to set the canvas size while running
function setCanvasSize(w,h) {
    var ctx = document.getElementById("c").getContext("2d");
    ctx.canvas.width = w;
    ctx.canvas.height = h;
};

function gcd(a,b) {
    var temp;
    if(a < 0) {a = -a;};
    if(b < 0) {b = -b;};
    if(b > a) {temp = a; a = b; b = temp;};
    while (true) {
        a %= b;
        if(a == 0) {return b;};
        b %= a;
        if(b == 0) {return a;};
    };
    return b;
}
    
function lcm(a,b) {
    return Math.abs(a*b)/gcd(a,b);
}

var W0 = W - w;
var H0 = H - h;

function rand(items) {
    // "|" for a kinda "int div"
    return items[items.length * Math.random() | 0];
}

function newColor() {
    var nColor = rand(colors)
    img.src = '../assets/' + nColor + '.png'
};

if (Math.abs(x-y) % gcd(W0, H0) == 0) {
    // corners will be reached
    if ((Math.abs(x-y) / gcd(W0, H0)) % 2 == 0) {
        console.log((lcm(W0,H0)/H0) % 2 == 0 ? 'T' : 'B');
        console.log((lcm(W0,H0)/W0) % 2 == 0 ? 'L' : 'R');
        console.log('T');
        console.log('L');
    
    } else {
        console.log((lcm(W0,H0)/H0) % 2 != 0 ? 'T' : 'B');
        console.log((lcm(W0,H0)/W0) % 2 != 0 ? 'L' : 'R');
        console.log('B');
        console.log('R');
    }
}
    
    
function animate() {

    //get the size of the div
    var size = getDivSize();
    var width = size[0];
    var height = size[1];

    var reqAnimFrame = window.requestAnimationFrame
    
    reqAnimFrame(animate);

    for (var i=0;i<1;i++) { // change if you want it to go faster
        x += vx;
        y += vy;
        if(x+w==width) {
            vx = -vx;
            newColor();
        };
        if(y+h==height) {
            vy = -vy;
            newColor();
        };
        if(x==0) {
            vx = -vx;
            newColor();
        };
        if(y==0) {
            vy = -vy;
            newColor();
        };
    };
    
    draw(width, height);
};
    
    
function draw(width, height) {
    var canvas  = document.getElementById("c");
    var context = canvas.getContext("2d");

    setCanvasSize(width, height);

    context.clearRect(0, 0, width, height);
    context.fillStyle = "#000000";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "#000000";
    context.fillRect(x, y, w, h);
    context.drawImage(img, x, y, w, h);

    // test whether we are in a corner
    if (x == 0 && y == 0) {
        context.clearRect(0, height, width, 200);
        context.fillText("TOP LEFT", 10, height+100);
    } else if (x == 0 && y + h == height) {
        context.clearRect(0, height, width, 200);
        context.fillText("BOTTOM LEFT", 10, height+100);
    } else if (x + w == width && y == 0) {
        context.clearRect(0, height, width, 200);
        context.fillText("TOP RIGHT", 10, H+100);
    } else if (x + w == width && y + h == height) {
        context.clearRect(0, height, width, 200);
        context.fillText("BOTTOM RIGHT", 10, H+100);
    }
};

var ctx = document.getElementById("c").getContext("2d");
setCanvasSize(W, H);
ctx.font = 'italic 20pt Calibri';

animate();