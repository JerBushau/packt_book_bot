'use strict'

const nodeSchedule = require('node-schedule');

class Model {
  constructor() {
    this.reminders = [];
  }

  add(reminder) {
    this.reminders.push(this.schedule(reminder));
    console.log(reminder, 'scheduled.');
  }

  remove(id) {
    this.reminders.forEach((reminder, i) => {
      if (reminder.teamID === id) {
        this.reminders.splice(i, 1);
        // reminder.cancel()
      }
    });
  }

  schedule(reminder) {
    let newRem = reminder;
    return newRem
  }

}

module.exports = Model;
