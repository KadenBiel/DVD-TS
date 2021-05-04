import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { red, purple } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#006064',
		},
		secondary: {
            main: '#303f9f',
        },
		background: {
			default: '#000000',
			paper: '#202020',
		},
		type: 'dark',
	},
});

export default theme;