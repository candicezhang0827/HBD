const http = require('http')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const db = require('./db')
const CronJob = require('cron').CronJob

server.listen(8000, ()=>console.log('Server running on port 8000...'))

const jwt=require('jsonwebtoken')
const sk='jdnFoo@I099d(jdiSDa24039'


let generateToken=()=>{
	return jwt.sign({'exp':Math.floor(Date.now()/1000)+2*60*60},sk)
}


io.on('connection', socket=>{
	socket.on('register', (phone, password)=>{
		let prom=db.addUser(phone,password)
		prom.then(res=>{
			console.log(res)
			socket.emit('regReply','Registration Succeeded')
		}).catch(err=>{
			console.log(err)
			socket.emit('regReply','Registration Failed')
		})
	})

	socket.on('authenticate', (phone, password)=>{
		let prom=db.authenticate(phone, password)
		prom.then(res=>{
			console.log(res)
			const token=generateToken()
			socket.emit('authReply',token,phone)
		}).catch(err=>{
			console.log(err)
			socket.emit('authReply', 'Authentication Failed','')
		})
	})

	socket.on('getReceivers', (user)=>{
		let prom=db.read(user)
		prom.then(res=>{
			console.log(res)
			console.log('get receiver succeeded...')
			socket.emit('recReply',res)
		})
		.catch(err=>socket.emit('recReply','Get receivers failed...'))
	})

	socket.on('addReceivers',(user,data)=>{
		data['senderPhone']=user
		data['time']=parseInt(data['time'])
		console.log(data)
		let prom=db.create(data)
		prom.then(res=>{
			console.log(res)
			console.log('add receiver succeeded...')
		}).catch(err=>{
			console.log(err)
			console.log('add receiver failed...')
		})
	})

	socket.on('deleteReceivers',(user,data)=>{
		data['senderPhone']=user
		data['time']=parseInt(data['time'])
		let prom=db.delete(data)
		prom.then(res=>{
			console.log(res)
			console.log('delete receiver succeeded...')
		}).catch(err=>{
			console.log(err)
			console.log('delete receiver failed...')
		})
	})

	socket.on('updateReceivers',(user,data,updates)=>{
		data['senderPhone']=user
		data['time']=parseInt(data['time'])
		if (updates.hasOwnProperty('time')){
			updates['time']=parseInt(data['time'])
		}
		let prom=db.update(data,updates)
		prom.then(res=>{
			console.log(res)
			console.log('update receiver succeeded...')
		}).catch(err=>{
			console.log(err)
			console.log('update receiver failed...')
		})
	})

})

const workerFactory = function(){
	return{
		run: function(){
			db.Reminder.sendNotifications()
		}
	}
}

const scheduler = function(){
	return{
		start: function(){
			new CronJob('0 0 7 * * *', function(){
				workerFactory().run()
			},null,true,'')
		}
	}
}

scheduler().start()
