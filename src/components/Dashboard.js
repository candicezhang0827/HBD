import React, { Component } from 'react';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import injectTapEventPlugin from "react-tap-event-plugin"

//import "./Dashboard.css"	//need this file
import Form from "./Form"
import Table from "./Table"



export default class Dashboard extends Component{
	
	constructor(props){
		super(props)
		this.state={
			data:[],
			editIdx: -1,
			oldDataEmpty: true,
			oldData:{},
			edit:{}
		}
	}

	componentDidMount(){
		this.props.socket.emit('getReceivers',this.props.user)
		this.props.socket.on('recReply',(res)=>{
			this.setState({data:res})
		})
	}

	handleRemove = i =>{
		this.setState(state=>({
			data:this.state.data.filter((row,j)=>j!==i)	//自动给每个element一个编号j，eval to true will be kept 
		}))
		this.props.socket.emit('deleteReceivers',this.props.user,this.state.data[i])
	}

	startEditing = i=>{
		this.setState({editIdx:i})
	}

	stopEditing = ()=>{
		let i=this.state.editIdx
		console.log(this.state.oldData)
		this.props.socket.emit('updateReceivers',this.props.user,this.state.oldData,this.state.edit)
		this.setState({editIdx:-1,edit:{},oldDataEmpty:true})

	}

	handleChange = (e,name,i)=>{
		if (this.state.oldDataEmpty){
			this.setState({oldData:this.state.data[i],oldDataEmpty:false})
		}
		const { value }=e.target
		this.setState(state=>({
			data: this.state.data.map(
				(row,j)=>(j===i?{...row,[name]:value}:row)
			)
		}))
		let copy=Object.assign({},this.state.edit,{[name]:value})
		this.setState({edit:copy})
	}

	render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <Form
            onSubmit={submission =>{
              this.setState({
                data: [...this.state.data, submission]
              })
              this.props.socket.emit('addReceivers',this.props.user,submission)
          	}

            }
          />
          <Table
            handleRemove={this.handleRemove}
            handleChange={this.handleChange}
            startEditing={this.startEditing}
            stopEditing={this.stopEditing}
            editIdx={this.state.editIdx}
            data={this.state.data}
            header={[
              {
                name: "Name",
                prop: "receiverName"
              },
              {
                name: "Phone",
                prop: "receiverPhone"
              },
              {
                name: "Date",
                prop: "date"
              },
              {
                name: "Message",
                prop: "message"
              }
            ]}
          />
        </div>
      </MuiThemeProvider>
    );
  }


	
}

