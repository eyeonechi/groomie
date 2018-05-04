'use strict';

$(document).ready(function() {

  var socket = io.connect();

  /* Home */
  $('#home-button-about').click({src: 'home', dir: 'forward', des: 'about'}, transition);
  $('#home-button-login').click({src: 'home', dir: 'forward', des: 'dashboard'}, transition);
  $('#home-button-register').click({src: 'home', dir: 'forward', des: 'register'}, transition);

  /* Register */
  $('#register-button-register').click({src: 'register', dir: 'backward', des: 'home'}, transition);
  $('#register-button-back').click({src: 'register', dir: 'backward', des: 'home'}, transition);

  /* Dashboard */
  $('#test').click({src: 'dashboard', dir: 'forward', des: 'appointment-detail'}, transition);
  $('#test1').click({src: 'dashboard', dir: 'forward', des: 'dog-detail'}, transition);
  $('#dashboard-button-logout').click({src: 'dashboard', dir: 'backward', des: 'home'}, transition);
  $('#dashboard-button-create').click({src: 'dashboard', dir: 'forward', des: 'appointment-create'}, transition);

  /* Appointment Create */
  $('#appointment-create-button-back').click({src: 'appointment-create', dir: 'backward', des: 'dashboard'}, transition);
  $('#appointment-create-button-next').click({src: 'appointment-create', dir: 'forward', des: 'appointment-create-2'}, transition);

  /* Appointment Create 2 */
  $('#appointment-create-2-button-create').click({src: 'appointment-create-2', dir: 'backward', des: 'dashboard'}, transition);
  $('#appointment-create-2-button-back').click({src: 'appointment-create-2', dir: 'backward', des: 'appointment-create'}, transition);

  /* Appointment Detail */
  $('#appointment-detail-button-back').click({src: 'appointment-detail', dir: 'backward', des: 'dashboard'}, transition);

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
  }
  socket.on('summary fetch success', function(res) {
  });
  socket.on('summary fetch failure', function(res) {
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

  /* Appointment Create */
  function appointmentCreate() {
  }
  socket.on('appointment create success', function(res) {
  });
  socket.on('appointment create failure', function(res) {
  });

  /* Appointment Delete */
  function appointmentDelete() {
  }
  socket.on('appointment delete success', function(res) {
  });
  socket.on('appointment delete failure', function(res) {
  });

  /* Appointment Fetch */
  function appointmentFetch() {
  }
  socket.on('appointment fetch success', function(res) {
  });
  socket.on('appointment fetch failure', function(res) {
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
