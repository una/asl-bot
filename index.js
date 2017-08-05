// index.js
var Slack = require('@slack/client');
var request = require('request');
require('dotenv').config();
var RtmClient = Slack.RtmClient;  
var RTM_EVENTS = Slack.RTM_EVENTS;

var token = process.env.API_KEY;

var rtm = new RtmClient(token, { logLevel: 'info' });  
rtm.start();

// API Call here (API Key Public)
// "Sign with Robert" as Query Param for
// Giphy Search funtion and return the body
const callGiphy = (message, channel) => {
  request('http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=sign%20with%20robert', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      let responseObject = JSON.parse(body);
      sendMessage(message, channel, responseObject);
      
      // closes out of node process
      process.exit(1);
    }
  })
}

// On-message event
rtm.on(RTM_EVENTS.MESSAGE, function(message) {  
  const channel = message.channel;
  const text = message.text; // could be used as input
  callGiphy(message, channel);
  return false;
});

// Send Message Event
// body being sent from the API call
const sendMessage = (message, channel, body) => {
  let dataObj = body.data;
  let graphicFromCall = dataObj.fixed_height_small_url.toString();
  rtm.sendMessage(graphicFromCall, channel);
  return false;
}
