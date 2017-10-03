import './App.css';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    margin: theme.spacing.unit * 3,
  }),
});

const App = ({classes}) => (
  <Paper className={classes.root} elevation={4}>
    <Typography type="headline" component="h3">
      This is a sheet of paper.
    </Typography>
    <Typography type="body1" component="p">
      Paper can be used to build surface or other elements for your application.
    </Typography>
  </Paper>
);

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
