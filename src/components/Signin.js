import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';

const styles = theme => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
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
    margin: theme.spacing(3, 0, 2),
  },
});

class Signin extends Component{
  constructor(props){
    super(props)
    this.state={
      phone: '',
      password: ''
    }

     this.props.socket.on('authReply',(token, phone)=>{
      if (token==='Authentication Failed'){
        alert('Login Failed...')
        console.log('Login Failed...')
      }else{
        this.props.login(token,phone)
      }
      })
   }
  

	

  onChangePhone = (e) => this.setState({phone: e.target.value})

  onChangePassword = (e) => this.setState({password: e.target.value})

  onClick = () => {
    this.props.socket.emit('authenticate',this.state.phone,this.state.password)
  }

	render(){
		const { classes } = this.props;
		return(
            <Grid container component="main" className={classes.root}>
                <CssBaseline />
                <Grid item xs={false} sm={4} md={7} className={classes.image} />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <div className={classes.paper}>
                        <form className={classes.form}>
                            <TextField
                              variant="outlined"
                              margin="normal"
                              required
                              fullWidth
                              label="Phone"
                              name="phone"
                              value={this.state.phone}
                              onChange={this.onChangePhone}
                              autoFocus/>
                            <TextField
                              variant="outlined"
                              margin="normal"
                              required
                              fullWidth
                              name="password"
                              label="Password"
                              type="password"
                              value={this.state.password}
                              onChange={this.onChangePassword}/>
                            <Button
                              fullWidth
                              variant="contained"
                              color="primary"
                              className={classes.submit}
                              onClick={this.onClick}>
                              Sign In
                            </Button>
                            <Grid container>
                                <Grid item xs> </Grid>
                                <Grid item>
                                    <Link onClick={this.props.register}>Register</Link>
                                </Grid>
                            </Grid>
                            <Box mt={5}>
                            </Box>
                        </form>
                    </div>
                </Grid>
            </Grid>
        );
    }
   
}

export default withStyles(styles, {withTheme: true}) (Signin);