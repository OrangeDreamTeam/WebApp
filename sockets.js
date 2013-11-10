var io = require('socket.io').listen(server),
  util = require('util'),
  twilio = require('twilio'),
  capability = new twilio.Capability('AC5b1e80ceb7c8be03be7e6a0d1fce8874','fb721de8b4fc9c091a923b37a323a999');
  gcmhelper = require('./gcmhelper');


capability.allowClientOutgoing('AP123');
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

  socket.on('alert', function(data) {
    gcmhelper.requestAlert(data.phonenumber, socket.id);
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
//    socket.emit('phones', {phones: phones});
 //   socket.broadcast.emit('phones', {phones: phones});
    dashboard.socketPhones();
  });
  socket.on('routes', function() {
    //socket.emit('routes', {routes: routes});
    //socket.broadcast.emit('routes', {routes: routes});
    dashboard.socketRoutes();
  });

  socket.on('twi-token', function(data) {
    console.log('TOKEN TOKEN TOKEN');
    socket.emit('twi-token', {token: capability.generate(600), num: data.num});
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

exports.updateRoutes = function(routes) {
  io.sockets.emit('routes', {routes: routes});
};

exports.sendPhones = function(phones) {
  io.sockets.emit('phones', {phones: phones});
};

exports.sendAlerts = function(phones) {
  io.sockets.emit('alerts', {alerts: alerts});
};
