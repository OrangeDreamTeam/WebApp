var express = require('express')
  , http = require('http')
  , path = require('path')
  , orm = require('orm');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(orm.express('url', {
  define: function(db, models, next) {
    db.settings.set('properties.primary_key', 'UID');
    
    models.phone = db.define('Phone', {
      phoneNumber: String,
      phoneName: String,
      gcmKey: String
    });

    models.route = db.define('Route', {

    });

    models.activeRoute = db.define('ActiveRoute', {

    });
    
    next();
  }
}));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
