/*
 * SWEN90016 Software Processes and Management
 * Semester 1 2018
 * Assignment 2 - Groomie
 * index.js
 * Team Orange
 */

'use strict';

$(document).ready(function() {

  var socket = io.connect();
  var customer = {
    appointments: [],
    dogs : []
  };

  /* Home */
  $('#home-button-about').click({src: 'home', dir: 'forward', des: 'about'}, transition);
  $('#home-button-login').click({src: 'home', dir: 'forward', des: 'dashboard', fn: summaryFetch}, transition);
  $('#home-button-register').click({src: 'home', dir: 'forward', des: 'register'}, transition);

  /* Register */
  $('#register-button-register').click({src: 'register', dir: 'backward', des: 'home'}, transition);
  $('#register-button-back').click({src: 'register', dir: 'backward', des: 'home'}, transition);

  /* Dashboard */
  $('#dashboard-button-logout').click({src: 'dashboard', dir: 'backward', des: 'home'}, transition);
  $('#dashboard-button-create').click({src: 'dashboard', dir: 'forward', des: 'appointment-create'}, transition);
  $('#dashboard-button-create-dog').click({src: 'dashboard', dir: 'forward', des: 'dog-create'}, transition);

  /* Appointment Create */
  $('#appointment-create-button-back').click({src: 'appointment-create', dir: 'backward', des: 'dashboard'}, transition);
  $('#appointment-create-button-next').click({src: 'appointment-create', dir: 'forward', des: 'appointment-create-2', fn: appointmentList}, transition);

  /* Appointment Create 2 */
  $('#appointment-create-2-button-create').click({src: 'appointment-create-2', dir: 'backward', des: 'dashboard', fn: appointmentCreate}, transition);
  $('#appointment-create-2-button-back').click({src: 'appointment-create-2', dir: 'backward', des: 'appointment-create'}, transition);

  /* Appointment Detail */
  $('#appointment-detail-button-back').click({src: 'appointment-detail', dir: 'backward', des: 'dashboard'}, transition);

  /* Dog Create */
  $('#dog-create-button-create').click({src: 'dog-create', dir: 'backward', des: 'dashboard', fn: dogCreate}, transition);
  $('#dog-create-button-back').click({src: 'dog-create', dir: 'backward', des: 'dashboard'}, transition);

  /* Dog Detail */
  $('#dog-detail-button-back').click({src: 'dog-detail', dir: 'backward', des: 'dashboard'}, transition);

  /* About */
  $('#about-button-back').click({src: 'about', dir: 'backward', des: 'home'}, transition);

  select('home');

  function transition(e) {
    /* Determines direction */
    if (e.data.dir === 'forward') {
      $('.content').css('animation', 'slide-in 0.75s forwards');
      $('.content').css('-webkit-animation', 'slide-in 0.75s forwards');
    } else {
      $('.content').css('animation', 'slide-out 0.75s forwards');
      $('.content').css('-webkit-animation', 'slide-out 0.75s forwards');
    }
    /* Executes supplied function if supplied */
    if (e.data.fn) {
      e.data.fn();
    } else {
      select(e.data.des);
    }
  }

  /* Login */
  function login() {
  }
  socket.on('login success', function(res) {
  });
  socket.on('login failure', function(res) {
  });

  /* Logout */
  function logout() {
  }
  socket.on('logout success', function(res) {
  });
  socket.on('logout failure', function(res) {
  });

  /* Register */
  function register() {
  }
  socket.on('register success', function(res) {
  });
  socket.on('register failure', function(res) {
  });

  /* Summary Fetch */
  function summaryFetch() {
    socket.emit('summary fetch', {
      customer: 'admin'
    });
  }
  socket.on('summary fetch success', function(res) {
    console.log(res);
    select('dashboard');
    clear('dashboard-appointments');
    clear('dashboard-dogs');
    var appointments = $('#dashboard-appointments');
    var dogs = $('#dashboard-dogs');
    for (var i = 0; i < res.appointments.length; i ++) {
      appointments.append('<li>' + res.appointments[i].id + '</li>');
    }
    for (var i = 0; i < res.dogs.length; i ++) {
      dogs.append('<li>' + res.dogs[i].name + '</li>');
    }

    // onclick
    appointments.on('click', 'li', function() {
      socket.emit('appointment fetch', {
        id: $(this).html()
      });
    });
    dogs.on('click', 'li', function() {
      socket.emit('dog fetch', {
        name: $(this).html()
      });
    });
  });
  socket.on('summary fetch failure', function(res) {
  });

  /* Appointment Fetch */
  socket.on('appointment fetch success', function(res) {
    console.log(res);
    select('appointment-detail');
    $('#appointment-detail-date').val(res.date);
    $('#appointment-detail-time').val(res.time_start + '-' + res.time_end);
    $('#appointment-detail-dog').val(res.dog);
    $('#appointment-detail-groomer').val(res.groomer);
    $('#appointment-detail-option').val(res.groom_option);
    $('#appointment-detail-instructions').val(res.instructions);
  });

  /* Dog Fetch */
  socket.on('dog fetch success', function(res) {
    select('dog-detail');
    $('#dog-detail-name').val(res.name);
    $('#dog-detail-age').val(res.age);
    $('#dog-detail-breed').val(res.breed);
  });

  /* Dog Create */
  function dogCreate() {
    socket.emit('dog create', {
      name: $('#dog-create-name').val(),
      age: parseInt($('#dog-create-age').val()),
      breed: $('#dog-create-breed').val(),
      customer: 'admin'
    });
    select('loader');
  }
  socket.on('dog create success', function(res) {
    select('dashboard');
  });

  /* Profile Fetch */
  function profileFetch() {
  }
  socket.on('profile fetch success', function(res) {
  });
  socket.on('profile fetch failure', function(res) {
  });

  /* Profile Edit */
  function profileEdit() {
  }

  /* Profile Update */
  function profileUpdate() {
  }
  socket.on('profile update success', function(res) {
  });
  socket.on('profile update failure', function(res) {
  });

  /* Appointment List */
  function appointmentList() {
    socket.emit('appointment list', {
      date: '2018-05-05'
    });
    select('loader');
  }
  socket.on('appointment list success', function(res) {
    select('appointment-create-2');
    var times = $('#appointment-create-2-times');
    var dogs = $('#appointment-create-2-dogs');
    var options = $('#appointment-create-2-options');
    clear('appointment-create-2-times');
    clear('appointment-create-2-dogs');
    clear('appointment-create-2-options');
    $('#appointment-create-2-address').val('');
    $('#appointment-create-2-instructions').val('');
    for (var i = 0; i < res.times.length; i ++) {
      times.append('<option>' + res.times[i] + '</option>');
    }
    for (var i = 0; i < res.dogs.length; i ++) {
      dogs.append('<option>' + res.dogs[i] + '</option>');
    }
    for (var i = 0; i < res.options.length; i ++) {
      options.append('<option>' + res.options[i] + '</option>');
    }
  });
  socket.on('appointment list failure', function(res) {
  });

  /* Appointment Create */
  function appointmentCreate() {
    socket.emit('appointment create', {
      time: $('#appointment-create-2-times').val(),
      customer: 'admin',
      dog: $('#appointment-create-2-dogs').val(),
      option: $('#appointment-create-2-options').val(),
      address: $('#appointment-create-2-address').val(),
      instructions: $('#appointment-create-2-instructions').val()
    });
    select('loader');
  }
  socket.on('appointment create success', function(res) {
    select('dashboard');
  });
  socket.on('appointment create failure', function(res) {
  });

  /* Appointment Fetch */
  function appointmentFetch() {
  }
  socket.on('appointment fetch success', function(res) {
  });
  socket.on('appointment fetch failure', function(res) {
  });

  /* Appointment Delete */
  function appointmentDelete() {
  }
  socket.on('appointment delete success', function(res) {
  });
  socket.on('appointment delete failure', function(res) {
  });

  /* Appointment Edit */
  function appointmentEdit() {
  }

  /* Appointment Update */
  function appointmentUpdate() {
  }
  socket.on('appointment update success', function(res) {
  });
  socket.on('appointment update failure', function(res) {
  });

});

/* Loads elements corresponding to tab criteria. */
function select(tab) {
  document.getElementById('header-title').innerHTML = tab;
	var contents = document.getElementsByClassName('content');
	for (var i = 0; i < contents.length; i ++) {
		contents[i].style.display = 'none';
	}
	document.getElementById(tab).style.display = 'block';
}

/* Displays a toast message */
function snackbar(msg) {
  var x = document.getElementById('toast');
  //var x = document.getElementById('snackbar');
  x.innerHTML = msg;
  //x.className = 'show';
  setTimeout(function() {
    //x.className = x.className.replace('show', '');
    x.innerHTML = '';
  }, 2000);
}

function clear(id) {
  var list = document.getElementById(id);
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
}
