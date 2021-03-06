import React from "react";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";

export default class Form extends React.Component {
  state = {
    receiverName:'',
    receiverPhone:'',
    message:'',
    date:'',
    time: ''
  };

  change = e => {
    // this.props.onChange({ [e.target.name]: e.target.value });
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  errorAlert= ()=>{
  	alert('Error with date input. Please input with format MM-DD')
  }

  validateDate = (date) => {
    if (date.length!=5){
		this.errorAlert()
		return 1
	}else if (date[2]!=='-'){
		this.errorAlert()
		return 1
	}else{
		let month=parseInt(date.substring(0,2))
		let day=parseInt(date.substring(3,5))
		if (!month || !day){
			this.errorAlert()
			return 1
		}else if (month<=0||month>12||day<=0||day>31){
			this.errorAlert()
			return 1
		}else if ((month==4||month==6||month==9||month==11) && day==31){
			this.errorAlert()
			return 1
		}else if (month==2 && day>29){
			this.errorAlert()
			return 1
		}else{
			return 0
		}
	}
  }

  timeErr = ()=>{
  	alert('Error with time input. Please input with format hh (00-11)')
  }

  validateTime = (time)=>{
  	if (time.length!=2){
  		this.timeErr()
  		return 1
  	}else{
  		let hour=parseInt(time)
  		if (isNaN(hour)){
  			this.timeErr()
  			return 1
  		}else if (hour>11 || hour<0){
  			this.timeErr()
  			return 1
  		}else{
  			return 0
  		}
  	}
  }

  onSubmit = e => {
    e.preventDefault();
    let err = this.validateDate(this.state.date) || this.validateTime(this.state.time);
    if (!err) {
      this.props.onSubmit(this.state);
      // clear form
      this.setState({
        receiverName:'',
        receiverPhone:'',
        message:'',
        date:'',
        time:''
      });
    }
  };

  render() {
    return (
      <form>
        <TextField
          name="receiverName"
          hintText="Name"
          floatingLabelText="Name"
          value={this.state.receiverName}
          onChange={e => this.change(e)}
          floatingLabelFixed
        />
        <br />
        <TextField
          name="receiverPhone"
          hintText="Phone"
          floatingLabelText="Phone"
          value={this.state.receiverPhone}
          onChange={e => this.change(e)}
          floatingLabelFixed
        />
        <br />
        <TextField
          name="message"
          hintText="Message"
          floatingLabelText="Message"
          value={this.state.message}
          onChange={e => this.change(e)}
          floatingLabelFixed
        />
        <br />
        <TextField
          name="date"
          hintText="Date"
          floatingLabelText="Date"
          value={this.state.date}
          onChange={e => this.change(e)}
          floatingLabelFixed
        />
        <br />
        <TextField
          name="time"
          hintText="Please input with format hh"
          floatingLabelText="Time"
          value={this.state.time}
          onChange={e => this.change(e)}
          floatingLabelFixed
        />
        <br />
        <RaisedButton label="Submit" onClick={e => this.onSubmit(e)} primary />
      </form>
    );
  }
}
