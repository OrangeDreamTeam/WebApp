/** this is where we put all the gcm functionality in an abstraction layer **/

exports.requestTracking = function(phonenum, socket_id) {
  //this function will send a gcm message to the phone that asks it for it's current location
  console.log('received request for tracking from', phonenum, 'send response to', socket_id);
}
