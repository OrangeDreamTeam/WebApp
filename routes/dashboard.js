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
  var selectQuery = 'SELECT * FROM ActiveRoute INNER JOIN Route ON Route.UID == ActiveRoute.routeId;';
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

exports.getRouteByField = function(req, res) {
  var fieldName = connection.escape(req.body['fieldName']);
  var field = connection.escape(req.body['field']);
  var selectQuery = 'SELECT * FROM Route WHERE ' + fieldName + ' == ' + field + ';';

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