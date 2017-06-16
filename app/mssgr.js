'use strict'

const request = require('request');
const cheerio = require('cheerio');

const packt = 'https://www.packtpub.com/packt/offers/free-learning/';

class Mssgr {
  constructor() {
    this.errors = [];
  }

  formatTime(mTime) {
    mTime = parseInt(mTime);
    if (mTime === 0) {
      return 12 + ' am'
    } else if (mTime === 12) {
      return 12 + ' pm'
    } else if (mTime > 12) {
      return mTime - 12 + ' pm'
    }
    return mTime + ' am'
  }

  bookMssg() {
    return new Promise((resolve, reject) => {
      request(packt, function (err, response, body) {
        if (err) { return 'Something went wrong...' };
        const $ = cheerio.load(body);
        const freeBook = $('.dotd-title h2').text().trim();
        let mssg = `Today's free book is '${freeBook}'. \n:point_right: ${packt}`;
        resolve(mssg);
      });
    });
  }

  postBook({url, }) {
    bookMssg()
    .then(mssg => {
      request.post({url, });
    });
  }

  send(res, {response_type='ephemeral', text}) {
    let options =  {
      response_type: response_type,
      contentType: 'application/json',
      text: text
    };

    return res.status(200).json(options);
  }

  // slash replies
  // maybe turn these functions into an array of mssgs that can all be sent using Mssgr.send()
  book(res, type) {
    this.bookMssg()
    .then(mssg => {
      this.send(res, { response_type: type, text: mssg})
    });
  }

  add(res, time) {
    const mssg = `Your reminder is scheduled for ${this.formatTime(time)} in this channel every day!
To cancel type: \`/freebook cancel\`.`;
    this.send(res, { response_type: 'in_channel', text: mssg })
  }

  remove(res) {
    const mssg = `Your teams reminder has been canceled.`;
    this.send(res, { response_type: 'in_channel', text: mssg });
  }

  error(res) {

  }

  help(res) {
    const mssg = `All the help text.`;
    this.send(res, {text: mssg});
  }

}

module.exports = Mssgr;
