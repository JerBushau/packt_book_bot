'use strict'

// tracks team meta data
class Tracker {
  constructor(model) {
    this.model = model;
  }

  incrementData(team, field) {
    team.postData[field]++
    this.model.db.update(team);
  }

  disableInactiveTeam(team) {
    team.isScheduled = false;
    team.time = null;
    team.postData.postErrors = 0;
    this.model.db.update(team);
  }

}

module.exports = Tracker;
