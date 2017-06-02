'use strict'

const request = require('request');
const cheerio = require('cheerio');
const schedule = require('node-schedule');
const packt = 'https://www.packtpub.com/packt/offers/free-learning/';
const errorPayload = {
  response_type: 'ephemeral',
  text: `Sorry, try again in a few seconds!`
};
const helpPayload = {
  response_type: 'ephemeral',
  text: `The goal of this bot is to collect and share the link to and title of the Packtpub.com free learning offer of the day.\nSimply type \`/freebook\` to share in channel or \`/freebook private\` to view privately!`
};

let jobs = [];

function scrapeBook(res, url, cb) {
  request(packt, function (err, response, body) {
    if (err) {
      return 'Something went wrong...'
    }
    const $ = cheerio.load(body);
    const freeBook = $('.dotd-title h2').text().trim();
    let mssg = `Today's free book is '${freeBook}'. \n:point_right: ${packt}`;

    cb(res, mssg, url);
  });
}

function postMssg(res, mssg, url) {
  let options = {
    method: 'POST',
    uri: url,
    json: {
      contentType: 'application/json',
      text: mssg
    }
  };

  request.post(options, (err, response) => {
    if (err || response.statusCode !== 200) {
      return res.status(500).json(errorPayload);
    }
  });
}

function startJob(res, url, time) {
  let newJob = schedule.scheduleJob(`${time} * * * * *`, function() {
    scrapeBook(res, url, postMssg);
  });
  jobs.push(newJob);
  // return res.status(200).json({text:'task scheduled.'})
}

module.exports = function (req, res, next) {
  let text = req.body.text;
  let webhookURL = req.body.response_url;
  // create a task
  if (text && /[1-9]|1[0-9]|2[0-3]/.test(text) && job === false) {
    startJob(res, webhookURL, text)
    console.log(jobs)

  // cancel task
  } else if(text && text === 'quit') {
    job = false;
    newJob.cancel();
    return res.status(200).json({text:'task cancelled.'})

  // help
  } else if (text && text === 'help') {
    return res.status(200).json(helpPayload);

  // private response, in case you don't want to disturb your team.
  } else if (text && text === 'private') {
    postMssg(res, 'i\'m private');
    return res.status(200).json('got it')

  // default
  } else {
    postMssg(res, 'i\'m public');
    // return res.status(200).json('got it')
  }
}
