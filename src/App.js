import React, {Component} from 'react'
import './App.css'
import Signin from './components/Signin'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import decode from 'jwt-decode'

const io = require('socket.io-client')
const socket = io.connect('http://localhost:8000')
class App extends Component {
  state = {
    loggedIn: false,
    register: false,
    user: '',
  }

  componentDidMount(){
    const token=localStorage.getItem('id_token')
    const user=localStorage.getItem('id_user')
    if (token!=null && user!=null){
      if (!this.isTokenExpired(token)){
        this.setState({loggedIn: true, register: false, user:user})
      }
    }
  }

  isTokenExpired=(token)=>{
  try {
      const decodedToken = decode(token);
      console.log("expiry: ", decodedToken.exp, Date.now()/1000);
      if (decodedToken.exp < Date.now()/1000) {
        console.log('Valid token');
        return true;
      }
      return false;
    }
    catch (err) {
      return false;
    }
  }



  login = (token,phone) => {
    localStorage.setItem('id_token',token)
    localStorage.setItem('id_user',phone)
    this.setState({loggedIn: true, register:false, user: phone})
  }
  
  register = () => this.setState({register: true})

  returnToLogin = ()=> {
    this.setState({loggedIn: false, register: false})
  }

  render(){ 
    
    return (
        this.state.loggedIn?
        <Dashboard socket={socket} user={this.state.user} />
        :
        this.state.register?
        <Register socket={socket} returnToLogin={this.returnToLogin} />
        :
        <Signin socket={socket} login={this.login} register={this.register} />

      


    )
  }
}

export default App
