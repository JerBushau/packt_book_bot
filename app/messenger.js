'use strict'

const request = require('request');
const cheerio = require('cheerio');

const packt = 'https://www.packtpub.com/packt/offers/free-learning/';

class Messenger {
  constructor(tracker) {
    this.tracker = tracker;
  }

  // put this somewhere else maybe helpers
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

  // possibly put this in it's own obj to facilitate expansion of scraping function in future
  bookMssg() {
    return new Promise((resolve, reject) => {
      request(packt, function (err, response, body) {
        if (err) { reject(err) };
        const $ = cheerio.load(body);
        const freeBook = $('.dotd-title h2').text().trim();
        if (!freeBook) {
          let message = `>:cake: THE CAKE IS A LIE! :cake:` +
            `\nI was unable to retrieve the free book at this time. Something may be wrong with ${packt}.`;
          return resolve(message);
        }
        let message = `Today's free book is '${freeBook}'. \n:point_right: ${packt}.`;
        resolve(message);
      });
    });
  }

  // look into adding the ability to add optional args such as an attachments array etc...
  // post to webhook
  post(team, message) {
    let options = {
      uri: team.url,
      json: {
        response_type: 'in_channel',
        contentType: 'application/json',
        text: message
      }
    };
    request.post(options, (err, response) => {
      // if body === No service it is likely the team uninstalled app so after 3 of these
      // disable said teams reminder
      if (response.body === 'No service') {
        console.error('no service error');
        this.tracker.incrementData(team, 'postErrors');
        if (team.postData.postErrors > 2) {
          console.log(`disabling reminder for ${team.teamID}`);
          this.tracker.disableInactiveTeam(team);
        }
        return
      }
      console.log(`i posted at ${team.time} for ${team.teamID}.`);
    });
  }

  // scrape book then post
  postBook(team) {
    this.bookMssg()
    .then(message => {
      this.post(team, message);
      // update meta data
      this.tracker.incrementData(team, 'remindersPosts');
    })
    .catch(err => {
      console.error('scraping book failed', err);
    });
  }

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
  book(res, team, type) {
    // what happens if packt website is down
    this.bookMssg()
    .then(message => {
      this.send(res, { response_type: type, text: message });
      // update meta data based on type
      if (type === 'in_channel') {
        this.tracker.incrementData(team, 'publicFreebookPosts');
      }
      this.tracker.incrementData(team, 'privateFreebookPosts');
    });
    // catch possible errors here
  }

  welcome(team) {
    const message = 'Thank you for installing Freebookbot!';
    let options = {
      uri: team.url,
      json: {
        response_type: 'in_channel',
        contentType: 'application/json',
        text: message
      }
    };
    request.post(options, err => { if (err) { console.log(err)} });
  }

  schedule(res, time) {
    const message = `Your teams reminder is scheduled for ${this.formatTime(time)} every day!` +
      '\nTo cancel type: \`/freebook cancel\`.';
    this.send(res, { response_type: 'in_channel', text: message });
  }

  cancel(res) {
    const message = `Your teams reminder has been canceled.`;
    this.send(res, { response_type: 'in_channel', text: message });
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
    const message = '*Freebookbot* is a slack application that will help you and your team stay up on' +
      ' the Packt Publishing free learning offer of the day. \n*It provides the following options:*' +
      '\n>`/freebook` will post the free learning offer, only visible to you.' +
      '\n\n>`/freebook public` will post the free learning offer in the current channel.' +
      '\n\n>`/freebook x` where x is a number 0-23 will set a reminder to post the free learning' +
      ' offer at the specified time daily. For Example: to set the bot to post daily at 8am type' +
      ' `/freebook 8` or for 2pm type `/freebook 14` etc... Only one reminder allowed per team.' +
      '\n\n>`/freebook cancel` will cancel your teams reminder.' +
      '\n\n>`freebook help` displays this message. :v:';
    this.send(res, { text: message });
  }

}

module.exports = Messenger;
