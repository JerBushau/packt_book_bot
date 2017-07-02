'use strict'

// tracks team meta data and handles stuff related to tracking
class Tracker {
  constructor(model) {
    this.model = model;
  }

  incrementData(team, field) {
    team.postData[field]++
    this.model.db.update(team);
  }

  checkIfInactive(team) {
    if (team.postData.postErrors > 2) {
      console.log(`disabling reminder for ${team.teamID}`);
      this.disableInactiveTeam(team);
    }
  }

  disableInactiveTeam(team) {
    team.isScheduled = false;
    team.time = null;
    team.postData.postErrors = 0;
    this.model.db.update(team);
  }

}

module.exports = Tracker;
