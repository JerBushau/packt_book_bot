'use strict'

const Store = require('./store');
const Model = require('./model');
const Mssgr = require('./mssgr');
const App = require('./app');

const app = new App(Mssgr, Model, Store);

app.init();

module.exports = app;
