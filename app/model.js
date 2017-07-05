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

  isDuplicate(team) {
    if (typeof team === 'object') {
      return this.teams.some(item => {
        return team.teamID === item.teamID
      });
    }
    // assume that team is just teamID if not object
    return this.teams.some(item => {
      return team === item.teamID
    });
  }

  findTeamById(id) {
    return this.teams.find(team => {
      if (team.teamID === id) {
        return team
      }
    });
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

  deleteTeam(team) {
    let index = this.teams.indexOf(team);
    this.teams.splice(index, 1);
    this.db.deleteTeam(team._id);
  }

}

module.exports = Model;
