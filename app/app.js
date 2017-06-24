'use strict'

class App {
  constructor(mssgr, model, db) {
    this.mssgr = new mssgr;
    this.model = new model(new db);
  }

  addNewTeam(team) {
    // re-write isDup to work to assure uniqueness
    this.model.addNewTeam(team);
    this.mssgr.welcome(team);
  }

  // dry these up
  scheduleReminder(res, teamID, time) {
    this.model.teams.forEach(team => {
      if (team.teamID === teamID) {
        if (team.isScheduled) {
          return this.mssgr.error(res, 'limit')
        }
        this.model.scheduleReminder(teamID, time);
        return this.mssgr.schedule(res, time)
      }
    });
  }

  cancelReminder(res, teamID) {
    this.model.teams.forEach(team => {
      if (team.teamID === teamID) {
        if (!team.isScheduled) {
          return this.mssgr.error(res, 'notScheduled');
        }
        this.model.cancelReminder(teamID);
        return this.mssgr.cancel(res)
      }
    });
  }

  // isDuplicate(team) {
  //   if (typeof team === 'object') {
  //     return this.model.reminders.some(item => {
  //       return team.teamID === item.teamID
  //     });
  //   }
  //   // assume that team is just teamID if not object
  //   return this.model.reminders.some(item => {
  //     return team === item.teamID
  //   });
  // }

}

module.exports = App;
