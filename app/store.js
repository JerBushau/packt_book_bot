'use strict'

const request = require('request');
const apiURL = 'https://a0dea20e.ngrok.io/api';

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

  addNewTeam(team, cb) {
    request.post(`${apiURL}/teams`, { form: team });
    if (cb) { cb(); }
  }


  update(team, cb) {
    request.put(`${apiURL}/team/${team._id}`, { form: team });
    if (cb) { cb(); }

  }

  // remove by teamID (just testing stuff)
  remove(id) {
    request.delete(`${apiURL}/team/'${id}'`);
  }

}

module.exports = Store;
