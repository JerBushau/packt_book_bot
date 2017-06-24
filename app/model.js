'use strict'

class Model {
  constructor(db) {
    this.teams = [];
    this.db = db;
  }

  // init data
  init() {
    this.db.get()
    .then(teams => {
      this.teams = teams;
    })
    .then(_ => { console.log(this.teams)});
  }

  addNewTeam(team) {
    // not sure how else to get the webhook url other than to add to db
    // when team installs app..
    this.db.addNewTeam(team);
  }

  scheduleReminder(team, time) {
    team.isScheduled = true;
    team.time = time;
    this.db.update(team);
  }

  cancelReminder(team) {
    team.isScheduled = false;
    team.time = null;
    this.db.update(team);
  }
}

module.exports = Model;
