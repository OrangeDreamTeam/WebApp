var async = require('async');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'srconn'
});

var queries = [];

queries.push('SELECT * FROM Service;');

connection.connect();

async.eachSeries(queries, function(query, callback) {
  connection.query(query, function(err, row, field) {
    if(err) {
      console.log(err);
    }
    else {
      if(row) {
        console.log(row);
      }
      callback(null);
    }
  })
}, function(err) {
  if(err) {
    console.log(err);
  }
  else {
    connection.end();
    console.log('Done.');
  }
});