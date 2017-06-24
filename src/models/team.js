'use strict'

const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  url: String,
  teamID: String,
  time: Number,
  isScheduled: Boolean
});

const model = mongoose.model('Reminder', reminderSchema);

module.exports = model;
