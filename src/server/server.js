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
  database : 'groomie',
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
    console.log('register');
  });

  socket.on('login', function(data) {
    console.log('login');
  });

  socket.on('logout', function(data) {
    console.log('logout');
  });

  socket.on('appointment list', function(data) {
    console.log(data);
    socket.emit('appointment list success', {
      times: [
        '09:00 - 10:30',
        '09:30 - 11:00',
        '10:00 - 11:30',
        '10:30 - 12:00',
        '11:00 - 12:30',
        '11:30 - 13:00',
        '12:00 - 13:30',
        '12:30 - 14:00',
        '13:00 - 14:30',
        '13:30 - 15:00',
        '14:00 - 15:30',
        '14:30 - 16:00',
        '15:00 - 16:30',
        '15:30 - 17:00'
      ],
      dogs: [
        'dog1',
        'dog2',
        'dog3'
      ],
      options: [
        'wash only',
        'wash and nail clipping',
        'deluxe grooming'
      ]
    });
  });

  socket.on('appointment create', function(data) {
    console.log(data);
  });

  socket.on('disconnect', function() {
    console.log('connection terminated');
  });

  socket.on('shutdown', function() {
    console.log('server shutting down');
    io.close();
    socket.close();
    db.end(function(err) {
      if (err) throw err;
    });
  });

});
