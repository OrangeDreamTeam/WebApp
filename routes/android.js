var fs = require('fs');

// Takes in the GCM Key, Phone Number, and Phone Name
// Inserts or Updates the Phone row
exports.initializeGCM = function(req, res) {
  var gcmKey = connection.escape(req.body['gcmKey']);
  var phoneNumber = connection.escape(req.body['phoneNumber']);
  var phoneName = connection.escape(req.body['phoneName']);

  var selectQuery = 'SELECT * FROM Phone WHERE Phone.phoneNumber = ' + phoneNumber + ';';
  connection.query(selectQuery, function(err, rows, fields) {
    if(err) {
      console.log(err);
    }
    else {
      if(rows.length === 0) {
        var insertValues = phoneName + ',' + phoneNumber + ',' + gcmKey;
        var insertQuery = 'INSERT INTO Phone (phoneName, phoneNumber, gcmKey) VALUES (' + insertValues + ');';
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
      else {
        var updateQuery = 'UPDATE Phone SET phoneName=' + phoneName + ', gcmKey=' + gcmKey + ' WHERE Phone.phoneNumber = ' + phoneNumber + ';';
        connection.query(updateQuery, function(err) {
          if(err) {
            console.log(err);
          }
          else {
            res.send(200);
          }
        });
      }
    }
  });
}

exports.saveSignature = function(req, res) {
  var imageData = req.body['imageData'];
  var randomNum = Math.floor((Math.random()*5000) + 1);
  fs.writeFile('/signatures/' + randomNum + '.bmp', imageData, function(err) {
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