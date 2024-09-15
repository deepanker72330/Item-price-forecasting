import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import PrePage from '../PredictionPage/index';
import Login from "../LogIn/Login";
import Signup from "../SignUp/SignUp"
import MainPage from '../MainPage/index';

const index = () => {
    return (
        <Switch>
            <Route path='/predict' exact component={PrePage}/>
            <Route path="/" exact component={MainPage} />
            <Route path="/Login" component={Login}/>
            <Route path="/Signup" component={Signup}/>
            <Route path="*" render={()=>{return(<Redirect push to='/login'/>)}}/>
        </Switch>
    );
}

export default index;
