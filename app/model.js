'use strict'

const nodeSchedule = require('node-schedule');

class Model {
  constructor(mssgr) {
    this.teams = [];
    this.mssgr = mssgr;
  }

  addNewTeam(team) {
    this.teams.push(team)
  }

  add(reminder) {
    this.teams.push(reminder);
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
