'use strict'

const nodeSchedule = require('node-schedule');

class App {
  constructor(messenger, tracker, crypt, model, db) {
    this.model = new model(new db);
    this.crypt = new crypt();
    this.messenger = new messenger(new tracker(this.model), this.crypt);
  }

  // function that will loop through and post free book to teams every hour
  init() {
    this.model.refresh();
    nodeSchedule.scheduleJob('0 * * * *', _ => {
      let currTime = new Date().getHours();
      this.model.teams.find(team => {
        if (team.isScheduled && team.time === currTime) {
          this.messenger.postBook(team);
        }
      });
    });
  }

  handleDuplicateTeam(team) {
    let _team = this.model.findTeamById(team.teamID);
    _team.url = team.url;
    _team.isScheduled = false;
    _team.time = null;
    this.model.db.update(_team);
    this.messenger.welcome(team);
    this.model.refresh();
  }

  // when a team installs the app add team to db
  addNewTeam(team) {
    if (this.model.isDuplicate(team)) {
      return this.handleDuplicateTeam(team);
    }
    this.model.addNewTeam(team)
    .then(_ => {
      // update model
      this.model.refresh();
      this.messenger.welcome(team);
    });
  }

  // further dry these up
  scheduleReminder(res, teamID, time) {
    let team = this.model.findTeamById(teamID);
    if (team.isScheduled) {
      return this.messenger.error(res, 'limit')
    }
    this.model.scheduleReminder(team, time);
    this.messenger.schedule(res, time);
  }

  cancelReminder(res, teamID) {
    let team = this.model.findTeamById(teamID)
    if (!team.isScheduled) {
      return this.messenger.error(res, 'notScheduled');
    }
    this.model.cancelReminder(team);
    this.messenger.cancel(res);
  }

}

module.exports = App;
