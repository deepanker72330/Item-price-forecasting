import React, { useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import { Formik } from "formik";
import Loader from "../Loader/loader";
import { message } from 'antd';
import { LOGIN_ENDPOINT } from '../../API';

const useStyles = makeStyles((theme) => ({
  avatarClass: {
    margin: "auto",
    backgroundColor: "#3f50b5",
  },
  signintext: {
    textAlign: "center",
    textTransform: "capitalize",
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
    marginTop: theme.spacing(25),
    justifyContent: "center",
    alignItems: "center",
  },
}));

export default function Helper() {
  const classes = useStyles();
  const [jwt, setjwt] = useState(null);
  const [load, setload] = useState(true);
  const gettoken = () => {
    let jwt = localStorage.getItem("jwt");
    setjwt(jwt);
  };
  useEffect(() => {
    gettoken();
    setload(false);
  }, []);

  if (load === true) {
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
      return <Redirect push to="/" />;
    } else {
      return (
        <Box boxShadow={5} className={classes.maincontainer}>
          <Avatar className={classes.avatarClass}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h4" className={classes.signintext}>
            Sign in
          </Typography>
          <Formik
            initialValues={{ username: "", password: "" }}
            onSubmit={(values) => {
              axios({
                method: "post",
                url: LOGIN_ENDPOINT,
                data: {
                  username: values.username,
                  password: values.password,
                },
                withCredentials: true,
              })
                .then((res) => {
                  localStorage.setItem("jwt", res.data);
                  setjwt(res.data);
                })
                .catch((e) => {
                  status = e.response.status;
                  if (status == 404) {
                    message.error("User Not Found, Please Signup");
                  } else if (status == 403) {
                    message.error("Wrong Password");
                  } else {
                    message.error("Something went wrong! Please try again");
                  }
                });
            }}
          >
            {(props) => (
              <form onSubmit={props.handleSubmit}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  value={props.values.username}
                  onChange={props.handleChange}
                  id="username"
                  label="Email Address"
                  name="username"
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  value={props.values.password}
                  onChange={props.handleChange}
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Sign in
                </Button>
                <Typography variant="h4" style={{ fontSize: 15, marginTop: 5 }}>
                  Don't have an account?
                  <Link
                    to="/signup"
                    variant="head2"
                    color="#3f50b5"
                    className={classes.lastintext}
                  >
                    Signup
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
