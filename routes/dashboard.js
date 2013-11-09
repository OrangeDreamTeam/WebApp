exports.getRoutes = function(req, res) {
  var Route = req.models.Route;

  Route.find({}, function(err, routes) {
    if(err) {
      console.log(err);
    }
    else {
      res.json(routes);
    }
  });
}

exports.getPhones = function(req, res) {
  var Phone = req.models.Phone;

  Phone.find({}, function(err, phones) {
    if(err) {
      console.log(err);
    }
    else {
      res.json(phones);
    }
  });
}

exports.getActiveRoutes = function(req, res) {
  var ActiveRoute = req.models.ActiveRoute;

  ActiveRoute.find({}).each(function(activeRoute) {
    
  });
}

exports.getRouteByField = function(req, res) {
  var fieldName = connection.escape(req.body['fieldName']);
  var field = connection.escape(req.body['field']);
  var selectQuery = 'SELECT * FROM Route WHERE ' + fieldName + ' = ' + field;

  connection.query(selectQuery, function(err, rows, fields) {
    if(err) {
      console.log(err);
    }
    else {
      var jsonResponse = [];
      rows.forEach(function(row, index) {
        jsonResponse.push({});
        fields.forEach(function(field) {
          jsonResponse[index].field = row.field;
        });
      });
      res.json(jsonResponse);
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

  var insertQuery = 'INSERT INTO Route VALUES(' + insertValues + ')';
}