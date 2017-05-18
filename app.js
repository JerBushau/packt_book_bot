var express = require('express');
var bodyParser = require('body-parser');
var packtbot = require('./packtbot')

var app = express();
var port = process.env.PORT || 3000;

// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// test route
app.get('/', function (req, res) {
  res.status(200).send('Hello world!');
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
