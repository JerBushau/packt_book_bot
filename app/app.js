'use strict'

const nodeSchedule = require('node-schedule');

class App {
  constructor(mssgr, model, db) {
    this.mssgr = new mssgr;
    this.model = new model(new db);
  }

  // function that will loop through and post free book to teams every hour
  // working in tests need to config it to post mssg...
  init() {
    this.model.refresh()
    nodeSchedule.scheduleJob('0 * * * *', _ => {
      let scheduledReminders = [];
      let currTime = new Date().getHours();
      this.model.teams.find(team => {
        if (team.isScheduled && team.time === currTime) {
          // either post book here instead of pushing to array
          scheduledReminders.push(team)
        }
      });
      // or loop through schedReminders and post book to each here...
      console.log(scheduledReminders)
    });
  }

  // when a team installs the app add team to db
  addNewTeam(team) {
    if (this.isDuplicate(team)) {
      return new error('Team already exists.')
    }
    this.model.addNewTeam(team);
    this.mssgr.welcome(team);
  }

  // dry these up, possibly do toggle like in model
  scheduleReminder(res, teamID, time) {
    this.model.teams.find(team => {
      if (team.teamID === teamID) {
        if (team.isScheduled) {
          return this.mssgr.error(res, 'limit')
        }
        this.model.toggleReminder(team, time);
        return this.mssgr.schedule(res, time)
      }
    });
  }

  cancelReminder(res, teamID) {
    this.model.teams.find(team => {
      if (team.teamID === teamID) {
        if (!team.isScheduled) {
          return this.mssgr.error(res, 'notScheduled');
        }
        this.model.toggleReminder(team);
        return this.mssgr.cancel(res)
      }
    });
  }

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
