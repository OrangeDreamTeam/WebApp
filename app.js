var express = require('express')
  , http = require('http')
  , util = require('util')
  , fs = require('fs')
  , path = require('path')
  , mysql = require('mysql')
  , android = require('./routes/android');

var app = express();

dashboard = require('./routes/dashboard')

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

server = http.createServer(app);

sockets = require('./sockets');

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

app.get('/', function(req, res) {
  res.render('index', {});
});

if(process.env.NODE_ENV == 'dev') {
  connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'srconn'
  });
}
else {
  connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'srconn',
    password: 'jarvis'
  });
}

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
    app.get('/today/:phonenum', dashboard.getTodaysServices);
    app.get('/servicesCount', dashboard.getServiceCount);
    app.post('/hey', function(req, res) {
      
    });

    app.post('/createRoute', dashboard.createRoute);
    app.post('/importCSV', dashboard.importCSV);
    app.post('/saveSignature', android.saveSignature);
    app.post('/track', dashboard.postTrack);
    app.post('/register', android.initializeGCM);

    app.post('/android/initializeGCM', android.initializeGCM);

    if ('development' == app.get('env')) {
      app.use(express.errorHandler());
    }
  }
});
