var Twit = require('twit');
var request = require("request");
var twilio = require('twilio')('TWILIO API', 'TWILIO SECRET');

var alreadySent = [];

var client = new Twit({
  consumer_key: "TWITTER CONSUMER",
  consumer_secret: "TWITTER CONSUMER SECRET",
  access_token: "TWITTER ACCESS TOKEN",
  access_token_secret: "TWITTER ACCESS TOKEN SECRET"
});

var stream = client.stream('user');

stream.on('user_event', function(event) {
  console.log("Event!");
  if (event.event == "favorite") {
    if (event.source.screen_name == "_ndrewh" && event.target.screen_name == "tillson_") {
      sendDankMeme();
    }
  }
});

function sendDankMeme() {
  console.log("Sending Andrew a dank meme...");
  getDankMeme(function(meme) {
    console.log(meme);
    sendTwilioMessage(meme);
  });
}

function getDankMeme(callback) {
  request('http://www.reddit.com/r/dankmemes.json', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var json = JSON.parse(body);
      var posts = json.data.children;
      for (var i = 0; i < json.data.children.length; i++) {
        if (posts[i].data.domain !== "i.imgur.com") continue;
        var url = posts[i].data.url;
        if (alreadySent.indexOf(url) > -1) continue;
        alreadySent.push(url);
        callback(url);
        break;
      }
    }
  });
}

function sendTwilioMessage(picture) {
  twilio.sendMessage({
    to: "recipient number",
    from: 'twilio number',
    NumMedia: 1,
    MediaUrl: picture
  }, function(err, responseData) {
    if (err !== null) {
      console.log("RED ALERT!  The Twilio message failed!");
      console.log(err);
    }
  });
}
