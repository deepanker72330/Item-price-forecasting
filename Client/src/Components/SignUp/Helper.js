import React, { useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { Link, Redirect } from "react-router-dom";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import Loader from "../Loader/loader";
import { message } from 'antd';
import { SIGNUP_ENDPOINT } from '../../API';

const schema = yup.object().shape({
  username: yup.string().email("Please enter a valid email").required(),
  password: yup.string().min(6, "Too short").required(),
  password2: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must be same")
    .required(),
});

const useStyles = makeStyles((theme) => ({
  avatarClass: {
    margin: "auto",
    backgroundColor: "#3f50b5",
  },
  signintext: {
    textAlign: "center",
    textTransform: "uppercase",
    fontWeight: "bold",
    fontSize: theme.spacing(3),
    margin: theme.spacing(2),
  },
  lastintext: {
    color: "blue",
    fontSize: theme.spacing(1.9),
    textDecoration: "underline",
  },
  maincontainer: {
    width: theme.spacing(60),
    padding: theme.spacing(5),
    margin: "auto",
    marginTop: theme.spacing(20),
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "red",
    fontSize: 10,
    height: 10,
    marginTop: 10,
    marginBottom: 10,
  },
}));

export default function Helper() {
  const [jwt, setjwt] = useState(false);
  const [load, setload] = useState(true);
  const classes = useStyles();
  const gettoken = () => {
    let jwt = localStorage.getItem("jwt");
    setjwt(jwt);
  }
  useEffect(() => {
    gettoken();
    setload(false);
  }, []);
  if (load) {
    return (
      <div
        style={{
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          height: "100vh",
        }}
      >
        <Loader />
      </div>
    );
  } else {
    if (jwt) {
      return <Redirect to="/" />;
    } else {
      return (
        <Box boxShadow={5} className={classes.maincontainer}>
          <Typography variant="h4" className={classes.signintext}>
            Sign up
          </Typography>
          <Formik
            initialValues={{ username: "", password: "", password2: "" }}
            onSubmit={(values) => {
              axios({
                method: "post",
                url: SIGNUP_ENDPOINT,
                data: {
                  username: values.username,
                  password: values.password,
                },
              })
                .then(() => {
                  message.success("Voila! You may login now");
                })
                .catch((e) => {
                  status = e.response.status;
                  if (status == 409) {
                    message.error("Username already present");
                  } else {
                    message.error("Something went wrong");
                  }
                });
            }}
            validationSchema={schema}
          >
            {(props) => (
              <form onSubmit={props.handleSubmit}>
                <TextField
                  variant="outlined"
                  margin="none"
                  required
                  fullWidth
                  value={props.values.username}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  id="username"
                  label="Email Address"
                  name="username"
                  autoComplete="email"
                  autoFocus
                />
                <Typography className={classes.error}>
                  {props.touched.username && props.errors.username}
                </Typography>
                <TextField
                  variant="outlined"
                  margin="none"
                  required
                  fullWidth
                  value={props.values.password}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <Typography className={classes.error}>
                  {props.touched.password && props.errors.password}
                </Typography>
                <TextField
                  variant="outlined"
                  margin="none"
                  required
                  fullWidth
                  value={props.values.password2}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  name="password2"
                  label="Confirm Password"
                  type="password"
                  id="password2"
                  autoComplete="current-password"
                />
                <Typography className={classes.error}>
                  {props.touched.password2 && props.errors.password2}
                </Typography>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Sign Up
                </Button>
                <Typography variant="h4" style={{ fontSize: 15, marginTop: 5 }}>
                  Already have an account?
                  <Link
                    to="/login"
                    variant="head2"
                    color="#3f50b5"
                    className={classes.lastintext}
                  >
                    Login
                  </Link>
                </Typography>
              </form>
            )}
          </Formik>
        </Box>
      );
    }
  }
}
