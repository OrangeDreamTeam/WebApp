var csv = require('csv');

exports.getRoutes = function(req, res) {
  var selectQuery = 'SELECT * FROM Route;';
  connection.query(selectQuery, function(err, rows, fields) {
    if(err) {
      console.log(err);
      res.send(500);
    }
    else {
      rowsToJson(rows, fields, function(response) {
        res.json(response);
      });
    }
  });
}

exports.getPhones = function(req, res) {
  var selectQuery = 'SELECT * FROM Phone;';
  connection.query(selectQuery, function(err, rows, fields) {
    if(err) {
      console.log(err);
      res.send(500);
    }
    else {
      rowsToJson(rows, fields, function(response) {
        res.json(response);
      });
    }
  });
}

exports.getActiveRoutes = function(req, res) {
  var selectQuery = 'SELECT * FROM ActiveRoute INNER JOIN Route ON Route.UID == ActiveRoute.routeId INNER JOIN Phone ONActiveRoute.phoneId == Phone.UID;';
  connection.query(selectQuery, function(err, rows, fields) {
    if(err) {
      console.log(err);
      res.send(500);
    }
    else {
      rowsToJson(rows, fields, function(response) {
        res.json(response);
      });
    }
  });
}

exports.getRoute = function(req, res) {
  var routeId = connection.escape(req.body['routeId']);

  var selectQuery = 'SELECT * FROM Route INNER JOIN Active Route ON Route.UID == ActiveRoute.routeId INNER JOIN Service ON Service.routeId == ActiveRoute.routeId INNER JOIN Stop ON Stop.UID == Service.stopId WHERE ActiveRoute.routeId == ' + routeId + ';';

  connection.query(selectQuery, function(err, rows, fields) {
    if(err) {
      console.log(err);
      res.send(500);
    }
    else {
      rowsToJson(rows, fields, function(response) {
        res.json(response);
      });
    }
  });  
}

exports.createRoute = function(req, res) {
  var route = connection.escape(req.body['route']);
  var insertValues = '';
  var insertFields = '';

  for(var key in route) {
    insertFields += key + ',';
    insertValues += route.key + ',';
  }

  insertFields = insertFields.substring(0, insertFields.length - 1);
  insertValues = insertValues.substring(0, insertValues.length - 1);

  var insertQuery = 'INSERT INTO Route (' + insertFields + ') VALUES(' + insertValues + ');';
  connection.query(insertQuery, function(err, rows) {
    if(err) {
      console.log(err);
      res.send(500);
    }
    else {
      res.send(200);
    }
  });
}

exports.startRoute = function(req, res) {
  var phoneNumber = connection.escape(req.body['phoneNumber']);
  var routeId = connection.escape(req.body['routeId']);

  var insertValues = phoneNumber + ',' + routeId;
  var insertFields = 'phoneNumber, routeId';
  var insertQuery = 'INSERT INTO ActiveRoute (' + insertFields + ') VALUES (' + insertValues + ');';

  connection.query(insertQuery, function(err, rows) {
    if(err) {
      console.log(err);
      res.send(500);
    }
    else {
      res.send(200);
    }
  });
}

exports.importCSV = function(req, res) {
  var csv = req.body['csv'];
  CSVtoSchedule(csv, function() {
    res.send(200);
  });
}

var rowsToJson = function(rows, fields, callback) {
  var jsonResponse = [];
  rows.forEach(function(row, index) {
    jsonResponse.push({});
    fields.forEach(function(field) {
      jsonResponse[index].field = row.field;
    });
  });
  callback(jsonResponse);
}

var CSVtoSchedule = function(csvFile, callback) {
  csv().from.string(csvFile, {
    columns: true,
    delimiter: ',',
    escape: '"'
  }).to(function(data) {
  }).transform(function(row) {
    var insertClientQuery = 'INSERT INTO Client (name, phoneNumber, address, notes) VALUES ("' + row.name + '", "' + row.phoneNumber + '", "' + row.address + '", "' + row.clientNotes + '");';
    console.log(insertClientQuery);
    connection.query(insertClientQuery, function(err, client) {
      if(err) {
        console.log(err);
      }
      else {
        var selectPhoneQuery = 'SELECT UID FROM Phone WHERE phoneName = "' + row.phoneName + '";';
        connection.query(selectPhoneQuery, function(err, phone) {
          if(err) {
            console.log(err);
          }
          else {
            var insertRouteQuery = 'INSERT INTO Route (routeName, phoneId) VALUES ("' + row.routeName + '", "' + phone[0].UID + '");';
            connection.query(insertRouteQuery, function(err, route) {
              if(err) {
                console.log(err);
              }
              else {
                var insertServiceQuery = 'INSERT INTO Service (routeId, clientId, service, startTime, endTime, FS, units, notes) VALUES ("' + route.insertId + '", "' + client.insertId + '", "' + row.service + '", "' + row.startTime + '", "' + row.endTime + '", "' + row.FS + '", "' + row.units + '", "' + row.notes + '");';
                connection.query(insertServiceQuery, function(err, service) {
                  if(err) {
                    console.log(err);
                  }
                  else {
                    var selectAllRoutesQuery = 'SELECT * FROM Route;';
                    connection.query(selectAllRoutesQuery, function(err, routes) {
                      if(err) {
                        console.log(err);
                      }
                      else {
                        sockets.updateRoutes(routes, function() {
                          callback();
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  });
}