import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import ChevronLeft from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
import MuiDivider from '@material-ui/core/Divider';
//import { SliderPicker } from 'react-color';
import { ipcRenderer } from 'electron';
import { IpcRendererMessages } from '../common/ipc-messages';
import { Checkbox, FormControlLabel, Slider, Button} from '@material-ui/core';
import { store, setDefaultSettings, newColor, remColor, colorChange } from './settingHelper';

interface StyleInput {
	open: boolean;
}

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
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
		paddingTop: 0,
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
		overflowY: 'auto',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'start',
		alignItems: 'center',
		paddingBottom: theme.spacing(7),
		height: '100%',
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
		textAlign: 'center',
		fontSize: '16pt'
	},
	controlLabel: {
		width: '100%',
		marginRight: '0px',
		fontSize: '14pt'
	},
	slider: {
		width: '75vw'
	},
	formContainer: {
		width: 'auto',
		height: 'auto',
		justifyContent: 'start',
		alignItems: 'center'
	},
	button: {
		WebkitAppRegion: 'no-drag',
		marginLeft: '25%',
		float: 'left'
	},
	buttonContainer: {
		width: '100vw',
		float: 'none'
	}
}));

const Divider = withStyles((theme) => ({
	root: {
		width: '100%',
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
	},
}))(MuiDivider);

export interface SettingsProps {
	open: boolean;
	onClose: () => void
};

function valueText(value: number) {
	return `${value}°C`;
}

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
						colorChange();
						ipcRenderer.send(IpcRendererMessages.SAVE_SETTINGS, {
							size: store.get('size'),
							dvdSpeed: store.get('speed'),
							colors: store.get('colors'),
							askUpdate: store.get('askUpdate')
						})
					}}
				>
					<ChevronLeft htmlColor="#777" />
				</IconButton>
				<Typography variant="h6">Settings</Typography>
			</div>
			<div className={classes.scroll}>
				<div className={classes.formContainer}>
					<Typography className={classes.formLabel} id="discrete-slider1" gutterBottom>
						Speed
					</Typography>
					<Slider
						className={classes.slider}
						defaultValue={1}
						value={store.get('speed')}
						getAriaValueText={valueText}
						aria-labelledby="discrete-slider1"
						valueLabelDisplay="auto"
						step={1}
						marks
						min={1}
						max={20}
					/>
				</div>
				<Divider/>
				<div className={classes.formContainer}>
					<Typography className={classes.formLabel} id="discrete-slider2" gutterBottom>
						Size
					</Typography>
					<Slider
						className={classes.slider}
						defaultValue={54}
						value={store.get('size')}
						getAriaValueText={valueText}
						aria-labelledby="discrete-slider1"
						valueLabelDisplay="auto"
						step={1}
						marks
						min={1}
						max={150}
					/>
				</div>
				<Divider/>
				<div className={classes.formContainer}>
					<Typography className={classes.formLabel} id="colors">
						Colors
					</Typography>
					<div id="colorDiv">
						{ /* container for color pickers */}
					</div>
					<div className={classes.buttonContainer}>
						<Button
							className={classes.button}
							onClick={() => newColor()}
							variant={'contained'}
						>
							New Color
						</Button>
						<Button
							className={classes.button}
							onClick={() => remColor()}
							variant={'contained'}
						>
							Remove Color
						</Button>
					</div>
				</div>
				<Divider />
				<div className={classes.formContainer}>
					<Typography className={classes.formLabel}>
						General
					</Typography>
					<FormControlLabel
						className={classes.controlLabel}
						label='Ask Before Updating'
						checked={store.get('askUpdate')}
						onChange={(_, checked: boolean) => {
							store.set('askUpdate', checked)
						}}
						control={<Checkbox/>}
					/>
				</div>
				<Divider />
				<div>
					<Button
						variant="contained"
						color="secondary"
						onClick={() => setDefaultSettings()}
						>
							Reset To Defaults
					</Button>
				</div>
			</div>
		</Box>
	);
};

export default Settings;