var io = require('socket.io').listen(server),
  util = require('util'),
  gcmhelper = require('./gcmhelper');

var phones = [
  {pnum: 4049066696,
    name: "dekelphone"},
  {pnum: 4444444444,
    name: "hammerspace"},
  {pnum: 5551234567,
    name: "Jarvipedia"}
];
var routes = [
  {name: "Route A (Owen, Mary, Bob)",
    last: new Date(2013, 11, 2),
    stops: 3},
  {name: "Route B (George, Hammersmith, Gary)",
    last: new Date(2013, 11, 5),
    stops: 3}
];
var socket_funcs = {};

io.sockets.on('connection', function(socket) {

  socket.on('track', function(data) {
    gcmhelper.requestTracking(data.phonenumber, socket.id);
  });

  var sendTrackingInfo = function(info) {
    socket.send(info);
  };

  socket_funcs[socket.id] = {
    sendTrackingInfo: sendTrackingInfo
  };


  socket.on('disconnect', function() {
    delete socket_funcs[socket.id];
  });
  socket.on('phones', function() {
    socket.emit('phones', {phones: phones});
    socket.broadcast.emit('phones', {phones: phones});
  });
  socket.on('routes', function() {
    socket.emit('routes', {routes: routes});
    socket.broadcast.emit('routes', {routes: routes});
  });

});

/*
 * sendTrackingInfo
 * @param socket_id
 * @param info
 *
 * takes a unique socket id (should have been provided) as the first paramater 
 * and sends to the corresponding browser instance the tracking information
 * that's provided. That information should include the phone that's being
 * located and the location coordinates.
 */
exports.sendTrackingInfo = function(socket_id, info) {
  if (socket_funcs[socket_id]) {
    if (socket_funcs[socket_id].sendTrackingInfo) {
      socket_funcs[socket_id].sendTrackingInfo(info);
    }
  }
};