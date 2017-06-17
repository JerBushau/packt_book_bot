'use strict'

class App {
  constructor(mssgr, model, db) {
    this.mssgr = new mssgr;
    this.model = new model(this.mssgr);
    this.db = new db;
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
      return this.mssgr.error(res, 'limit')
    };
    this.model.add(reminder);
    this.db.add(reminder);
    this.mssgr.add(res, reminder.time);

  }

  remove(res, teamID) {
    if (!this.isDuplicate(teamID)) {
      return this.mssgr.error(res, 'limit')
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