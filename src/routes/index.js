'use strict'

const express = require('express');
const router = express.Router();

const request = require('request');

// import app here
const packtbot = require('../../app/packtbot');

router.get('/oauth', function(req, res){
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
      let _body = JSON.parse(body);
      const token = _body.access_token;
      const newTeam = {
        url: _body.incoming_webhook.url,
        teamID:_body.team_id
      };

      packtbot.addNewTeam(newTeam)

      // get the team domain name to redirect to the team URL after auth
      // (from tutorial debating usefulness vs a success page)
      request.post('https://slack.com/api/team.info', {form: {token: token}}, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          // add newTeam to db and model

          if(JSON.parse(body).error == 'missing_scope') {
            // add newTeam to db and model
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

router.post('/freebook', function (req, res, next) {
  let text = req.body.text.toLowerCase();
  let teamID = req.body.team_id;

  // create a reminder
  if (text && /^((?:[0-9]|1[0-9]|2[0-3]))$/.test(text)) {
    packtbot.add(res, { time: text });

  // cancel reminder
  } else if(text && text === 'cancel') {
    packtbot.remove(res, teamID);

  // help
  } else if (text && text === 'help') {
    packtbot.mssgr.help(res);

  // private response, in case you don't want to disturb your team.
  } else if (text && text === 'public') {
    packtbot.mssgr.book(res, 'in_channel');

  // default
  } else if (!text){
    packtbot.mssgr.book(res);

  // invalid command
  } else {
    packtbot.mssgr.error(res, 'invalid');
  }
});

module.exports = router;
