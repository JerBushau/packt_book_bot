'use strict'

const Mssgr = require('./mssgr');
const nodeSchedule = require('node-schedule');

class Model {
  constructor(mssgr) {
    this.reminders = [];
    this.mssgr = mssgr;
  }

  add(reminder) {
    this.reminders.push(this.schedule(reminder));
    console.log(this.reminders);
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
    let self = this;
    let newRem = nodeSchedule.scheduleJob(`${reminder.time} * * * * *`, () => {
      this.mssgr.book()
    });
    newRem.teamID = reminder.teamID;
    return newRem
  }

}

module.exports = Model;
