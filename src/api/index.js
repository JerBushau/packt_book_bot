'use strict'

const express = require('express');
const Reminder = require('../models/reminder');
const router = express.Router();

// GET all reminders
router.get('/reminders', function(req, res) {
  Reminder.find({}, function(err, reminders) {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json({ reminders: reminders });
  });
});

// POST new reminder
router.post('/reminders', function(req, res) {
  const reminder = req.body;
  console.log(req.body);
  Reminder.create(reminder, function(err, reminder) {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json({ reminder: reminder, message: 'Reminder created' });
  });
});

// DELETE
router.delete('/reminders/:id', function(req, res) {
  const id = req.params.id;
  Reminder.findByIdAndRemove(id, function(err, result) {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json({ message: 'Reminder deleted' });
  });
});

module.exports = router;
