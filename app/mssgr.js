'use strict'

const request = require('request');
const cheerio = require('cheerio');

const packt = 'https://www.packtpub.com/packt/offers/free-learning/';

class Mssgr {
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

  // look into adding the ability to add optional args such as an attachments array etc...
  // post to webhook
  post(team, mssg) {
    let options = {
      uri: team.url,
      json: {
        response_type: 'in_channel',
        contentType: 'application/json',
        text: mssg
      }
    };
    request.post(options, function(err, response) {
      if (err || response.statusCode !== 200) {
        console.log(err)
      }
    });
  }

  // scrape book then post
  postBook(team) {
    this.bookMssg()
    .then(mssg => {
      post(team, mssg)
    });
  }

  // look into adding the ability to add optional args such as an attachments array etc...
  // send response to slash commands
  send(res, { response_type='ephemeral', text }) {
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
      this.send(res, { response_type: type, text: mssg });
    });
  }

  welcome(team) {
    const mssg = 'Thank you for installing Freebookbot!';
    let options = {
      uri: team.url,
      json: {
        response_type: 'in_channel',
        contentType: 'application/json',
        text: mssg
      }
    };
    request.post(options, err => { if (err) { console.log(err)} });
  }

  schedule(res, time) {
    const mssg = `Your teams reminder is scheduled for ${this.formatTime(time)} every day!` +
      '\nTo cancel type: \`/freebook cancel\`.';
    this.send(res, { response_type: 'in_channel', text: mssg });
  }

  cancel(res) {
    const mssg = `Your teams reminder has been canceled.`;
    this.send(res, { response_type: 'in_channel', text: mssg });
  }

  error(res, error) {
    const errors = {
      limit: 'Only one reminder currently allowed per team.',
      notScheduled: 'To schedule a reminder type `/freebook x` where x is a number 0-23.\nType `/freebook' +
        ' help` for more information`',
      invalid: 'Valid commands are:\n`/freebook`,\n`/freebook public`,\n`/freebook 0-23`,' +
        '\n`/freebook cancel`' +
        '\nType `/freebook help` for more info.',
    };
    const err = errors[error];
    this.send(res, { text: err });
  }

  help(res) {
    const mssg = '*Freebookbot* is a slack application that will help you and your team stay up on' +
      ' the Packt Publishing free learning offer of the day. \n*It provides the following options:*' +
      '\n>`/freebook` will post the free learning offer, only visible to you.' +
      '\n\n>`/freebook public` will post the free learning offer in the current channel.' +
      '\n\n>`/freebook x` where x is a number 0-23 will set a reminder to post the free learning' +
      ' offer at the specified time daily. For Example: to set the bot to post daily at 8am type' +
      ' `/freebook 8` or for 2pm type `/freebook 14` etc... Only one reminder allowed per team.' +
      '\n\n>`/freebook cancel` will cancel your teams reminder.' +
      '\n\n>`freebook help` displays this message. :v:';
    this.send(res, { text: mssg });
  }

}

module.exports = Mssgr;
