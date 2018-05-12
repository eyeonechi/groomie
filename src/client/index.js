/*
 * SWEN90016 Software Processes and Management
 * Semester 1 2018
 * Assignment 2 - Groomie
 * index.js
 * Team Orange
 */

 /*************************************************************************/
 /* DATA CLASSES */
 /*************************************************************************/

class Dog {
  constructor(obj) {
    if (obj.id) this.id = obj.id;
    if (obj.name) this.name = obj.name;
    if (obj.age) this.age = obj.age;
    if (obj.breed) this.breed = obj.breed;
    if (obj.selected) this.selected = obj.selected;
  }
  update(obj) {
    if (obj.id) this.id = obj.id;
    if (obj.name) this.name = obj.name;
    if (obj.age) this.age = obj.age;
    if (obj.breed) this.breed = obj.breed;
    if (obj.selected) this.selected = obj.selected;
  }
}

class Customer {
  constructor(obj) {
    if (obj.id) this.id = obj.id;
    if (obj.name) this.name = obj.name;
    if (obj.phone) this.phone = obj.phone;
    if (obj.appointments) {
      this.appointments = new Array();
      for (let appointment of obj.appointments) {
        this.appointments.push(new Appointment(appointment));
      }
    }
    if (obj.dogs) {
      this.dogs = new Array();
      for (let dog of obj.dogs) {
        this.dogs.push(new Dog(dog));
      }
    }
  }
  update(obj) {
    if (obj.id) this.id = obj.id;
    if (obj.name) this.name = obj.name;
    if (obj.phone) this.phone = obj.phone;
    if (obj.appointments) {
      this.appointments = new Array();
      for (let appointment of obj.appointments) {
        this.appointments.push(new Appointment(appointment));
      }
    }
    if (obj.dogs) {
      this.dogs = new Array();
      for (let dog of obj.dogs) {
        this.dogs.push(new Dog(dog));
      }
    }
  }
  setAppointment(obj) {
    for (let appointment of this.appointments) {
      if (appointment.id === obj.id) {
        appointment.update(obj);
      }
    }
  }
  setDog(obj) {
    for (let dog of this.dogs) {
      if (dog.id === obj.id) {
        dog.update(obj);
      }
    }
  }
}

class Groomer {
  constructor(obj) {
    if (obj.id) this.id = obj.id;
    if (obj.name) this.name = obj.name;
  }
}

class Appointment {
  constructor(obj) {
    if (obj.id) this.id = obj.id;
    if (obj.name) this.name = obj.name;
    if (obj.location) this.location = obj.location;
    if (obj.time_start) this.time_start = obj.time_start;
    if (obj.time_end) this.time_end = obj.time_end;
    if (obj.instruction) this.instructions = obj.instructions;
    if (obj.groom_option) this.groom_option = obj.groom_option;
    if (obj.dog) this.dog = obj.dog;
    if (obj.selected) this.selected = obj.selected;
  }
  update(obj) {
    if (obj.id) this.id = obj.id;
    if (obj.name) this.name = obj.name;
    if (obj.location) this.location = obj.location;
    if (obj.time_start) this.time_start = obj.time_start;
    if (obj.time_end) this.time_end = obj.time_end;
    if (obj.instruction) this.instructions = obj.instructions;
    if (obj.groom_option) this.groom_option = obj.groom_option;
    if (obj.dog) this.dog = obj.dog;
    if (obj.selected) this.selected = obj.selected;
  }
}

'use strict';

