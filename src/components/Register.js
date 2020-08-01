import React, {Component} from 'react'
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';


const styles = theme=>({
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
    	width: '100%',
    	marginTop: theme.spacing(1),
  	},
  	submit: {
    	margin: theme.spacing(3, 0, 2),
  	}
})


class Register extends Component{

  constructor(props){
    super(props)
    this.props.socket.on('regReply', res =>{
      console.log(res)
      if (res==='Registration Succeeded'){
        this.props.returnToLogin()
      }else{
        console.log('Registration Failed...')
      }
    })
  }

	state={
		  phone: '',
    	password: ''
	}

	handleOnChangePhone =e=>{
  		this.setState({phone: e.target.value})
  	}

  	handleOnChangePassword =e=>{
  		this.setState({password: e.target.value})
  	}

  	onClick=()=>{
  		this.props.socket.emit('register',this.state.phone, this.state.password)
  	}




	
  render () {
    const {classes} = this.props;
    return (
      <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div 
      className={classes.paper}>
        <Typography style={{paddingTop: 50}}component="h1" variant="h5">
          Create an Account
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="phone"
            label="Phone"
            name="phone"
            value={this.state.phone}
            onChange={this.handleOnChangePhone}
            autoFocus/>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={this.state.password}
            onChange={this.handleOnChangePassword}/>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={this.onClick}>
            Create an Account
          </Button>
          <Grid container>
            <Grid item xs>
            </Grid>
            <Grid item>
              <Link 
                onClick={this.props.returnToLogin}>
                Already have an account? Login here!
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
    );
  }
}

export default withStyles(styles, {withTheme: true})(Register)