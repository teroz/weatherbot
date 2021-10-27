require('dotenv').config()

var express = require('express');
var requestify = require('requestify');


const { App, ExpressReceiver,LogLevel } = require('@slack/bolt');

// Create a Bolt Receiver
const receiver = new ExpressReceiver({ signingSecret: process.env.SLACK_SIGNING_SECRET });

// Create the Bolt App, using the receiver
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver,
  logLevel: LogLevel.DEBUG
});

app.use(express.urlencoded({ extended: false}))

receiver.router.post('/jumo_weather', (req, res) => {
  city = encodeURIComponent(req.body.city);
  city = "cape town";
  requestify.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${process.env.APPID}&units=metric`)
  .then(function(result) {
      res.send(result.getBody().main)
  })
  .catch(function(err){
    res.send(err)
  })  
});


(async () => {
  await app.start(3000);
  console.log('app is running');
})();
