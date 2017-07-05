'use strict'

const express = require('express');
const router = express.Router();

const request = require('request');

const packtbot = require('../../app/packtbot');

// uninstall event route
router.post('/events', function(req, res, next) {
  const payload = req.body;
  console.log('req.body:', payload);
  res.send(payload.challenge);
});

// oauth route
router.get('/oauth', function(req, res) {
  if (!req.query.code) {
    // access denied
    return res.redirect('https://packtpubbot.herokuapp.com/');
  }

  const data = {
    form: {
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      code: req.query.code
    }
  };

  request.post('https://slack.com/api/oauth.access', data, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      // get the auth token and webhook url
      const _body = JSON.parse(body);
      const token = _body.access_token;
      const newTeam = {
        // encrypt pw here
        url: packtbot.crypt.encrypt(_body.incoming_webhook.url),
        teamID:_body.team_id
      };

      // make new entry when team installs app
      packtbot.addNewTeam(newTeam)

      // get the team domain name to redirect to the team URL after auth
      // (from tutorial debating usefulness vs a success page)
      request.post('https://slack.com/api/team.info', {form: {token: token}}, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          if(JSON.parse(body).error == 'missing_scope') {
            return res.send('packtpubbot has been added to your team!');

          } else {
            let team = JSON.parse(body).team.domain;
            return res.redirect(`http://${team}.slack.com`);
          }
        }
      });
    }
  });
});

// bot route
router.post('/freebook', function (req, res, next) {
  let text = req.body.text.toLowerCase();
  let teamID = req.body.team_id;
  let team = packtbot.model.findTeamById(teamID);

  // create a reminder
  if (text && /^((?:[0-9]|1[0-9]|2[0-3]))$/.test(text)) {
    packtbot.scheduleReminder(res, teamID, parseInt(text));

  // cancel reminder
  } else if(text && text === 'cancel') {
    packtbot.cancelReminder(res, teamID)

  // help
  } else if (text && text === 'help') {
    packtbot.messenger.help(res);

  // private response, in case you don't want to disturb your team.
  } else if (text && text === 'public') {
    packtbot.messenger.book(res, team, 'in_channel');

  // default
  } else if (!text){
    packtbot.messenger.book(res, team);

  // invalid command
  } else {
    packtbot.messenger.error(res, 'invalid');
  }
});

module.exports = router;
