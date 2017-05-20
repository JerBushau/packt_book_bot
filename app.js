'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const packtbot = require('./packtbot');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// serve static files
app.use(express.static(__dirname + '/public'));

// Oauth
app.get('/oauth', function(req, res){
  if (!req.query.code) {
    // access denied
    return res.redirect('https://packpubtbot.herokuapp.com/');
  }

  const data = {form: {
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      code: req.query.code
  }};

  // convert to modern promise style request at some point
  request.post('https://slack.com/api/oauth.access', data, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // Get an auth token
      const token = JSON.parse(body).access_token;

      // Get the team domain name to redirect to the team URL after auth
      request.post('https://slack.com/api/team.info', {form: {token: token}}, function (error, response, body) {
        if (!error && response.statusCode == 200) {

          if(JSON.parse(body).error == 'missing_scope') {
            return res.send('packtpubbot has been added to your team!');

          } else {
            let team = JSON.parse(body).team.domain;

            res.redirect(`http://${team}.slack.com`);
          }
        }
      });
    }
  })
});

// bot route
app.post('/freebook', packtbot);

// error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(400).send(err.message);
});

app.listen(port, function () {
  console.log('Packtbot listening on port ' + port);
});
