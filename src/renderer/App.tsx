import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import ReactDOM from 'react-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import SettingsIcon from '@material-ui/icons/Settings';
import CloseIcon from '@material-ui/icons/Close';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogContentText,
	DialogActions,
	Button,
	IconButton,
	LinearProgress,
	ThemeProvider
} from '@material-ui/core';
import prettyBytes from 'pretty-bytes';
//import { ISettings } from '../common/ISettings';
import { 
	//IpcMessages,
	IpcRendererMessages,
	AutoUpdaterState,
	IpcMessages
} from '../common/ipc-messages';
import theme from './theme';
import Settings from './Settings';

let askUpdate: boolean;

let appVersion = 'DEV';
if (typeof window !== 'undefined' && window.location) {
	const query = new URLSearchParams(window.location.search.substring(1));
	appVersion = query.get('version') || '';
}

ipcRenderer.send(IpcRendererMessages.GET_SETTINGS)
ipcRenderer.on(IpcRendererMessages.RETURN_SETTINGS, (event, settings) => {
    ipcRenderer.removeAllListeners(IpcRendererMessages.RETURN_SETTINGS);
    askUpdate = settings.askUpdate
});

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
				onClick={() => {setSettingsOpen(!settingsOpen);}}
			>
				<SettingsIcon htmlColor='#777' />
			</IconButton>
			<IconButton
				className={classes.button}
				size='small'
				style={{ right: 0 }}
				onClick={() => {
					ipcRenderer.send(IpcMessages.QUIT_DVD);
					console.log('close app')
				}}
			>
				<CloseIcon htmlColor='#777' />
			</IconButton>
		</div>
	);
};

export default function App(): JSX.Element  {
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [updaterState, setUpdaterState] = useState<AutoUpdaterState>({
		state: 'unavailable',
	});
	const [diaOpen, setDiaOpen] = useState(true);

	const classes = useStyles();

	useEffect(() => {
		const onAutoUpdaterStateChange = (_: Electron.IpcRendererEvent, state: AutoUpdaterState) => {
			setUpdaterState((old) => ({ ...old, ...state }));
			if (state.state === 'downloaded' && !askUpdate) {
				ipcRenderer.send(IpcMessages.RESTART_AND_UPDATE)
			}
		};
		ipcRenderer.on(IpcRendererMessages.AUTO_UPDATER_STATE, onAutoUpdaterStateChange);
		return () => {
			ipcRenderer.off(IpcRendererMessages.AUTO_UPDATER_STATE, onAutoUpdaterStateChange);
		};
	});
	return(
		<ThemeProvider theme={theme}>
			<TitleBar settingsOpen={settingsOpen} setSettingsOpen={setSettingsOpen} />
			<Settings open={settingsOpen} onClose={() => {setSettingsOpen(false);}} />
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
					{updaterState.state === 'downloaded' && askUpdate && (
						<>
							<LinearProgress variant={'indeterminate'} />
							<DialogContentText>Restart now or later?</DialogContentText>
						</>
					)}
					{updaterState.state === 'downloaded' && !askUpdate && (
						<>
							<DialogContentText>Restarting...</DialogContentText>
						</>
					)}
					{updaterState.state === 'error' && (
						<DialogContentText color="error">{updaterState.error}</DialogContentText>
					)}
				</DialogContent>
				{updaterState.state === 'error' && (
					<DialogActions>
						<Button href="https://github.com/KadenBiel/DVD-TS/releases/latest">Download Manually</Button>
					</DialogActions>
				)}
				{updaterState.state === 'downloaded' && askUpdate && (
					<DialogActions>
						<Button
							onClick={() => {
								ipcRenderer.send(IpcMessages.RESTART_AND_UPDATE);
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
                    <img src='../../assets/dvd.png' id='dvd' />
                    <script src='./dvd.ts'></script>
                </canvas>
            </div>
		</ThemeProvider>
	);
}

ReactDOM.render(<App />, document.getElementById('app'));