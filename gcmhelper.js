/** this is where we put all the gcm functionality in an abstraction layer **/

var gcm = require('node-gcm');

var apiKey = 'AIzaSyB2iIwQYMXLT7PynxXwBFzuH2DfafbIL8E';

exports.requestTracking = function(phonenum, socket_id) {
  //this function will send a gcm message to the phone that asks it for it's current location
  var getGCMQuery = 'SELECT * FROM Phone WHERE Phone.phoneNumber = "' + phonenum + '";';
  connection.query(getGCMQuery, function(err, row) {
    if(err) {
      console.log(err);
    }
    else {
      var regId = row[0].gcmKey;
      var message = new gcm.Message({
        delayWhileIdle: true,
        timeToLive: 5,
        data: {
          type: 'track',
          socketId: socket_id
        }
      });
      var sender = new gcm.Sender(apiKey);
      sender.send(message, [regId], 3, function(err, result) {
        if(err) {
          console.log(err);
        }
      });
    }
  });
}

exports.requestAlert = function(phonenum, socket_id, message) {
  //this function will send a gcm message to the phone that asks it for it's current location

  var getGCMQuery = 'SELECT * FROM Phone WHERE Phone.phoneNumber = "' + phonenum + '";';
  connection.query(getGCMQuery, function(err, row) {
    if(err) {
      console.log(err);
    }
    else {
      console.log(message);
      var regId = row[0].gcmKey;
      var message = new gcm.Message({
        delayWhileIdle: true,
        timeToLive: 5,
        data: {
          message: message,
          type: 'alert',
          socketId: socket_id
        }
      });
      var sender = new gcm.Sender(apiKey);
      sender.send(message, [regId], 3, function(err, result) {
        if(err) {
          console.log(err);
        }
      });
    }
  });
}
