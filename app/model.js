'use strict'

const nodeSchedule = require('node-schedule');

class Model {
  constructor(mssgr) {
    this.reminders = [];
    this.mssgr = mssgr;
  }

  add(reminder) {
    this.reminders.push(this.schedule(reminder));
  }

  remove(id) {
    this.reminders.forEach((reminder, i) => {
      if (reminder.teamID === id) {
        this.reminders.splice(i, 1);
        reminder.cancel()
      }
    });
  }

  schedule(reminder) {
    let newRem = nodeSchedule.scheduleJob(`0 ${reminder.time} * * *`, () => {
      this.mssgr.postBook(reminder)
    });
    newRem.teamID = reminder.teamID;
    return newRem
  }

}

module.exports = Model;
