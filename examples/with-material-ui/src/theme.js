import { createMuiTheme } from 'material-ui/styles';
import indigo from 'material-ui/colors/purple';
import orange from 'material-ui/colors/purple';

const theme = createMuiTheme({
  palette: {
    primary: indigo,
    accent: orange,
    type: 'light',
  },
});

export default theme;
