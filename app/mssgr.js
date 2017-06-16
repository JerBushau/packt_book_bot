'use strict'

const request = require('request');
const cheerio = require('cheerio');

const packt = 'https://www.packtpub.com/packt/offers/free-learning/';

class Mssgr {
  constructor() {
    this.errors = [];
  }

  formatTime(mTime) {
    if (mTime === 0) {
       return 12 + ' am'

    } else if (mTime >= 12) {
      if (mTime === 12) {
        return 12 + ' pm'
      }
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

  send(res, {url, type, mssg}) {
    let options = {
      uri: url,
      json: {
        response_type: type || 'ephemeral',
        contentType: 'application/json',
        text: mssg
      }
    };
    request.post(options, function(err, response) {
      if (err || response.statusCode !== 200) {
        console.log(err)
      }
      return res.status(200).json();
    });
  }

  // maybe turn these functions into an array of mssgs that can all be sent using Mssgr.send()
  book(res, options) {
    this.bookMssg()
    .then(mssg => {
      this.send(res, {url: options.url, type: options.type, mssg: mssg});
    });
  }

  // slash replies
  add(res, time) {
    const mssg = `Your reminder is scheduled for ${this.formatTime(time)} every day! To cancel type: \`/freebook cancel\`.`;
    res.status(200).json({response_type: 'in_channel', text: mssg})
  }

  remove(res) {
    const mssg = `Your reminder has been canceled.`;
    res.status(200). json({response_type: 'in_channel', text: mssg});
  }

  error(res, url) {

  }

  help(res, url) {

  }

}

module.exports = Mssgr;
