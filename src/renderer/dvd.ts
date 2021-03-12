const { ipcRenderer } = require('electron');
const version = document.getElementById('version');

ipcRenderer.send('app_version');
ipcRenderer.on('app_version', (event, arg) => {
    ipcRenderer.removeAllListeners('app_version');
    version.innerText = 'DVD Screen v' + arg.version;
    console.log(arg.url);
});
  
ipcRenderer.on('update_available', () => {
    ipcRenderer.removeAllListeners('update_available');
    alert('New update available! downloading now!')
});
      
ipcRenderer.on('update_downloaded', (info) => {
    ipcRenderer.removeAllListeners('update_downloaded');
    if(confirm("Update downloaded. Hit OK to restart and install the update.")) {
        ipcRenderer.send('restart_app')
    }
});

ipcRenderer.send('get-settings')
ipcRenderer.on('send-settings', (event, settings) => {
    ipcRenderer.removeAllListeners('send-settings');
    var h = settings.size;
    var w = Math.round(h/(2/3));
    var dS = settings.dvdSpeed;
    startDvd(w,h,dS);
});

function startDvd(w,h,dS) {    
    let x = 0;
    let y = 0;
    var vx = 1;
    var vy = 1;
    var colors = ['blue', 'green', 'yellow', 'orange', 'purple', 'red']
    var img = document.getElementById('dvd');

    ipcRenderer.on('resize', () => {
        console.log('resize')
        size = getDivSize();
        
    });

    const canDiv = document.getElementById('cDiv');
    const ctx = document.getElementById("c").getContext("2d");

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

    function rand(items) {
        // "|" for a kinda "int div"
        return items[items.length * Math.random() | 0];
    }

    function newColor() {
        var nColor = rand(colors)
        img.src = '../../assets/' + nColor + '.png'
    };

    var W0 = W - w;
    var H0 = H - h;

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

        for (var i=0;i<dS;i++) { // change if you want it to go faster
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
            if (x+w > width) {
                x = width-w-1
            };
            if (y+h > height) {
                y = height-h-1
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

    setCanvasSize(W, H);
    ctx.font = 'italic 20pt Calibri';
    animate();
}