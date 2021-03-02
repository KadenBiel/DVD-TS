var x = 0;
var y = 0;
var vx = 1;
var vy = 1;
var w = 75;
var h = 54;

var W = 640;
var H = 480;

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


console.log('W0 ' + W0);
console.log('H0 ' + H0);
console.log('gcd ' + gcd(W0, H0));
console.log('lcm w h ' + lcm(W0, H0));

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
} else {
    console.log("No corner!");
}
    
    
function animate() {

    reqAnimFrame = window.mozRequestAnimationFrame    ||
                window.webkitRequestAnimationFrame ||
                window.msRequestAnimationFrame     ||
                window.oRequestAnimationFrame
                ;
    
    reqAnimFrame(animate);

    for (var i=0;i<1;i++) { // change if you want it to go faster
        x += vx;
        y += vy;
        if(x+w==W) vx = -vx;
        if(y+h==H) vy = -vy;
        if(x==0) vx = -vx;
        if(y==0) vy = -vy;
    }
    
    draw();
}
    
    
function draw() {
    var canvas  = document.getElementById("c");
    var context = canvas.getContext("2d");
    
    context.clearRect(0, 0, W, H);
    context.fillStyle = "#000000";
    context.fillRect(0, 0, W, H);
    context.fillStyle = "#00ff00";
    context.fillRect(x, y, w, h);
    //context.drawImage(img, x, y, w, h);

    // test whether we are in a corner
    if (x == 0 && y == 0) {
        context.clearRect(0, H, W, 200);
        context.fillText("TOP LEFT", 10, H+100);
    } else if (x == 0 && y + h == H) {
        context.clearRect(0, H, W, 200);
        context.fillText("BOTTOM LEFT", 10, H+100);
    } else if (x + w == W && y == 0) {
        context.clearRect(0, H, W, 200);
        context.fillText("TOP RIGHT", 10, H+100);
    } else if (x + w == W && y + h == H) {
        context.clearRect(0, H, W, 200);
        context.fillText("BOTTOM RIGHT", 10, H+100);
    }
}
var ctx = document.getElementById("c").getContext("2d");
ctx.canvas.width = W;
ctx.canvas.height = H+200;
ctx.font = 'italic 20pt Calibri';
//var img=document.createElement('image');
//img.src='http://www.otakia.com/wp-content/uploads/V_1/article_3565/7388.jpg';


animate();