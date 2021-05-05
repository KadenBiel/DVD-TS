import React from 'react';
//import TextField from '@material-ui/core/TextField';
import makeStyles from '@material-ui/core/styles/makeStyles';
//import withStyles from '@material-ui/core/styles/withStyles';
import Box from '@material-ui/core/Box';
//import FormControlLabel from '@material-ui/core/FormControlLabel';
//import Radio from '@material-ui/core/Radio';
//import Checkbox from '@material-ui/core/Checkbox';
//import RadioGroup from '@material-ui/core/RadioGroup';
//import MuiDivider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
//import Grid from '@material-ui/core/Grid';
import ChevronLeft from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
//import Alert from '@material-ui/lab/Alert';
//import Slider from '@material-ui/core/Slider';
//import Tooltip from '@material-ui/core/Tooltip';
//import Dialog from '@material-ui/core/Dialog';
//import DialogTitle from '@material-ui/core/DialogTitle';
//import DialogContent from '@material-ui/core/DialogContent';
//import DialogActions from '@material-ui/core/DialogActions';
//import Button from '@material-ui/core/Button';
//import DialogContentText from '@material-ui/core/DialogContentText';

interface StyleInput {
	open: boolean;
}

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
	onClose: () => void;
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