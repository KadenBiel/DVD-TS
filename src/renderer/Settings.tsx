import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import ChevronLeft from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
import { ipcRenderer } from 'electron';
import { IpcRendererMessages } from '../common/ipc-messages';

interface StyleInput {
	open: boolean;
}

let dvdSpeed, size, colors, askUpdate;

ipcRenderer.send(IpcRendererMessages.GET_SETTINGS)
ipcRenderer.on(IpcRendererMessages.RETURN_SETTINGS, (event, settings) => {
    ipcRenderer.removeAllListeners(IpcRendererMessages.RETURN_SETTINGS);
    size = settings.size;
	dvdSpeed = settings.dvdSpeed;
    colors = settings.colors;
	askUpdate = settings.askUpdate
});

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100vw',
		height: `calc(100vh - ${theme.spacing(3)}px)`,
		background: '#171717ad',
		backdropFilter: 'blur(4px)',
		position: 'absolute',
		left: 0,
		top: 0,
		zIndex: 99,
		alignItems: 'center',
		marginTop: theme.spacing(3),
		transition: 'transform .1s ease-in-out',
		WebkitAppRegion: 'no-drag',
		transform: ({ open }: StyleInput) => (open ? 'translateX(0)' : 'translateX(-100%)'),
	},
	header: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: 40,
	},
	scroll: {
		paddingTop: theme.spacing(1),
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
		overflowY: 'auto',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'start',
		alignItems: 'center',
		paddingBottom: theme.spacing(7),
		height: `calc(100vh - 40px - ${theme.spacing(7 + 3 + 3)}px)`,
	},
	shortcutField: {
		marginTop: theme.spacing(1),
	},
	back: {
		cursor: 'pointer',
		position: 'absolute',
		right: theme.spacing(1),
		WebkitAppRegion: 'no-drag',
	},
	alert: {
		position: 'absolute',
		bottom: theme.spacing(1),
		zIndex: 10,
	},
	urlDialog: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'start',
		'&>*': {
			marginBottom: theme.spacing(1),
		},
	},
	formLabel: {
		width: '100%',
		borderTop: '1px solid #313135',
		marginRight: '0px',
		// paddingBottom:'5px'
	},
}));

/*const Divider = withStyles((theme) => ({
	root: {
		width: '100%',
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
	},
}))(MuiDivider);*/

export interface SettingsProps {
	open: boolean;
	onClose: () => void
};

const Settings: React.FC<SettingsProps> = function ({ open, onClose }: SettingsProps) {
	const classes = useStyles({ open });
	return (
		<Box className={classes.root}>
			<div className={classes.header}>
				<IconButton
					className={classes.back}
					size="small"
					onClick={() => {
						onClose();
						ipcRenderer.send(IpcRendererMessages.SAVE_SETTINGS, {
							size: size,
							dvdSpeed: dvdSpeed,
							colors: colors,
							askUpdate: askUpdate
						})
					}}
				>
					<ChevronLeft htmlColor="#777" />
				</IconButton>
				<Typography variant="h6">Settings</Typography>
			</div>
		</Box>
	);
};

export default Settings;