'use strict'

class App {
  constructor(mssgr, model, db) {
    this.mssgr = mssgr;
    this.model = model;
    this.db = db;
  }

  // On start up
  init() {
    this.db.get()
    .then(reminders => {
      reminders.forEach(reminder => {
        this.model.add(reminder);
      });
    });
  }

  add(res, reminder) {
    if (this.isDuplicate(reminder)) {
      // this.mssgr.error()
      return console.error('only one reminder can be set per team!')
    };
    this.model.add(reminder);
    this.db.add(reminder);
    this.mssgr.add(res, reminder.time)

  }

  remove(res, teamID) {
    if (!this.isDuplicate(teamID)) {
      return console.error('You don\'t have any scheduled reminders to cancel')
    }
    this.model.remove(teamID);
    this.db.remove(teamID);
    this.mssgr.remove(res);
  }

  isDuplicate(reminder) {
    if (typeof reminder === 'object') {
      return this.model.reminders.some(item => {
        return reminder.teamID === item.teamID
      });
    }
    // assume that reminder is just teamID if not object
    return this.model.reminders.some(item => {
      return reminder === item.teamID
    });
  }

}

module.exports = App;