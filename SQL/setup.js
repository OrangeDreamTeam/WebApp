var async = require('async');
var mysql = require('mysql');


if(process.env.NODE_ENV == 'dev') {
  connection = mysql.createConnection({
    host: 'localhost',
    user: 'root'
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

var queries = [];

queries.push('DROP DATABASE IF EXISTS srconn;');
queries.push('CREATE DATABASE srconn;');
queries.push('USE srconn;')
queries.push('CREATE TABLE Phone (UID int NOT NULL AUTO_INCREMENT, phoneName varchar(255), phoneNumber varchar(255), gcmKey varchar(5000), PRIMARY KEY (UID));');
queries.push('CREATE TABLE Route (UID int NOT NULL AUTO_INCREMENT, lastFinishedBy varchar(255), lastFinishedDate varchar(255), routeName varchar(255), phoneId int, PRIMARY KEY (UID));');
queries.push('CREATE TABLE Service (UID int NOT NULL AUTO_INCREMENT, routeId int, clientId int, service varchar(255), notes varchar(10000), units int, FS varchar(255), startTime varchar(255), endTime varchar(255), signaturePath varchar(255), providedServices varchar(1024) DEFAULT NULL, PRIMARY KEY(UID));');
queries.push('CREATE TABLE Client (UID int NOT NULL AUTO_INCREMENT, name varchar(255), clientNumber varchar(255), address varchar(255), clientNotes varchar(255), PRIMARY KEY (UID));')
queries.push('CREATE TABLE Alert (UID int NOT NULL AUTO_INCREMENT, phoneId int, message varchar(140), sender varchar(255), time varchar(255), PRIMARY KEY (UID));');

queries.push('INSERT INTO Phone (phoneName, phoneNumber, gcmKey) VALUES ("Yuval Dekel", "4593022932", "42394823948329483294823fjkdsfj");');
queries.push('INSERT INTO Phone (phoneName, phoneNumber, gcmKey) VALUES ("Jarvis Johnson", "1302938493", "klvxzckncxzvcmnfkdflkjk");');
queries.push('INSERT INTO Phone (phoneName, phoneNumber, gcmKey) VALUES ("Jamie Crabb", "3522469088", "kojdilsf;lfsjklfdsjklsdfaj");');
connection.connect();

async.eachSeries(queries, function(query, callback) {
  connection.query(query, function(err) {
    if(err) {
      callback(err);
    }
    else {
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
