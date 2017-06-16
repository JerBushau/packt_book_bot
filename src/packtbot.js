'use strict'
const app = require('../app/packtApp');

app.init();

module.exports = function (req, res, next) {
  let text = req.body.text.toLowerCase();
  let webhookURL = req.body.response_url;
  let teamID = req.body.team_id;

  // create a reminder
  if (text && /^((?:[0-9]|1[0-9]|2[0-3]))$/.test(text)) {
    app.add(res, {url: webhookURL, teamID: teamID, time: text});

  // cancel reminder
  } else if(text && text === 'cancel') {
    app.remove(res, teamID);

  // help
  } else if (text && text === 'help') {
    app.mssgr.help(res);

  // private response, in case you don't want to disturb your team.
  } else if (text && text === 'public') {
    app.mssgr.book(res, 'in_channel');

  // default
  } else if (!text){
    app.mssgr.book(res);

  // invalid command
  } else {
    return res.status(200).json({text: 'valid commands: `/freebook`, `/freebook private`, `/freebook 0-23`, ' +
      '`/freebook cancel` or `/freebook help`'});
  }
}