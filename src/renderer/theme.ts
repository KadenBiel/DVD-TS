import { red } from '@material-ui/core/colors';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

// Create a theme instance.
const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#ffffff',
		},
		secondary: red,
		background: {
			default: '#000000',
			paper: '#202020',
		},
		type: 'dark',
	},
});

export default theme;