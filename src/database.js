'use strict'

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/teams', function(err) {
  if (err) {
    console.error('Failed connecting to Mongo... :(', err);
  } else {
    console.log('Successfully connected to Mongo! :D');
  }
});
