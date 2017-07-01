'use strict'

const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  url: String,
  teamID: String,
  time: Number,
  isScheduled: Boolean,
  postData: {
    postErrors: { type: Number, default: 0 },
    remindersPosts: { type: Number, default: 0 },
    publicFreebookPosts: { type: Number, default: 0 },
    privateFreebookPosts: { type: Number, default: 0 }
  }
});

const model = mongoose.model('Team', teamSchema);

module.exports = model;
