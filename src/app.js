'use strict'

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const api = require('./api');

// implement a router to handle 
// non api routes
const packtbot = require('../app/packtbot');

const app = express();
const port = process.env.PORT || 3000;

require('./database');

app.use(bodyParser.urlencoded({ extended: true }));

// serve static files
app.use('/', express.static(path.join(__dirname, '..', '/public')));

// oauth route
app.get('/oauth', function(req, res){
  if (!req.query.code) {
    // access denied
    return res.redirect('https://packtpubbot.herokuapp.com/');
  }

  const data = {form: {
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      code: req.query.code
  }};

  request.post('https://slack.com/api/oauth.access', data, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // get the auth token and webhook url
      const token = JSON.parse(body).access_token;

      console.log(response, body);
      // get the team domain name to redirect to the team URL after auth(from tutorial debating usefulness vs a success page)
      request.post('https://slack.com/api/team.info', {form: {token: token}}, function (error, response, body) {
        if (!error && response.statusCode == 200) {

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

// api route
app.use('/api', api);

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