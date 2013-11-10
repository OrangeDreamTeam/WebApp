var csv = require('csv');

exports.getRoutes = function(req, res) {
  var selectQuery = 'SELECT * FROM Route;';
  connection.query(selectQuery, function(err, rows, fields) {
    if(err) {
    }
    else {
      rowsToJson(rows, fields, function(response) {
        res.json(response);
      });
    }
  });
};

exports.socketRoutes = function() {
  var selectQuery = 'SELECT * FROM Route INNER JOIN Phone on Phone.UID = Route.phoneId;';
  connection.query(selectQuery, function(err, rows, fields) {
    if(err) {
    }
    else {
      rowsToJson(rows, fields, function(response) {
        sockets.updateRoutes(response);
      });
    }
  });
};

exports.socketAlerts = function() {
  var selectQuery = 'SELECT * FROM Alert INNER JOIN Phone on Phone.UID = Alert.phoneId;';
  connection.query(selectQuery, function(err, rows, fields) {
    if(err) {
    }
    else {
      rowsToJson(rows, fields, function(response) {
        console.log(response);
        sockets.sendAlerts(response);
      });
    }
  });

};

exports.socketPhones = function() {
  var selectQuery = 'SELECT * FROM Phone;';
  connection.query(selectQuery, function(err, rows, fields) {
    if(err) {
    }
    else {
      rowsToJson(rows, fields, function(response) {
        sockets.sendPhones(response);
      });
    }
  });
};


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
};
exports.getTodaysServices = function(req, res) {
  var formatRows = function(rows) {
    return rows.map(function(row) {
      var startDate = new Date(parseInt(row.startTime, 10));
      var endDate = new Date(parseInt(row.endTime, 10));
      startTime = cleanDate(startDate);
      endTime = cleanDate(endDate);
      return {
        start_time: startTime,
        end_time: endTime,
        type: row.service,
        client_name: row.name,
        client_phone: row.clientNumber,
        client_address: row.address,
        client_notes: row.clientNotes,
        route_id: row.routeId
      };
    });
  };
  var now = new Date();
  var start = new Date(now.getYear() + 1900, now.getMonth(), now.getDate());
  var end = new Date(now.getYear() + 1900, now.getMonth(), now.getDate()+1);
    var selectQuery = 'SELECT * FROM Service INNER JOIN Route ON Service.routeId = Route.UID INNER JOIN Phone ON Phone.UID = Route.phoneId INNER JOIN Client ON Client.UID = Service.clientId WHERE Phone.phoneNumber = "'+req.params["phonenum"]+'" AND Service.startTime > "'+start.getTime()+'" AND Service.endTime < "'+end.getTime()+'";';
  connection.query(selectQuery, function(err, rows, fields) {
    if(err) {
      console.log(err);
      res.send(500);
    } else {
      console.log(rows);
      res.json({date:new Date().getTime(), services: formatRows(rows)});
    }
  });
};

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
};

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
};


exports.addAlert = function(pid, msg) {
  var insertQuery = 'INSERT INTO Alert (phoneId, message, time, sender) VALUES('+pid+',"'+msg+'","'+new Date().getTime()+'", "Staff Member");';
  connection.query(insertQuery, function(err,rows) {
    if(err) {
      console.log(err);
      return;
    }
    else {
      dashboard.socketAlerts();
      return;
    }
  });
};

exports.getAlerts = function(req, res) {
  var formatRows = function(rows) {
    return rows.map(function(row) {
      return {
        message: row.message,
        time: row.time
      };
    });
  };
  var selectQuery = 'SELECT * FROM Alert INNER JOIN Phone on Phone.UID = Alert.phoneId;';
  connection.query(selectQuery, function(err, rows, fields) {
    if(err) {
      console.log(err);
      res.send(500);
    }
    else {
      res.json(formatRows(rows));
    }
  });

};

exports.postTrack = function(req, res) {
  var socket_id = req.body['socket_id'];
  var lat = req.body['lat'];
  var long = req.body['long'];
  sockets.sendTrackingInfo(socket_id, {lat: lat, long: long});
  res.send(200);
};

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
};

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
};

exports.importCSV = function(req, res) {
  var csv = req.body['csv'];
  CSVtoSchedule(csv, function() {
    res.send(200);
  });
};

var rowsToJson = function(rows, fields, callback) {
  var jsonResponse = [];
  rows.forEach(function(row, index) {
    jsonResponse.push({});
    fields.forEach(function(field) {
      jsonResponse[index][field.name] = row[field.name];
    });
  });
  callback(jsonResponse);
};

var CSVtoSchedule = function(csvFile, callback) {
  csv().from.string(csvFile, {
    columns: true,
    delimiter: ',',
    escape: '"'
  }).to(function(data) {
  }).transform(function(row) {
    var insertClientQuery = 'INSERT INTO Client (name, clientNumber, address, clientNotes) VALUES ("' + row.name + '", "' + row.clientNumber + '", "' + row.address + '", "' + row.clientNotes + '");';
    console.log(insertClientQuery);
    connection.query(insertClientQuery, function(err, client) {
      if(err) {
        console.log(err);
      }
      else {
        var selectPhoneQuery = 'SELECT UID FROM Phone WHERE phoneName = "' + row.phoneName + '";';
        console.log(selectPhoneQuery);
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
                console.log(insertServiceQuery);
                connection.query(insertServiceQuery, function(err, service) {
                  if(err) {
                    console.log(err);
                  }
                  else {
                    exports.socketRoutes();
                  }
                });
              }
            });
          }
        });
      }
    });
  });
};

exports.getServiceCount = function(req, res) {
  connection.query('SELECT count(*) FROM Service WHERE Service.signaturePath IS NOT NULL;', function(err, row, fields) {
    if(err) {
      console.log(err);
    }
    else {
      res.json(row[0]['count(*)']);
    }
  });
}

var cleanDate = function(date) {
  var hour = date.getHours();
  var minute = date.getMinutes();
  var AMPM = 'AM';
  if((hour > 12) || ((hour === 12) && (minute >= 0)) || ((hour === 12) && (second >= 0))) {
    hour = hour - 12;
    AMPM = 'PM';
  }
  if(hour == 0) {
    hour = 12;
    AMPM = 'AM';
  }
  if(hour < 10) {
    hour = "" + hour.slice(1, 2);
  }
  if(minute < 10) {
    minute = '0' + minute;
  }
  return hour + ':' + minute + ' ' + AMPM;
}
