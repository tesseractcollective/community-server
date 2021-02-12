import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
    palette: {
        primary: {
            // light: will be calculated from palette.primary.main,
            main: '#5f34b0',
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
          },
        secondary: {
            // light: will be calculated from palette.primary.main,
            main: '#ff4400',
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
          },
        error: {
            // light: will be calculated from palette.primary.main,
            main: '#ff4400',
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
          },
        contrastThreshold: 3,
        tonalOffset: 0.2,
    },
});
