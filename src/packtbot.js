'use strict'

const request = require('request');
const cheerio = require('cheerio');
const schedule = require('node-schedule');
const packt = 'https://www.packtpub.com/packt/offers/free-learning/';

const helpPayload = {
  response_type: 'ephemeral',
  text: `The goal of this bot is to collect and share the link to and title of the Packtpub.com` +
  ` free learning offer of the day.\nSimply type \`/freebook\` to share in channel or \`/freebook private\` to view privately!
You can also schedule a daily reminder by typing \`/freebook x\` where x is a number 1-24, representing the hour of day to post Packt's free book of the day.`
};

let jobs = [];

// simplify scrape and post
function scrapeBook(res, url, type='ephemeral', cb) {
  request(packt, function (err, response, body) {
    if (err) {
      return 'Something went wrong...'
    }
    const $ = cheerio.load(body);
    const freeBook = $('.dotd-title h2').text().trim();
    let mssg = `Today's free book is '${freeBook}'. \n:point_right: ${packt}`;

    cb(res, {mssg: mssg, url: url, type: type});
  });
}

function postMssg(res, {url, type, mssg}) {
  let options = {
    method: 'POST',
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
  });
}

// move helpers to external file
function formatTime(mTime) {
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

function checkReminder(teamID) {
  return jobs.some(function(job) {
    return (job.teamID === teamID)
  });
}

// possibly implement a function to ccreate jobs and another
// to cylce thru existing jobs and create them if they have not yet been created.
function setReminder(res, url, teamID, time) {
  if (checkReminder(teamID)) {
    return res.status(200).json({text:'I currently support only one reminder per team.' +
    ' Use `/freebook` to share the current free book now or `/freebook cancel` to delete current reminder.'})
  }
  let newJob = schedule.scheduleJob(`0 ${time} * * *`, function() {
    scrapeBook(res, url, 'in_channel', postMssg);
  });
  newJob.teamID = teamID;
  jobs.push(newJob);
  return res.status(200).json({text:`Daily reminder scheduled for ${formatTime(parseInt(time))}.`})
}

module.exports = function (req, res, next) {
  let text = req.body.text.toLowerCase();
  let webhookURL = req.body.response_url;
  let teamID = req.body.team_id;

  // create a reminder
  if (text && /^((?:[0-9]|1[0-9]|2[0-3]))$/.test(text)) {
    setReminder(res, webhookURL, teamID, text)

  // cancel reminder
  } else if(text && text === 'cancel') {

    // need a delete job function
    let found = jobs.some(function (job, i) {
      if (job.teamID === teamID) {
        job.cancel();
        jobs.splice(i, 1);

        return res.status(200).json({text:'Daily reminder canceled.'})
      }
    });

    if (!found) {
      return res.status(200).json({text:'To schedule a daily reminder type `/freebook x` where x is a number 1-24,' +
        ' representing the hour of day to post Packt\'s free book of the day.'})
    }

  // help
  } else if (text && text === 'help') {
    return res.status(200).json(helpPayload)

  // private response, in case you don't want to disturb your team.
  } else if (text && text === 'private') {
    scrapeBook(res, webhookURL, 'ephemeral', postMssg);
    return res.status(200).json()

  // default
  } else if (!text){
    scrapeBook(res, webhookURL, 'in_channel', postMssg);
    return res.status(200).json()

  // invalid command
  } else {
    return res.status(200).json({text: 'valid commands: `/freebook`, `/freebook private`, `/freebook 1-23`, ' +
      '`/freebook cancel` or `/freebook help`'})
  }
}
