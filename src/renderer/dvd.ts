import { ipcRenderer } from "electron";
import { /*IpcMessages,*/ IpcRendererMessages } from '../common/ipc-messages';
import path from 'path';

var img = <HTMLImageElement> document.createElement('img');
// @ts-ignore
const imgPath = path.join(__static, './img/dvd.png');
img.src = imgPath;

/*ipcRenderer.on(IpcMessages.DVD_LOADED, () => {
    img.src = `loadImg://${imgPath}`
    console.log(imgPath)
})*/

const can = <HTMLCanvasElement> document.createElement('canvas');

ipcRenderer.on(IpcRendererMessages.START_DVD, () => {
    console.log('getting settings')
    ipcRenderer.send(IpcRendererMessages.GET_SETTINGS);
    ipcRenderer.on(IpcRendererMessages.RETURN_SETTINGS, (event, settings) => {
        console.log('got settings')
        ipcRenderer.removeAllListeners(IpcRendererMessages.RETURN_SETTINGS);
        var h = settings.size;
        var w = Math.round(h/(2/3));
        var dS = settings.dvdSpeed;
        var colors = settings.colors;
        console.log('initializing dvd')
        dvd(w,h,dS,colors);
    })
})

export default function dvd(w,h,dS,colors){    
    let x = 0;
    let y = 20;
    var vx = 1;
    var vy = 1;
    var r = 0;
    var g = 255;
    var b = 0;
    let imgData = null;

    const canDiv = document.getElementById('cDiv');
    const ctx = can.getContext("2d");

    canDiv.appendChild(can)

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

    function HexToRGB(Hex)
    {
        var Long = parseInt(Hex.replace(/^#/, ""), 16);
        return {
            R: (Long >>> 16) & 0xff,
            G: (Long >>> 8) & 0xff,
            B: Long & 0xff
        };
    }

    function newColor(width, height) {
        var nColor = HexToRGB(rand(colors))
        r = nColor.R
        g = nColor.G
        b = nColor.B

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height) 

        ctx.drawImage(img, x, y, w, h);

        imgData = ctx.getImageData(x, y, w, h);

        for (var i = 0; i < imgData.data.length; i += 4) {
            if (imgData.data[i] == 255) {
                imgData.data[i] = r;
                imgData.data[i+1] = g;
                imgData.data[i+2] = b;
                imgData.data[i+3] = 255;
            } else if (imgData.data[i] > 0) {
                imgData.data[i] = 0;
                imgData.data[i+1] = 0;
                imgData.data[i+2] = 0;
                imgData.data[i+3] = 255;
            }
        }
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
                newColor(width, height);
            };
            if(y+h==height) {
                vy = -vy;
                newColor(width, height);
            };
            if(x==0) {
                vx = -vx;
                newColor(width, height);
            };
            if(y==20) {
                vy = -vy;
                newColor(width, height);
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

        setCanvasSize(width, height);

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height);

        ctx.putImageData(imgData, x, y);

        // test whether we are in a corner
        if (x == 0 && y == 20) {
            ctx.clearRect(0, height, width, 200);
            ctx.fillText("TOP LEFT", 10, height+100);
        } else if (x == 0 && y + h == height) {
            ctx.clearRect(0, height, width, 200);
            ctx.fillText("BOTTOM LEFT", 10, height+100);
        } else if (x + w == width && y == 20) {
            ctx.clearRect(0, height, width, 200);
            ctx.fillText("TOP RIGHT", 10, H+100);
        } else if (x + w == width && y + h == height) {
            ctx.clearRect(0, height, width, 200);
            ctx.fillText("BOTTOM RIGHT", 10, H+100);
        }
    };

    setCanvasSize(W, H);
    ctx.font = 'italic 20pt Calibri';
    newColor(W, H);
    animate();
}