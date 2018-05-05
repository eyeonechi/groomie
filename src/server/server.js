/*
 * SWEN90016 Software Processes and Management
 * Semester 1 2018
 * Assignment 2 - Groomie
 * server.js
 * Team Orange
 */

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

// Listen on specified port
server.listen(PORT, HOST, function() {
  console.log(Date());
  console.log('server running at http://' + HOST + ':' + PORT + '/');
});

// Route handler to serve client
app.use(express.static(__dirname + '/../client/'));

// Logs database connection errors
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

  socket.on('summary fetch', function(data) {
    var appointments = [];
    var dogs = [];
    var query = 'SELECT id FROM groomie.Appointment WHERE id_customer=(SELECT id FROM groomie.Customer WHERE name=?);';
    var params = [data.customer];
    db.query(query, params, function (err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i ++) {
        appointments.push(res[i]);
      }
      var query = 'SELECT name FROM groomie.Dog WHERE id_customer=(SELECT id FROM groomie.Customer WHERE name=?);';
      db.query(query, params, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i ++) {
          dogs.push(res[i]);
        }
        socket.emit('summary fetch success', {
          dogs,
          appointments
        });
      });
    });
  });

  socket.on('dog create', function(data) {
    console.log(data);
    var query = 'INSERT INTO groomie.Dog (name, breed, age, id_customer) VALUES (?, ?, ?, (SELECT id FROM groomie.Customer WHERE name=?));';
    var params = [data.name, data.breed, data.age, data.customer];
    db.query(query, params, function (err, res) {
      if (err) throw err;
      socket.emit('dog create success', res);
    });
  });

  socket.on('dog fetch', function(data) {
    console.log(data);
    var query = 'SELECT name, age, breed FROM groomie.Dog WHERE name=?;';
    var params = [data.name];
    db.query(query, params, function (err, res) {
      if (err) throw err;
      socket.emit('dog fetch success', res[0]);
    });
  });

  socket.on('appointment fetch', function(data) {
    console.log(data);
    var query = 'SELECT location, time_start, time_end, CONVERT(instructions USING utf8) as instructions, groom_option, (SELECT name FROM groomie.Groomer WHERE id=id_groomer) as groomer, (SELECT name FROM groomie.Dog WHERE id=id_dog) as dog FROM groomie.Appointment WHERE id=?;';
    var params = [data.id];
    db.query(query, params, function (err, res) {
      if (err) throw err;
      socket.emit('appointment fetch success', res[0]);
    });
  });

  socket.on('appointment list', function(data) {
    console.log(data);
    socket.emit('appointment list success', {
      times: [
        '09:00-10:30',
        '09:30-11:00',
        '10:00-11:30',
        '10:30-12:00',
        '11:00-12:30',
        '11:30-13:00',
        '12:00-13:30',
        '12:30-14:00',
        '13:00-14:30',
        '13:30-15:00',
        '14:00-15:30',
        '14:30-16:00',
        '15:00-16:30',
        '15:30-17:00'
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
    var query = 'INSERT INTO groomie.Appointment (time_start, time_end, id_customer, id_groomer, id_dog, groom_option, location, instructions) VALUES (?, ?, (SELECT id FROM groomie.Customer WHERE name=?), ?, (SELECT id FROM groomie.Dog WHERE name=?), ?, ?, ?);';
    var params = [data.time.split('-')[0], data.time.split('-')[1], data.customer, 1, data.dog, data.option, data.address, data.instructions];
    console.log(params);
    db.query(query, params, function (err, res) {
      if (err) throw err;
      socket.emit('register success', res);
    });
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

/*
getAvailableTimes(['10:00', '15:00'], ['11:30', '16:30']);
getAvailableTimes(['09:00', '11:00', '15:30'], ['10:30', '12:30', '17:00']);
getAvailableTimes(['14:00', '15:30'], ['15:30', '17:00']);
getAvailableTimes(['09:30'], ['11:00']);

function getAvailableTimes(time_starts, time_ends) {
  var intervals = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];

  var available = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'];
  var available1 = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'];
  var available2 = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'];
  var available3 = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'];
  for (var i = 0; i < available.length; i ++) {
    for (var j = 0; j < time_starts.length; j ++) {
      if (available[i] === time_starts[j]) {
        available.splice(i, 3);
      }
    }
  }
  for (var i = 0; i < available1.length; i ++) {
    for (var j = 0; j < time_starts.length; j ++) {
      if (available1[i] === time_starts[j]) {
        available1.splice(i - 2, 2);
      }
    }
  }
  for (var i = 0; i < available3.length; i ++) {
    for (var j = 0; j < time_starts.length; j ++) {
      if (available3[i] === time_starts[j]) {
        available3.splice(i - 1, 1);
      }
    }
  }
  for (var i = 0; i < available2.length; i ++) {
    for (var j = 0; j < time_ends.length; j ++) {
      if (available2[i] === time_ends[j]) {
        available2.splice(i - 2, 2);
      }
    }
  }

  var final = []
  var finalfinal = []
  var finalfinalfinal = []
  for (var i = 0; i < available.length; i ++) {
    for (var j = 0; j < available2.length; j ++) {
      if (available[i] === available2[j]) {
        final.push(available[i]);
      }
    }
  }
  for (var i = 0 ; i < final.length; i ++) {
    for (var j = 0; j < available1.length; j ++) {
      if (final[i] === available1[j]) {
        finalfinal.push(final[i])
      }
    }
  }
  for (var i = 0 ; i < finalfinal.length; i ++) {
    for (var j = 0; j < available3.length; j ++) {
      if (finalfinal[i] === available3[j]) {
        finalfinalfinal.push(finalfinal[i])
      }
    }
  }

  //console.log(available);
  //console.log(available2);
  console.log(finalfinalfinal);
  console.log();
}
*/
