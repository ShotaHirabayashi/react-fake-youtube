import React, {useReducer} from 'react'
import { withCookies } from 'react-cookie';
import axios from 'axios';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import {START_FETCH, FETCH_SUCCESS, ERROR_CATCHED, INPUT_EDIT, TOGGLE_MODE} from './actionTypes';
import { CircularProgress } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3),
    },
    span :{
        display:'flex',
        flexDirection:'column',
        alignItems: 'center',
        color: 'teal',
    },
    spanError : {
        display:'flex',
        flexDirection:'column',
        alignItems: 'center',
        color: 'fuchsia',
        marginTop: 10,
    }
  }));

  const initialState = {
      isLoading: false,
      isLoginView: true,
      error: '',
      credentialsLog : {
          email: '',
          password: ''
      }

  }

  const loginReducer = (state, action) => {
      switch(action.type){
          case START_FETCH: {
              return{
                ...state,
                isLoading: true,
              };
          }

        case FETCH_SUCCESS: {
            return{
                ...state,
                isLoading: false,
              };
        }
        case ERROR_CATCHED: {
            return{
                ...state,
                error:'Email os password is not correct !',
                isLoading: false,
              };
        }
        case INPUT_EDIT: {
            return{
                ...state,
                [action.inputName]: action.payload,
                error: '',
              };
        }
        case TOGGLE_MODE: {
            return{
                ...state,
                isLoginView: !state.isLoginView,
              };
        }
        default:
            return state;
    }
  }



const Login = (props) => {
    const classes = useStyles();
    const [state, dispatch] = useReducer(loginReducer, initialState)

    const inputChangedLog = () => event => {
        const cred = state.credentialsLog;
        cred[event.target.name] = event.target.value;
        dispatch({
            type: INPUT_EDIT,
            inputName: 'state.credentialLog',
            payload: cred,
        })
    }

    const login = async(event) => {
        event.preventDefault();
        if(state.isLoginView){
            try{
                dispatch({type:START_FETCH})
                const res = await axios.post('http://127.0.0.1:8000/authen/jwt/create/',state.credentialsLog,{
                    headers: {'Content-Type': 'application/json'}})
                props.cookies.set('jwt-token', res.data.access);
                res.data.access ? window.location.href = '/youtube' : window.location.href = "/"
                dispatch({type: FETCH_SUCCESS})
            }catch {
                dispatch({typr:ERROR_CATCHED})
            }
        }else{
            try{
                dispatch({type:START_FETCH})

                await axios.post('http://127.0.0.1:8000/api/create/',state.credentialsLog,{
                    headers: {'Content-Type': 'application/json'}})

                const res = await axios.post('http://127.0.0.1:8000/authen/jwt/create/',state.credentialsLog,{
                    headers: {'Content-Type': 'application/json'}})

                
                props.cookies.set('jwt-token', res.data.access);
                res.data.access ? window.location.href = '/youtube' : window.location.href = "/"
                dispatch({type: FETCH_SUCCESS})
            }catch {
                dispatch({typr:ERROR_CATCHED})          
        }

        }   
    }

    const toggleView = () => {
        dispatch({type: TOGGLE_MODE})
    }



    return (
        <Container maxWidth="xs">
            <form onSubmit={login}>
                <div className={classes.paper}>
                    {state.isLoading && <CircularProgress />}
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography variant="h5">
                        {state.isLoginView ? 'Login' : 'Register'}
                    </Typography>
                    <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={state.credentialsLog.email}
            label="Email Address"
            name="email"
            onChange={inputChangedLog()}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="password"
            value={state.credentialsLog.password}
            label="Password"
            type="password"
            onChange={inputChangedLog()}
          />
          <span className={classes.spanError}>{state.error}</span>

        { state.isLoginView ?
            !state.credentialsLog.password || !state.credentialsLog.email ?
            <Button className={classes.submit} type='submit' fullWidth disabled
            variant='contained' color='primary'>Login</Button>
            :<Button className={classes.submit} type='submit' fullWidth
            variant='contained' color='primary'>Login</Button>
            :
            !state.credentialsLog.password || !state.credentialsLog.email ?
            <Button className={classes.submit} type='submit' fullWidth disabled
            variant='contained' color='primary'>Register</Button>
            :<Button className={classes.submit} type='submit' fullWidth
            variant='contained' color='primary'>Register</Button>
        }



          <span onClick={() => toggleView()} className={classes.span}>
              {state.isLoginView ? 'Create Account' : 'Back to login'}
          </span>
                </div>
            </form>
        </Container>
    )
}

export default withCookies(Login)
