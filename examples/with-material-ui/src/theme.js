import { createMuiTheme } from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/purple';
import orange from '@material-ui/core/colors/purple';

// Configure Material UI theme
const theme = createMuiTheme({
  palette: {
    primary: indigo,
    accent: orange,
    type: 'light',
  },
});

export default theme;
