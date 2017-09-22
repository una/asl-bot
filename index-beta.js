const Slack = require('@slack/client');
const request = require('request');
require('dotenv').config();
const RtmClient = Slack.RtmClient;  
const RTM_EVENTS = Slack.RTM_EVENTS;

const token = process.env.API_KEY;

app.get('/', function(req, res){
  res.send('It works!');
});

const rtm = new RtmClient(token, { logLevel: 'info' });  
rtm.start();

// API Call here (API Key Public)
// "Sign with Robert" as Query Param for
// Giphy Search funtion and return the body
const callGiphy = (message, channel) => {
  // If there is message text, search for the ASL for that message
  // If not, return a random gif
  if (message && message.text != "random") {
    let searchQuery = message.text;

    // If the call comes from a channel, there is an extra paramter
    if (message.text.indexOf(' ') >= 0){
      searchQuery = message.text.split(' ')[1];
    }

    console.log(searchQuery);

    request(`http://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=sign%20with%20robert%20${searchQuery}`, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // Data transformations here
        let dataObj = JSON.parse(body).data[0];
        let graphicFromCall = dataObj.images.fixed_height_small.url.toString();

        var body = {
          response_type: "in_channel",
          text: graphicFromCall
        };
  
        res.send(body);
      }
    })
  } else {
    request('http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=sign%20with%20robert', function (error, response, body) {
      if (!error && response.statusCode == 200) {

        // Data transformations here
        let dataObj = JSON.parse(body).data;
        let graphicFromCall = dataObj.fixed_height_small_url.toString();
        sendMessage(message, channel, graphicFromCall);
        
        // closes out of node process
        process.exit(1);
      }
    })
  }
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
const sendMessage = (message, channel, graphic) => {
  rtm.sendMessage(graphic, channel);
  return false;
}
