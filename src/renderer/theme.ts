import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

// Create a theme instance.
const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#006064',
		},
		secondary: {
			main: '#9999ff',
		},
		background: {
			default: '#000000',
			paper: '#202020',
		},
		type: 'dark',
	},
});

export default theme;