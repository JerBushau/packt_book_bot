'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const packtbot = require('./packtbot')

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// test route
app.get('/', function (req, res) {
  res.status(200).send('testing!');
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
