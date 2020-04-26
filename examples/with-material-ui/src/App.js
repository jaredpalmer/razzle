import "./App.css";
import React from "react";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    margin: theme.spacing(3),
  }),
}));

const App = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.root} elevation={4}>
      <Typography type="headline" component="h3">
        This is a sheet of paper.
      </Typography>
      <Typography type="body1" component="p">
        Paper can be used to build surface or other elements for your
        application.
      </Typography>
    </Paper>
  );
};

export default App;
