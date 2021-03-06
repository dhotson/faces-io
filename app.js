var twilio = require('twilio')(process.env.TWILIO_ACCOUNTSID, process.env.TWILIO_AUTHTOKEN);

var ICE_SERVERS = [{
    "url": "stun:stun.l.google.com:19302"
}];
var updateIceServers = function() {
    twilio.tokens.post({}, function(err, token) {
        if (!err) {
            ICE_SERVERS = token.iceServers;
        } else {
            // Fallback..
            ICE_SERVERS = [{
                "url": "stun:stun.l.google.com:19302"
            }];
        }
    });
};
updateIceServers();
setInterval(updateIceServers, 3600*1000*12); // Update every 12 hours

var express = require('express')
var app = express()
app.get('/ice.js', function (req, res) {
    res.set('Content-Type', 'application/javascript');
    res.setHeader("Cache-Control", "public, max-age=3600"); // 1 hour
    res.setHeader("Expires", new Date(Date.now() + 3600000).toUTCString());
    res.send('setice('+JSON.stringify(ICE_SERVERS)+')');
});

var port = parseInt(process.env.PORT, 10) || 8001;
var server = app.listen(port);

var webRTC = require('webrtc.io').listen(server);

