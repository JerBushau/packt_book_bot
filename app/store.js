'use strict'

const request = require('request');
const apiURL = 'https://36b61a8b.ngrok.io/api';

class Store {
  get() {
    return new Promise((resolve, reject) => {
      request.get(`${apiURL}/teams`, (err, response, body) => {
        if (err) { console.error(err); }
        const _body = JSON.parse(response.body);
        const results = _body.teams;
        return resolve(results);
      });
    });
  }

  addNewTeam(team) {
    request.post(`${apiURL}/teams`, { form: team });
  }

  update(team) {
    request.put(`${apiURL}/team/${team._id}`, { form: team });
  }

  remove(id) {
    request.delete(`${apiURL}/teams/${id}`);
  }

}

module.exports = Store;
