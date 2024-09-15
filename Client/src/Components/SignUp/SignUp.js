import { CssBaseline, Grid, makeStyles, Paper } from "@material-ui/core";
import React from "react";
import Helper from "./Helper";
import bg2 from '../../common/images/2.jpg';

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: `url(${bg2})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    height: "100vh"
  },
  logincon: {
    justifyContent: "center",
    alignItems: "center",
  },
  signupside: {
    height: "100vh"
  }
}));

export default function Signup() {
  const classes = useStyles();
  return (
    <Grid container component="main" className={classes.root} alignItems="center">
      <CssBaseline />
      <Grid item xs={false} sm={3} md={6} className={classes.image} />
      <Grid item xs={12} sm='auto' md={6} component={Paper} className={classes.signupside}>
        <Helper />
      </Grid>
    </Grid>
  );
}
