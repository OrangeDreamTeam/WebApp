var express = require('express')
  , http = require('http')
  , path = require('path')
  , mysql = require('mysql')
  , dashboard = require('./routes/dashboard')
  , android = require('./routes/android');

var app = express();


connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'srconn'
});

connection.connect(function(err) {
  if(err) {
    console.log(err);
  }
  else {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));

    app.get('/getRoutes', dashboard.getRoutes);
    app.get('/getPhones', dashboard.getPhones);
    app.get('/getActiveRoutes', dashboard.getActiveRoutes);
    app.get('/getRouteByField', dashboard.getRouteByField);
    app.post('/createRoute', dashboard.createRoute);

    app.post('/android/initializeGCM', android.initializeGCM);

    if ('development' == app.get('env')) {
      app.use(express.errorHandler());
    }

    http.createServer(app).listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
    });
  }
});