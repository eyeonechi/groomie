/*
 * SWEN90016 Software Processes and Management
 * Semester 1 2018
 * Assignment 2 - Groomie
 * server.js
 * Team Orange
 */

'use strict';

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
/*
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'youremail@gmail.com',
    pass: 'yourpassword'
  }
});
var mailOptions = {
  from: 'youremail@gmail.com',
  to: 'myfriend@yahoo.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
  //html: '<h1>Welcome</h1><p>That was easy!</p>'
};
transporter.sendMail(mailOptions, function(error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log('Email send: ' + info.response);
  }
});
*/

var groom_options = [
  'wash only',
  'wash and nail clipping',
  'deluxe grooming'
];

// Listen on specified port
server.listen(PORT, HOST, function() {
  console.log(Date());
  console.log('server running at http://' + HOST + ':' + PORT + '/');
});

// Route handler to serve client
app.use(express.static(__dirname + '/../client/'));

// Logs database connection errors
db.connect(function(err) {
  if (err) {
    console.log('failed to connect to database');
  } else {
    console.log('database connected');
  }
});

io.on('connection', function(socket) {
  console.log('connection established');

  socket.on('register', function(data) {
    var query = 'INSERT INTO groomie.Customer (username, password) VALUES (?, ?);';
    var params = [data.username, data.password];
    db.query(query, params, function(err, res) {
      if (err) throw err;
      socket.emit('register success', res);
    });
  });

  socket.on('reset password', function(data) {
    var password = 'password';
    var query = 'UPDATE groomie.Customer SET password=? WHERE email=?;';
    var params = [password, data.email];
    db.query(query, params, function (err, res) {
      if (err) throw err;
      socket.emit('reset password success');
    });
  });

  socket.on('login', function(data) {
    var query = 'SELECT id, username, password, phone FROM groomie.Customer WHERE username=? AND password=?;';
    var params = [data.username, data.password];
    db.query(query, params, function (err, res) {
      if (err) throw err;
      if (res.length === 0) {
        socket.emit('login failure');
      } else {
        socket.emit('login success', res[0]);
      }
    });
  });

  socket.on('logout', function(data) {
    socket.emit('logout success', {});
  });

  socket.on('profile fetch', function(data) {
    var query = 'SELECT id, username, email, phone, address FROM groomie.Customer WHERE id=?;';
    var params = [data.id];
    db.query(query, params, function (err, res) {
      if (err) throw err;
      socket.emit('profile fetch success', res[0]);
    });
  });

  socket.on('profile update', function(data) {
    var query = 'UPDATE groomie.Customer SET username=?, email=?, phone=?, address=? WHERE id=?;';
    var params = [data.name, data.email, data.phone, data.address, data.id];
    db.query(query, params, function (err, res) {
      if (err) throw err;
      socket.emit('profile update success', res);
    });
  });

  socket.on('dog update', function(data) {
    var query = 'UPDATE groomie.Dog SET name=?, age=?, breed=? WHERE id=?;';
    var params = [data.name, data.age, data.breed, data.id];
    db.query(query, params, function (err, res) {
      if (err) throw err;
      socket.emit('dog update success', res);
    });
  });

  socket.on('appointment update', function(data) {
    var query = 'UPDATE groomie.Appointment SET instructions=? WHERE id=?;';
    var params = [data.instructions, data.id];
    db.query(query, params, function (err, res) {
      if (err) throw err;
      socket.emit('appointment update success', res);
    });
  });

  socket.on('summary fetch', function(data) {
    var appointments = [];
    var dogs = [];
    var query = 'SELECT id FROM groomie.Appointment WHERE id_customer=(SELECT id FROM groomie.Customer WHERE id=?);';
    var params = [data.id];
    db.query(query, params, function (err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i ++) {
        appointments.push(res[i]);
      }
      var query = 'SELECT id FROM groomie.Dog WHERE id_customer=(SELECT id FROM groomie.Customer WHERE id=?);';
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

  socket.on('admin summary fetch', function(data) {
    var appointments = [];
    var feedback = [];
    var query = 'SELECT id FROM groomie.Appointment;';
    db.query(query, function (err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i ++) {
        appointments.push(res[i]);
      }
      var query = 'SELECT id FROM groomie.Feedback;';
      db.query(query, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i ++) {
          feedback.push(res[i]);
        }
        socket.emit('admin summary fetch success', {
          appointments,
          feedback
        });
      });
    });
  });

  socket.on('dog create', function(data) {
    var query = 'INSERT INTO groomie.Dog (name, breed, age, id_customer) VALUES (?, ?, ?, ?);';
    var params = [data.name, data.breed, data.age, data.id_customer];
    db.query(query, params, function (err, res) {
      if (err) throw err;
      socket.emit('dog create success', res);
    });
  });

  socket.on('dog delete', function(data) {
    var query = 'DELETE FROM groomie.Appointment WHERE id_dog=?;';
    var params = [data.id];
    db.query(query, params, function (err, res) {
      if (err) throw err;
      query = 'DELETE FROM groomie.Dog WHERE id=?;';
      db.query(query, params, function (err, res) {
        if (err) throw err;
        socket.emit('dog delete success', res[0]);
      });
    });
  });

  socket.on('dog fetch', function(data) {
    var query = 'SELECT id, name, age, breed FROM groomie.Dog WHERE id=?;';
    var params = [data.id];
    db.query(query, params, function (err, res) {
      if (err) throw err;
      socket.emit('dog fetch success', res[0]);
    });
  });

  socket.on('appointment fetch', function(data) {
    var query = 'SELECT id, DATE_FORMAT(date, "%Y-%m-%d") AS date, location, time_start, time_end, CONVERT(instructions USING utf8) as instructions, groom_option, (SELECT name FROM groomie.Groomer WHERE id=id_groomer) as groomer, (SELECT name FROM groomie.Dog WHERE id=id_dog) as dog FROM groomie.Appointment WHERE id=?;';
    var params = [data.id];
    db.query(query, params, function (err, res) {
      if (err) throw err;
      socket.emit('appointment fetch success', res[0]);
    });
  });

  socket.on('appointment list', function(data) {
    var query = 'SELECT name FROM groomie.Dog WHERE id_customer=?;';
    var params = [data.id];
    var ret = {};
    ret.options = groom_options;
    db.query(query, params, function (err, res) {
      if (err) throw err;
      ret.dogs = [];
      for (var i = 0; i < res.length; i ++) {
        ret.dogs.push(res[i]);
      }
      var query = 'SELECT time_start FROM groomie.Appointment WHERE date=?;';
      var params = [data.date];
      db.query(query, params, function (err, res) {
        if (err) throw err;
        var scheduled = [];
        for (var i = 0; i < res.length; i ++) {
          scheduled.push(res[i].time_start);
        }
        ret.times = generateDurations(generateAvailableTimes(scheduled));
        socket.emit('appointment list success', ret);
      });
    });
  });
  socket.on('appointment list 2', function(data) {
    var query = 'SELECT name FROM groomie.Dog WHERE id_customer=?;';
    var params = [data.id];
    var ret = {};
    ret.options = groom_options;
    db.query(query, params, function (err, res) {
      if (err) throw err;
      ret.dogs = [];
      for (var i = 0; i < res.length; i ++) {
        ret.dogs.push(res[i]);
      }
      var query = 'SELECT time_start FROM groomie.Appointment WHERE date=?;';
      var params = [data.date];
      db.query(query, params, function (err, res) {
        if (err) throw err;
        var scheduled = [];
        for (var i = 0; i < res.length; i ++) {
          scheduled.push(res[i].time_start);
        }
        ret.times = generateDurations(generateAvailableTimes(scheduled));
        socket.emit('appointment list 2 success', ret);
      });
    });
  });

  socket.on('appointment create', function(data) {
    var query = 'INSERT INTO groomie.Appointment (date, time_start, time_end, id_customer, id_groomer, id_dog, groom_option, location, instructions) VALUES (?, ?, ?, ?, ?, (SELECT id FROM groomie.Dog WHERE name=?), ?, ?, ?);';
    var params = [data.date, data.time.split('-')[0], data.time.split('-')[1], data.id_customer, 1, data.dog, data.option, data.address, data.instructions];
    db.query(query, params, function (err, res) {
      if (err) throw err;
      socket.emit('appointment create success', res);
    });
  });

  socket.on('appointment delete', function(data) {
    var query = 'DELETE FROM groomie.Appointment WHERE id=?;';
    var params = [data.id];
    db.query(query, params, function (err, res) {
      if (err) throw err;
      socket.emit('appointment delete success', res);
    });
  });

  socket.on('feedback submit', function(data) {
    var query = 'INSERT INTO groomie.Feedback (creator, title, content, created) VALUES (?, ?, ?, CURRENT_TIMESTAMP());';
    var params = [data.id, data.title, data.content];
    db.query(query, params, function (err, res) {
      if (err) throw err;
      socket.emit('feedback submit success', res);
    });
  });
/*
  socket.on('feedback fetch', function(data) {
    var query = 'SELECT '
    var params = [data.id];
  });
*/
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

function generateDurations(time_starts) {
  var times = {
    0:'09:00:00',
    1:'09:30:00',
    2:'10:00:00',
    3:'10:30:00',
    4:'11:00:00',
    5:'11:30:00',
    6:'12:00:00',
    7:'12:30:00',
    8:'13:00:00',
    9:'13:30:00',
    10:'14:00:00',
    11:'14:30:00',
    12:'15:00:00',
    13:'15:30:00',
    14:'16:00:00',
    15:'16:30:00',
    16:'17:00:00'
  }
  var keys = Object.keys(times);
  var key_end;
  var time_end;
  var time_all = [];
  for (var i = 0; i < time_starts.length; i ++) {
    for (let key of keys) {
      if (times[key] === time_starts[i]) {
        key_end = parseInt(key) + 3;
        time_end = times[key_end];
        time_all.push(time_starts[i] + '-' + time_end);
      }
    }
  }
  return time_all;
}

function generateAvailableTimes(time_starts) {
  console.log(time_starts);
  var times = ['09:00:00', '09:30:00', '10:00:00', '10:30:00', '11:00:00', '11:30:00', '12:00:00', '12:30:00', '13:00:00', '13:30:00', '14:00:00', '14:30:00', '15:00:00', '15:30:00'];
  for (var i = 0; i < time_starts.length; i ++) {
    var negates = generateNegatingTimes(time_starts[i]);
    for (var j = 0; j < times.length; j ++) {
      for (var k = 0; k < negates.length; k ++) {
        if (times[j] === negates[k]) {
          var index = times.indexOf(times[j]);
          if (index > -1) {
            times.splice(index, 1);
          }
        }
      }
    }
  }
  return(times);
}

function generateNegatingTimes(time_start) {
  console.log(time_start);
  var times = {
    0:'09:00:00',
    1:'09:30:00',
    2:'10:00:00',
    3:'10:30:00',
    4:'11:00:00',
    5:'11:30:00',
    6:'12:00:00',
    7:'12:30:00',
    8:'13:00:00',
    9:'13:30:00',
    10:'14:00:00',
    11:'14:30:00',
    12:'15:00:00',
    13:'15:30:00'
  }
  var available = ['09:00:00', '09:30:00', '10:00:00', '10:30:00', '11:00:00', '11:30:00', '12:00:00', '12:30:00', '13:00:00', '13:30:00', '14:00:00', '14:30:00', '15:00:00', '15:30:00'];
  var keys = Object.keys(times);
  var i;
  for (let key of keys) {
    if (times[key] === time_start) {
      i = parseInt(key);
    }
  }
  if (i == 0) {
    return(available.slice(i, i+3));
  } else if (i == 1) {
    return(available.slice(i-1, i+3));
  } else if (i == keys.length-1) {
    return(available.slice(i-2, i+1));
  } else if (i == keys.length-2) {
    return(available.slice(i-2, i+2));
  } else {
    return(available.slice(i-2, i+3));
  }
}