$(document).ready(function() {

  var socket = io.connect();
  var customer;
  var editing = false;

  select('home');

  /*************************************************************************/
  /* EVENT LISTENERS */
  /*************************************************************************/

  /* Home */
  $('#home-button-about').click({src: 'home', dir: 'forward', des: 'about'}, transition);
  $('#home-button-login').click({src: 'home', dir: 'forward', des: 'dashboard', fn: login}, transition);
  $('#home-button-register').click({src: 'home', dir: 'forward', des: 'register'}, transition);

  /* Register */
  $('#register-button-register').click({src: 'register', dir: 'backward', des: 'home', fn: register}, transition);
  $('#register-button-back').click({src: 'register', dir: 'backward', des: 'home'}, transition);

  /* Dashboard */
  $('#dashboard-button-logout').click({src: 'dashboard', dir: 'backward', des: 'home', fn: logout}, transition);
  $('#dashboard-button-create').click({src: 'dashboard', dir: 'forward', des: 'appointment-create'}, transition);
  $('#dashboard-button-create-dog').click({src: 'dashboard', dir: 'forward', des: 'dog-create'}, transition);
  $('#dashboard-button-profile').click({src: 'dashboard', dir: 'forward', des: 'profile', fn: profileFetch}, transition);

  /* Profile Detail */
  $('#profile-detail-button-edit').click({src: 'profile-detail', dir: 'forward', des: 'profile-detail', fn: profileEdit}, transition);
  $('#profile-detail-button-back').click({src: 'profile-detail', dir: 'backward', des: 'home'}, transition);

  /* Appointment Create */
  $('#appointment-create-button-back').click({src: 'appointment-create', dir: 'backward', des: 'dashboard'}, transition);
  $('#appointment-create-button-next').click({src: 'appointment-create', dir: 'forward', des: 'appointment-create-2', fn: appointmentList}, transition);

  /* Appointment Create 2 */
  $('#appointment-create-2-button-create').click({src: 'appointment-create-2', dir: 'backward', des: 'dashboard', fn: appointmentCreate}, transition);
  $('#appointment-create-2-button-back').click({src: 'appointment-create-2', dir: 'backward', des: 'appointment-create'}, transition);

  /* Appointment Detail */
  $('#appointment-detail-button-delete').click({src: 'appointment-detail', dir: 'backward', des: 'dashboard', fn: appointmentDelete}, transition);
  $('#appointment-detail-button-back').click({src: 'appointment-detail', dir: 'backward', des: 'dashboard'}, transition);

  /* Dog Create */
  $('#dog-create-button-create').click({src: 'dog-create', dir: 'backward', des: 'dashboard', fn: dogCreate}, transition);
  $('#dog-create-button-back').click({src: 'dog-create', dir: 'backward', des: 'dashboard'}, transition);

  /* Dog Detail */
  $('#dog-detail-button-delete').click({src: 'dog-detail', dir: 'backward', des: 'dashboard', fn: dogDelete}, transition);
  $('#dog-detail-button-back').click({src: 'dog-detail', dir: 'backward', des: 'dashboard'}, transition);

  /* About */
  $('#about-button-back').click({src: 'about', dir: 'backward', des: 'home'}, transition);

  /*************************************************************************/
  /* COMMUNICATION LOGIC */
  /*************************************************************************/

  /* Login */
  function login() {
    socket.emit('login', {
      username: $('#home-username').val(),
      password: $('#home-password').val()
    });
    select('loader');
  }
  socket.on('login success', function(res) {
    customer = new Customer(res);
    summaryFetch();
  });
  socket.on('login failure', function(res) {
    snackbar('login failure');
    transition({data: {src: 'home', dir: 'backward', des: 'home'}});
  });

  /* Logout */
  function logout() {
    socket.emit('logout', {
      id: customer.id
    });
  }
  socket.on('logout success', function(res) {
    transition({data: {src: 'dashboard', dir: 'backward', des: 'home'}});
  });
  socket.on('logout failure', function(res) {
  });

  /* Register */
  function register() {
    socket.emit('register', {
      username: $('#register-username').val(),
      password: $('#register-password').val()
    });
  }
  socket.on('register success', function(res) {
    transition({data: {src: 'register', dir: 'backward', des: 'home'}});
  });
  socket.on('register failure', function(res) {
  });

  /* Summary Fetch */
  function summaryFetch() {
    socket.emit('summary fetch', {
      id: customer.id
    });
  }
  socket.on('summary fetch success', function(res) {
    transition({data: {src: 'login', dir: 'forward', des: 'dashboard'}});
    clear('dashboard-appointments');
    clear('dashboard-dogs');
    customer.update(res);
    console.log(customer);
    var appointments = $('#dashboard-appointments');
    var dogs = $('#dashboard-dogs');
    for (var i = 0; i < res.appointments.length; i ++) {
      appointments.append('<li>' + res.appointments[i].id + '</li>');
    }
    for (var i = 0; i < res.dogs.length; i ++) {
      dogs.append('<li>' + res.dogs[i].id + '</li>');
    }

    // onclick
    appointments.on('click', 'li', function() {
      socket.emit('appointment fetch', {
        id: $(this).html()
      });
    });
    dogs.on('click', 'li', function() {
      socket.emit('dog fetch', {
        id: $(this).html()
      });
    });
  });
  socket.on('summary fetch failure', function(res) {
  });

  /* Appointment Fetch */
  socket.on('appointment fetch success', function(res) {
    res.selected = true;
    customer.setAppointment(res);
    transition({data: {src: 'dashboard', dir: 'forward', des: 'appointment-detail'}});
    $('#appointment-detail-date').val(res.date);
    $('#appointment-detail-time').val(res.time_start + '-' + res.time_end);
    $('#appointment-detail-dog').val(res.dog);
    $('#appointment-detail-groomer').val(res.groomer);
    $('#appointment-detail-option').val(res.groom_option);
    $('#appointment-detail-instructions').val(res.instructions);
  });

  /* Dog Fetch */
  socket.on('dog fetch success', function(res) {
    res.selected = true;
    customer.setDog(res);
    transition({data: {src: 'dashboard', dir: 'forward', des: 'dog-detail'}});
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
      id_customer: customer.id
    });
    select('loader');
  }
  socket.on('dog create success', function(res) {
    transition({data: {src: 'dog-create', dir: 'backward', des: 'dashboard', fn: summaryFetch}});
  });

  /* Dog Delete */
  function dogDelete() {
    for (let dog of customer.dogs) {
      if (dog.selected) {
        socket.emit('dog delete', {
          id: dog.id
        });
      }
    }
    select('loader');
  }
  socket.on('dog delete success', function(res) {
    transition({data: {src: 'appointment-create', dir: 'backward', des: 'dashboard', fn: summaryFetch}});
  });
  socket.on('dog delete failure', function(res) {
  });

  /* Profile Fetch */
  function profileFetch() {
    socket.emit('profile fetch', {
      id: customer.id
    });
    select('loader');
  }
  socket.on('profile fetch success', function(res) {
    console.log(res);
    transition({data: {src: 'dashboard', dir: 'forward', des: 'profile-detail'}});
    $('#profile-detail-name').val(res.username);
    //$('#profile-detail-email').val(res.email);
    $('#profile-detail-phone').val(res.phone);
    //$('#profile-detail-birthdate').val(res.birthdate);
    //$('#profile-detail-address').val(res.address);
  });
  socket.on('profile fetch failure', function(res) {
  });

  /* Profile Edit */
  function profileEdit() {
    var edits = document.getElementsByClassName('edit');
    var editHides = document.getElementsByClassName('edit-hide');
    var editInputs = $('.edit-input');
    if (editing === true) {
      document.getElementById('profile-detail-button-edit').innerHTML = 'edit';
      editInputs.prop('readonly', true);
      editInputs.removeClass('input-editing');
      for (var i = 0; i < edits.length; i ++) {
        edits[i].style.display = 'none';
      }
      for (var i = 0; i < editHides.length; i ++) {
        editHides[i].style.display = 'inline-block';
      }
      editing = false;
    } else if (editing === false) {
      document.getElementById('profile-detail-button-edit').innerHTML = 'cancel';
      editInputs.prop('readonly', false);
      editInputs.addClass('input-editing');
      for (var i = 0; i < edits.length; i ++) {
        edits[i].style.display = 'inline-block';
      }
      for (var i = 0; i < editHides.length; i ++) {
        editHides[i].style.display = 'none';
      }
      editing = true;
    }
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
      id: customer.id,
      date: '2018-05-05'
    });
    select('loader');
  }
  socket.on('appointment list success', function(res) {
    transition({data: {src: 'appointment-create', dir: 'forward', des: 'appointment-create-2'}});
    console.log(res);
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
      dogs.append('<option>' + res.dogs[i].name + '</option>');
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
      id_customer: customer.id,
      dog: $('#appointment-create-2-dogs').val(),
      option: $('#appointment-create-2-options').val(),
      address: $('#appointment-create-2-address').val(),
      instructions: $('#appointment-create-2-instructions').val()
    });
    select('loader');
  }
  socket.on('appointment create success', function(res) {
    transition({data: {src: 'appointment-create', dir: 'backward', des: 'dashboard', fn: summaryFetch}});
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
    for (let appointment of customer.appointments) {
      if (appointment.selected) {
        socket.emit('appointment delete', {
          id: appointment.id
        });
      }
    }
    select('loader');
  }
  socket.on('appointment delete success', function(res) {
    transition({data: {src: 'appointment-detail', dir: 'backward', des: 'dashboard', fn: summaryFetch}});
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

});

/*************************************************************************/
/* AUXILIARY FUNCTIONS */
/*************************************************************************/

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
