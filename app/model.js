'use strict'

const nodeSchedule = require('node-schedule');

class Model {
  constructor(db) {
    this.teams = [];
    this.db = db;
  }

  refresh() {
    this.db.get()
    .then(teams => {
      this.teams = teams;
    });
  }

  addNewTeam(team) {
    this.db.addNewTeam(team, this.refresh);
  }

  scheduleReminder(id, time) {
    this.teams.find(team => {
      if (team.teamID === id) {
        team.isScheduled = true;
        team.time = time;
        return this.db.update(team, _ => { this.refresh() });
      }
    });
  }

  cancelReminder(id) {
    this.teams.find(team => {
      if (team.teamID === id) {
        team.time = null;
        team.isScheduled = false;
        return this.db.update(team, _ => { this.refresh() });
      }
    });
  }

}

module.exports = Model;
