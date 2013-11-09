var express = require('express')
  , http = require('http')
  , path = require('path')
  , mysql = require('node-mysql');

var app = express();

connection = mysql.createConnection({
  host: 'test',
  user: 'test',
  password: 'test'
});

connection.connect();

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

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
