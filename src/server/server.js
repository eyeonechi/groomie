var HOST    = 'localhost';
var PORT    = 3000;

var express = require('express');
var app     = express();
var http    = require('http');
var server  = http.createServer(app);
var io      = require('socket.io').listen(server);
var mysql   = require('mysql');
var db      = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'mydb',
  port     : 3306
});

/* Listen on specified port */
server.listen(PORT, HOST, function() {
  console.log(Date());
  console.log('server running at http://' + HOST + ':' + PORT + '/');
});

/* Route handler to serve client */
app.use(express.static(__dirname + '/../client/'));

/* Logs database connection errors */
db.connect(function(err) {
  if (err) throw err;
  console.log('database connected');
});

io.on('connection', function(socket) {
  console.log('connection established');

  socket.on('register', function(data) {
    console.log('register')
  });

  socket.on('login', function(data) {
    console.log('login')
  });

  socket.on('logout', function(data) {
    console.log('logout')
  });

  socket.on('disconnect', function() {
    console.log('connection terminated')
  });

  socket.on('shutdown', function() {
    console.log('server shutting down')
    io.close();
    socket.close();
    db.end(function(err) {
      if (err) throw err;
    });
  });

});
