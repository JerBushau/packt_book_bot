'use strict'

const nodeSchedule = require('node-schedule');

class App {
  constructor(mssgr, model, db) {
    this.mssgr = new mssgr;
    this.model = new model(new db);
  }

  // function that will loop through and post free book to teams every hour
  init() {
    this.model.refresh();
    nodeSchedule.scheduleJob('0 * * * *', _ => {
      let currTime = new Date().getHours();
      this.model.teams.find(team => {
        if (team.isScheduled && team.time === currTime) {
          console.log(`i posted at ${team.time} for ${team.teamID}.`);
          this.mssgr.postBook(team);
        }
      });
    });
  }

  // when a team installs the app add team to db
  addNewTeam(team) {
    if (this.isDuplicate(team)) {
      // possibly delete old entry or update if reinstall takes place...
      return console.error('Team already exists.')
    }
    this.model.addNewTeam(team)
    .then(_ => {
      // update model
      this.model.refresh();
      this.mssgr.welcome(team);
    });
  }

  // dry these up
  scheduleReminder(res, teamID, time) {
    this.model.teams.find(team => {
      if (team.teamID === teamID) {
        if (team.isScheduled) {
          return this.mssgr.error(res, 'limit')
        }
        this.model.scheduleReminder(team, time);
        this.mssgr.schedule(res, time);
      }
    });
  }

  cancelReminder(res, teamID) {
    this.model.teams.find(team => {
      if (team.teamID === teamID) {
        if (!team.isScheduled) {
          return this.mssgr.error(res, 'notScheduled');
        }
        this.model.cancelReminder(team);
        this.mssgr.cancel(res);
      }
    });
  }

  // maybe put this in model? maybe create a team obj?
  isDuplicate(team) {
    if (typeof team === 'object') {
      return this.model.teams.some(item => {
        return team.teamID === item.teamID
      });
    }
    // assume that team is just teamID if not object
    return this.model.teams.some(item => {
      return team === item.teamID
    });
  }

}

module.exports = App;
