'use strict'

class Model {
  constructor(db) {
    this.teams = [];
    this.db = db;
  }

  // sync data
  refresh() {
    this.db.get()
    .then(teams => {
      this.teams = teams;
    });
  }

  addNewTeam(team) {
    // not sure how else to get the webhook url other than to add to db
    // when team installs app..
    this.db.addNewTeam(team, _ => { this.refresh() });
  }

  toggleReminder(team, time=null) {
    if (time) {
      team.isScheduled = true;
      team.time = time;
    } else {
      team.isScheduled = false;
      team.time = time;
    }
    return this.db.update(team, _ => { this.refresh() });
  }

}

module.exports = Model;
