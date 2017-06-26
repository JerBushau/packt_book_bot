'use strict'

class Model {
  constructor(db) {
    this.teams = [];
    this.db = db;
  }

  // refresh data
  refresh() {
    this.db.get()
    .then(teams => {
      this.teams = teams;
    })
    .then(_ => { console.log(this.teams)});
  }

  addNewTeam(team) {
    return new Promise((resolve, reject) => {
      this.db.addNewTeam(team);
      resolve();
    });
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
