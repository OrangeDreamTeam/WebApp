var io = require('socket.io').listen(server),
  util = require('util'),
  twilio = require('twilio'),
  capability = new twilio.Capability('AC26d09258622cd3278b5677a4d5550110','628e0dab1e34df75b68a70ba13286b2b');
  gcmhelper = require('./gcmhelper');


capability.allowClientOutgoing('AP8be81f51552aa2b879fe4f6dacb15674');
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
    console.log(data);
    gcmhelper.requestAlert(data.phonenumber, socket.id, data.message);
    dashboard.addAlert(data.phoneid, data.message);
  });

  var sendTrackingInfo = function(info) {
    socket.emit('track',info);
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
  socket.on('routes', function() {
    dashboard.socketAlerts();
  });

  socket.on('twi-token', function(data) {
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

exports.sendAlerts = function(alerts) {
  io.sockets.emit('alerts', {alerts: alerts});
};

