import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { ipcRenderer } from 'electron';
import ReactDOM from 'react-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import SettingsIcon from '@material-ui/icons/Settings';
import CloseIcon from '@material-ui/icons/Close';
import { ThemeProvider } from '@material-ui/core/styles';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogContentText,
    DialogActions,
    Button,
    IconButton,
    LinearProgress
} from "@material-ui/core";
import prettyBytes from 'pretty-bytes';
import { ISettings } from '../common/ISettings';
import { 
    IpcMessages,
    IpcRendererMessages,
    AutoUpdaterState
} from '../common/ipc-messages';
import theme from './theme';
import Settings from './Settings';

let appVersion = '';

ipcRenderer.send(IpcRendererMessages.GET_VERSION);
ipcRenderer.on(IpcRendererMessages.RETURN_VERSION, (event, arg) => {
    ipcRenderer.removeAllListeners(IpcRendererMessages.RETURN_VERSION);
    appVersion = arg.version
});

ipcRenderer.send('get_settings')
ipcRenderer.on('return_settings', (event, settings) => {
    ipcRenderer.removeAllListeners('return_settings');
    var h = settings.size;
    var w = Math.round(h/(2/3));
    var dS = settings.dvdSpeed;
    var colors = settings.colors
    dvd(w,h,dS,colors)
});

function dvd(w,h,dS,colors){    
    let x = 0;
    let y = 0;
    var vx = 1;
    var vy = 1;
    var r = 0;
    var g = 255;
    var b = 0;
    var img = document.getElementById('dvd');
    let imgData = null;

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
            if(y==0) {
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
        if (x == 0 && y == 0) {
            ctx.clearRect(0, height, width, 200);
            ctx.fillText("TOP LEFT", 10, height+100);
        } else if (x == 0 && y + h == height) {
            ctx.clearRect(0, height, width, 200);
            ctx.fillText("BOTTOM LEFT", 10, height+100);
        } else if (x + w == width && y == 0) {
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

const useStyles = makeStyles(() => ({
	root: {
		position: 'absolute',
		width: '100vw',
		height: theme.spacing(3),
		backgroundColor: '#1d1a23',
		top: 0,
		WebkitAppRegion: 'drag',
	},
	title: {
		width: '100%',
		textAlign: 'center',
		display: 'block',
		height: theme.spacing(3),
		lineHeight: `${theme.spacing(3)}px`,
		color: theme.palette.primary.main,
	},
	button: {
		WebkitAppRegion: 'no-drag',
		marginLeft: 'auto',
		padding: 0,
		position: 'absolute',
		top: 0,
	},
    canvas: {
        width:'100%',
        height: '100vh'
    }
}));

interface TitleBarProps {
	settingsOpen: boolean;
	setSettingsOpen: Dispatch<SetStateAction<boolean>>;
}

const TitleBar: React.FC<TitleBarProps> = function ({ settingsOpen, setSettingsOpen }: TitleBarProps) {
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<span className={classes.title}>
                DVD Screen v{appVersion}
            </span>
            <IconButton
                className={classes.button}
                size='small'
                style={{ left: 0 }}
                onClick={() => {setSettingsOpen(!settingsOpen)}}
            >
                <SettingsIcon htmlColor='#777' />
            </IconButton>
            <IconButton
                className={classes.button}
                size='small'
                style={{ right: 0 }}
                onClick={() => {ipcRenderer.send('quit_app')}}
            >
                <CloseIcon htmlColor='#777' />
            </IconButton>
		</div>
	);
};

const App: React.FC = () => {
    const classes = useStyles();
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [updaterState, setUpdaterState] = useState<AutoUpdaterState>({
		state: 'unavailable',
	});
    const [diaOpen, setDiaOpen] = useState(true);
    useEffect(() => {
        const onAutoUpdaterStateChange = (_: Electron.IpcRendererEvent, state: AutoUpdaterState) => {
			setUpdaterState((old) => ({ ...old, ...state }));
		};
		ipcRenderer.on(IpcRendererMessages.AUTO_UPDATER_STATE, onAutoUpdaterStateChange);
        return () => {
            ipcRenderer.off(IpcRendererMessages.AUTO_UPDATER_STATE, onAutoUpdaterStateChange);
        }
    })
    return(
        <ThemeProvider theme={theme}>
            <TitleBar settingsOpen={settingsOpen} setSettingsOpen={setSettingsOpen} />
            <Settings open={settingsOpen} onClose={() => {setSettingsOpen(false)}} />
            <Dialog fullWidth open={(updaterState.state !== 'unavailable' && diaOpen)}>
                {updaterState.state === 'downloaded' && updaterState.info && (
				    <DialogTitle>Update v{updaterState.info.version}</DialogTitle>
				)}
                {updaterState.state === 'downloading' && <DialogTitle>Updating...</DialogTitle>}
                <DialogContent>
                    {updaterState.state === 'downloading' && updaterState.progress && (
						<>
							<LinearProgress variant={'determinate'} value={updaterState.progress.percent} />
								<DialogContentText>
								    {prettyBytes(updaterState.progress.transferred)} / {prettyBytes(updaterState.progress.total)}
								</DialogContentText>
						</>
					)}
					{updaterState.state === 'downloaded' && (
						<>
							<LinearProgress variant={'indeterminate'} />
							<DialogContentText>Restart now or later?</DialogContentText>
						</>
					)}
					{updaterState.state === 'error' && (
						<DialogContentText color="error">{updaterState.error}</DialogContentText>
					)}
                </DialogContent>
                {updaterState.state === 'error' && (
					<DialogActions>
						<Button href="https://github.com/OhMyGuus/CrewLink/releases/latest">Download Manually</Button>
					</DialogActions>
				)}
				{updaterState.state === 'downloaded' && (
					<DialogActions>
						<Button
							onClick={() => {
								ipcRenderer.send('update-app');
							}}
						> Now </Button>
						<Button
							onClick={() => {
								setDiaOpen(false);
							}}
					    > Later </Button>
					</DialogActions>
				)}
            </Dialog>
            <div id='cDiv' className={classes.canvas}>
                <canvas id='c'>
                    <img src='../../assets/dvd.png' />
                </canvas>
            </div>
        </ThemeProvider>
    )
}

export default App

ReactDOM.render(<App/>, document.getElementById('app'));