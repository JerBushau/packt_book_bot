'use strict'

const Store = require('./store');
const Model = require('./model');
const Messenger = require('./messenger');
const Tracker = require('./tracker');
const Crypt = require('./crypt');
const App = require('./app');

const app = new App(Messenger, Tracker, Crypt, Model, Store);

// start app
app.init();

module.exports = app;
