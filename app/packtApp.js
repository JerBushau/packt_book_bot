const Store = require('./store');
const Model = require('./model');
const Mssgr = require('./mssgr');
const App = require('./app');

const app = new App(new Mssgr, new Model, new Store);

module.exports = app;