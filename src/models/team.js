'use strict'

const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  url: String,
  teamID: String,
  time: Number,
  isScheduled: Boolean
});

const model = mongoose.model('Team', teamSchema);

module.exports = model;
