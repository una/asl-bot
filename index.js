var express = require('express');
var app = express();
var url = require('url');
var request = require('request');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 9001));

app.post('/post', function(req, res){
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
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
