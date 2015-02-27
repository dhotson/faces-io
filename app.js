var express = require('express')
var app = express()
var twilio = require('twilio')(process.env.TWILIO_ACCOUNTSID, process.env.TWILIO_AUTHTOKEN);

var ICE_SERVERS = [{
    "url": "stun:stun.l.google.com:19302"
}];
var updateIceServers = function() {
    client.tokens.post({}, function(err, token) {
        if (!err) {
            ICE_SERVERS = token.iceServers;
        } else {
            // Fallback..
            ICE_SERVERS = [{
                "url": "stun:stun.l.google.com:19302"
            }];
        }
    })
};
setInterval(updateIceServers, 5000);

app.get('/ice.js', function (req, res) {
    res.set('Content-Type', 'text/javascript');
    res.send('var ICE_SERVERS='+JSON.stringify(ICE_SERVERS));
});

var port = parseInt(process.env.PORT, 10) || 8001;
var server = app.listen(3000);

var webRTC = require('webrtc.io').listen(server);

