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

exports.importCVS = function(req, res) {
  var cvs = req.body['csv'];
  
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