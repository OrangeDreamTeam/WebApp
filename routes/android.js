// Takes in the GCM Key, Phone Number, and Phone Name
// Inserts or Updates the Phone row
exports.initializeGCM = function(req, res) {
  var gcmKey = connection.escape(req.body['gcmKey']);
  var phoneNumber = connection.escape(req.body['phoneNumber']);
  var phoneName = connection.escape(req.body['phoneName']);

  var insertQuery = 'INSERT INTO Phone VALUES (' + insertValues + ') ON DUPLICATE KEY UPDATE gcmKey = VALUES(' + gmcKey + '), phoneName = VALUES(' + phoneName + ');';

  connection.query(insertQuery, function(err, rows, fields) {
    if(err) {
      console.log(err);
      res.send(500);
    }
    else {
      res.send(200);
    }
  });
}

exports.getDashboard = function(req, res) {
  var phoneNumber = connection.escape(req.body['phoneNumber']);
  var currentDate = connection.escape(req.body['currentDate']);

  var selectQuery = 'SELECT * FROM Phone INNER JOIN Route ON Route.phoneId == Phone.UID INNER JOIN Service ON Route.UID == Service.routeId WHERE Service.Date == ' + currentDate + ' AND Phone.phoneNumber == ' + phoneNumber + ';';
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

exports.getWeek = function(req, res) {
  var phoneNumber = connection.escape(req.body['phoneNumber']);
  var currentDate = connection.escape(req.body['currentDate']);

  var today = Date.UTC(currentDate);
  
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