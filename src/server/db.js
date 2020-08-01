const mongoose = require('mongoose')
const moment = require('moment')
const Twilio = require('twilio')

const sid='AC5c78f94534680de28d93cc2369a5f8ec'
const token='d4f6bf2aa9c983665cfe3446f8e5735b'

mongoose.connect('mongodb://localhost/bm',{ useNewUrlParser: true })

//设计表结构
const Schema = mongoose.Schema

const ReminderSchema = new Schema({
	senderPhone: String,
	receiverName: String,
	receiverPhone: String,
	message: String,
	date: String
})

ReminderSchema.methods.requiresNotification = function(day){
	const bd=this.date
	const today=moment(day).format('MM-DD')
	return bd===today
}

ReminderSchema.statics.sendNotifications = function sendNotifications(){
	const today=new Date()
	Reminder.find().then(function(reminders){
		reminders=reminders.filter(function(reminder){
			return reminder.requiresNotification(today)
		})
		if (reminders.length>0){
			const client=new Twilio(sid,token)
			reminders.forEach(function(reminder){
				const options={
					to: `+ ${reminder.receiverPhone}`,
					from: `+ ${reminder.senderPhone}`,
					body: `${reminder.message}`
				}

				client.messages.create(options,function(err,res){
					if (err){
						console.log(err)
					}else{
						console.log('Message sent')
					}
				})
			})
		}
	})
}

const Reminder = mongoose.model('Reminder', ReminderSchema)

exports.read = function(user){
	return new Promise(function(resolve,reject){
		Reminder.find({senderPhone: user},function(err,res){
			if (err){
				reject(err)
			}else{
				resolve(res)
			}
		})
	})
}

exports.create = function(data){
	return new Promise(function(resolve,reject){
		Reminder.create(data,function(err,res){
			if (err){
				reject(err)
			}else{
				resolve(res)
			}
		})
	})
}

exports.delete = function(data){
	return new Promise(function(resolve,reject){
		console.log('delete data')
		console.log(data)
		Reminder.deleteOne(data,function(err,res){
			if (err){
				reject(err)
			}else{
				resolve(res)
			}
		})
	})
}

exports.update=function(data,updates){
	return new Promise(function(resolve,reject){
		Reminder.findOneAndUpdate(data,updates,function(err,res){
			if (err){
				reject(err)
			}else{
				resolve(res)
			}
		})
	})
}

exports.Reminder = Reminder

//创建模型
//第一个参数: 传入一个大写名词单数字符串来表示数据库名称，mongoose会自动转成小写复数(User=>users)
//返回模型对象(模型构造函数)

const userSchema = new Schema({
	phone:{
		type: String,
		required: true,
		unique: true
	},
	password:{
		type: String,
		required: true
	}
})

const User = mongoose.model('User',userSchema)

exports.addUser = function (phone, password){
	return new Promise(function(resolve,reject){
		let user=new User({
			phone:phone,
			password: password
		})
		User.create(user, function(err,res){
			if (err){
				reject(err)
			}else{
				resolve(res)
			}
		})
	})
}

exports.authenticate = function (phone, password){
	return new Promise(function(resolve,reject){
		User.findOne({phone: phone}, function(err,res){
			if (err){
				reject(err)
			}else{
				if (res==null){
					reject('Email does not exist')
				}else{
					if (password===res['password']){
						resolve('Logged in')
					}else{
						reject('Wrong password')
					}
				}
			}
		})
	})
}



