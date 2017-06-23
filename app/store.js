'use strict'

const request = require('request');
const apiURL = 'https://d6135493.ngrok.io/api';

class Store {
  get() {
    return new Promise((resolve, reject) => {
      request.get(`${apiURL}/teams`, (err, response, body) => {
        if (err) { console.error(err); }
        const _body = JSON.parse(response.body);
        const teams = _body.teams;
        return resolve(teams);
      });
    });
  }

  addNewTeam(team) {
    request.post(`${apiURL}/teams`, { form: team });
  }

  add(reminder) {
    request.post(`${apiURL}/teams`, { form: reminder });
  }

  remove(id) {
    request.delete(`${apiURL}/team/'${id}'`);
  }

}

module.exports = Store;
