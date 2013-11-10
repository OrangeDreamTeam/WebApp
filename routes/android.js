// Takes in the GCM Key, Phone Number, and Phone Name
// Inserts or Updates the Phone row
exports.initializeGCM = function(req, res) {
  var gcmKey = connection.escape(req.body['gcmKey']);
  var phoneNumber = connection.escape(req.body['phoneNumber']);
  var phoneName = connection.escape(req.body['phoneName']);

  var insertValues = phoneName + ',' + phoneNumber + ',' + gcmKey;

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