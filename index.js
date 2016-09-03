var express = require('express');
var app = express();
const VALIDATION_TOKEN = 'validate_me_pls';

app.set('port', process.env.PORT || 5000);

// app.get('/', function (req, res) {
//   res.send('test page sophia bot');
// });

app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subsribe' &&
      req.query['hub.verify_token'] === VALIDATION_TOKEN) {
    console.log("Validating");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed");
    res.sendStatus(403);
  }
}

// echo bot
app.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
            sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
        }
    }
    res.sendStatus(200);
});

function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.7/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

// structured message


app.listen(process.env.PORT, function() {
  console.log('Example app listens to port');
});
