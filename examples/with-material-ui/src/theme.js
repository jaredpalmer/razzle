import { createMuiTheme } from '@material-ui/core/styles';
import { indigo, orange } from '@material-ui/core/colors';

// Configure Material UI theme
const theme = createMuiTheme({
  palette: {
    primary: indigo,
    accent: orange,
    type: 'light',
  },
});

export default theme;
