'use strict'

const request = require('request');
const apiURL = 'https://aa68a38e.ngrok.io/api';

class Store {
  get() {
    return new Promise((resolve, reject) => {
      request.get(`${apiURL}/reminders`, (err, response, body) => {
        if (err) { console.error(err); }
        const _body = JSON.parse(response.body);
        const reminders = _body.reminders;
        return resolve(reminders);
      });
    });
  }

  add(reminder) {
    request.post(`${apiURL}/reminders`, {form: reminder});
  }

  remove(id) {
    request.delete(`${apiURL}/reminder/'${id}'`);
  }

}

module.exports = Store;
