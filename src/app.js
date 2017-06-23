'use strict'

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const router = require('./routes')
const api = require('./api');

const app = express();
const port = process.env.PORT || 3000;

require('./database');

app.use(bodyParser.urlencoded({ extended: true }));

// serve static files
app.use('/', express.static(path.join(__dirname, '..', '/public')));

// oauth and bot
app.use('/', router);

// api route
app.use('/api', api);

// error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(400).send(err.message);
});

app.listen(port, function () {
  console.log('Packtbot listening on port ' + port);
});
