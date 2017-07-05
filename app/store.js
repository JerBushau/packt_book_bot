'use strict'

const request = require('request');
const apiURL = 'https://e97f7f47.ngrok.io/api';

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

  deleteTeam(id) {
    request.delete(`${apiURL}/teams/${id}`);
  }

}

module.exports = Store;
