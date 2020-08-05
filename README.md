# HBD
A web app that allows you to input your family/friend's birthday and send you a reminder at specified time.

This app uses React as front-end, and NodeJS+MongoDB as backend. First go to the file and run npm install+npm start to get the webpage running. Then go to src/server and run the command node server to get the server running.

This app will allow you to register and login to an account, and then CURD your messages to people at specific times. To realize this, I used twilio messaging API and CronJob, which allows you to run a task periodically. 

Note: To try out the SMS feature, you'll need to create your own Twilio token, SID and phone number.

