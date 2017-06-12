'use strict'

const request = require('request');
const cheerio = require('cheerio');
const nodeSchedule = require('node-schedule');
const packt = 'https://www.packtpub.com/packt/offers/free-learning/';
const apiURL = 'https://381b9b0b.ngrok.io/api'; 

// store
function Store() {
  return {
    getAllReminders: (cb) => {
      request.get(`${apiURL}/reminders`, (err, response, body) => {
        if (err) { console.error(err); }
        const _body = JSON.parse(response.body);     
        cb(_body);
      });
    },
    createNewReminder: (reminder, cb) => {
      const options = {
        method: 'POST',
        url: `${apiURL}/reminders`,
        form:{ reminder: reminder }
      };
      request(options, (err) => {
        if (err) { console.error(err) }
        console.log('Reminder saved');
        cb();
      });
    },
    deleteReminder: (reminderId, cb) => {
      request.delete(`${apiURL}/reminders:${reminderId}`, (err) => {
        if (err) { console.error(err) }
        console.log('Reminder deleted');
      });
    },

  }
}

function Scheduler() {
  return {
    db: Store(),
    jobs: [],
    initJobs: function() {
      this.db.getAllReminders(results => {
        const rems = results.reminders;
        this.createJobs(rems, false, _ => { console.log(this.jobs) });
      });
    },
    createJobs: function(reminders, newReminder, cb) {
      this.scheduleJobs(reminders) 
      if (cb) {
        cb()
      }
    },
    scheduleJobs: function(reminders) {
      reminders.forEach(reminder => {
        let newJob = nodeSchedule.scheduleJob(`0 ${reminder.time} * * *`, function() {
          console.log('Job scheduled');   
        });
        reminder.is_scheduled = true;
        newJob.teamID = reminder.teamID;
        newJob.id = reminder._id;
        this.jobs.push(newJob);
      });
    },
    createNewReminder: function(reminder) {
      this.db.createNewReminder(reminder, _ => {});
    },

  }
}

const s = Scheduler();

s.initJobs();


// plan:
// -----
// change schedulejobs to singular and put the loop in the createJobs functions
// looking for a way to add a new job dynamically during app runtime














//// storage factory
//function Storage() {
//  return {
//    jobs: [],
//    getAllJobs: function(cb) {
//      const self = this;
//      request.get(`${apiURL}/reminders`, function(err, response, body) {
//        if (err) {
//          console.log(err)
//        }
//        const res_body = JSON.parse(response.body)
//        cb(res_body.reminders)
//      });
//    },
//    init: function(cb) {
//      this.getAllJobs((reminders) => {
//        reminders.forEach((reminder) => {
//          this.createJob(reminder);
//	  console.log(reminder);
//          cb();
//        });
//      });
//    },
//    createJob:function(reminder) {
//      let newJob = nodeSchedule.scheduleJob(`0 ${reminder.time} * * *`, function() {
//        // scrapeBook({url: reminder.url, type: 'in_channel'}, postMssg);
//     	console.log('hello nurse');
//      });
//      newJob.id = reminder._id;
//      newJob.teamID = reminder.teamID;
//      this.jobs.push(newJob)
//      console.log('job successfully created')
//    },
//    deleteJob(teamID) {
//      this.jobs.forEach((job, i) => {
//        if (job.teamID === teamID) {
//          job.cancel()
//          this.jobs.splice(i, 1);
//          request.delete(`${apiURL}/reminders/${job.id}`, function() {
//            console.log('job deleted')
//          });
//        }
//        console.log('Matching job not found')
//      });
//    }
//  }
//}
//
//function scrapeBook(cbOptions, cb) {
//  request(packt, function (err, response, body) {
//    if (err) {
//      return 'Something went wrong...'
//    }
//    const $ = cheerio.load(body);
//    const freeBook = $('.dotd-title h2').text().trim();
//    let mssg = `Today's free book is '${freeBook}'. \n:point_right: ${packt}`;
//
//    cbOptions.mssg = mssg;
//    cb(cbOptions)
//  });
//}
//
//function postMssg({url, type, mssg}) {
//  let options = {
//    method: 'POST',
//    uri: url,
//    json: {
//      response_type: type || 'ephemeral',
//      contentType: 'application/json',
//      text: mssg
//    }
//  };
//  console.log(options)
//  request.post(options, function(err, response) {
//    if (err) {
//      console.error(err)
//    }
//  });
//}
//
//const s = new Storage();
//s.init(_=>{console.log(s.jobs)});
//
//setTimeout(()=>{s.createJob({url: 'fakeURL', teamID: 'fakeTeamID', time: 10})}, 1500);
//setTimeout(()=>{console.log(s.jobs)}, 3000)
//





// class Scheduler {
//   constructor() {
//     this.queue = [];
//     this.scheduledReminders = [];
//   }

//   createReminder({url, teamID, time}) {
//     this.queueReminder({
//       url: url,
//       teamID: teamID,
//       time: time
//     });
//   }

//   queueReminder(reminder) {
//     this.queue.push(reminder);
//   }

//   schedule(reminder) {
//     let newJob = nodeSchedule.scheduleJob(`0 ${reminder.time} * * *`, function() {
//       scrapeBook({url: reminder.url, type: 'in_channel'}, postMssg);
//     });

//     newJob.teamID = reminder.teamID;
//     newJob.is_scheduled = true;
//     this.scheduledReminders.push(newJob);
//     this.queue.pop()
//   }

//   scheduleAll() {
//     this.queue.forEach(reminder => {
//       this.schedule(reminder);
//     });
//   }
// }



// let s = new Scheduler();
// let data = [{url: 'fakey', teamID: 'abcdefg', time: 12},
// {url: 'something else', teamID: 'tyuiop', time: 10},
// {url: 'fake url', teamID: '12345', time: 18}];

// data.forEach(i => {
//   s.queue.push(i);
// })

// s.scheduleAll()

// console.log(s.queue, s.scheduledReminders)

// const helpPayload = {
//   response_type: 'ephemeral',
//   text: `The goal of this bot is to collect and share the link to and title of the Packtpub.com` +
//   ` free learning offer of the day.\nSimply type \`/freebook\` to share in channel or \`/freebook private\` to view privately!
// You can also schedule a daily reminder by typing \`/freebook x\` where x is a number 1-24, representing the hour of day to post Packt's free book of the day.`
// };

// let queue = []; // were queued info goes
// // need to build a function to take items from the queue and schedule jobs using their info
// let jobs = []; // where job objects go

// // simplify scrape and post
// function scrapeBook(res, url, type='ephemeral', cb) {
//   request(packt, function (err, response, body) {
//     if (err) {
//       return 'Something went wrong...'
//     }
//     const $ = cheerio.load(body);
//     const freeBook = $('.dotd-title h2').text().trim();
//     let mssg = `Today's free book is '${freeBook}'. \n:point_right: ${packt}`;

//     cb(res, {mssg: mssg, url: url, type: type});
//   });
// }

// function postMssg(res, {url, type, mssg}) {
//   let options = {
//     method: 'POST',
//     uri: url,
//     json: {
//       response_type: type || 'ephemeral',
//       contentType: 'application/json',
//       text: mssg
//     }
//   };

//   request.post(options, function(err, response) {
//     if (err || response.statusCode !== 200) {
//       console.log(err)
//     }
//   });
// }

// // move helpers to external file
// function formatTime(mTime) {
//   if (mTime === 0) {
//      return 12 + ' am'

//   } else if (mTime >= 12) {
//     if (mTime === 12) {
//       return 12 + ' pm'
//     }
//     return mTime - 12 + ' pm'
//   }
//   return mTime + ' am'
// }

// function checkReminder(teamID) {
//   return jobs.some(function(job) {
//     return (job.teamID === teamID)
//   });
// }

// // possibly implement a function to ccreate jobs and another
// // to cylce thru existing jobs and create them if they have not yet been created.
// function setReminder(res, url, teamID, time) {
//   if (checkReminder(teamID)) {
//     return res.status(200).json({text:'I currently support only one reminder per team.' +
//     ' Use `/freebook` to share the current free book now or `/freebook cancel` to delete current reminder.'})
//   }
//   let newJob = schedule.scheduleJob(`0 ${time} * * *`, function() {
//     scrapeBook(res, url, 'in_channel', postMssg);
//   });
//   newJob.teamID = teamID;
//   jobs.push(newJob);
//   return res.status(200).json({text:`Daily reminder scheduled for ${formatTime(parseInt(time))}.`})
// }

// module.exports = function (req, res, next) {
//   let text = req.body.text.toLowerCase();
//   let webhookURL = req.body.response_url;
//   let teamID = req.body.team_id;

//   // create a reminder
//   if (text && /^((?:[0-9]|1[0-9]|2[0-3]))$/.test(text)) {
//     setReminder(res, webhookURL, teamID, text)

//   // cancel reminder
//   } else if(text && text === 'cancel') {

//     // need a delete job function
//     let found = jobs.some(function (job, i) {
//       if (job.teamID === teamID) {
//         job.cancel();
//         jobs.splice(i, 1);

//         return res.status(200).json({text:'Daily reminder canceled.'})
//       }
//     });

//     if (!found) {
//       return res.status(200).json({text:'To schedule a daily reminder type `/freebook x` where x is a number 1-24,' +
//         ' representing the hour of day to post Packt\'s free book of the day.'})
//     }

//   // help
//   } else if (text && text === 'help') {
//     return res.status(200).json(helpPayload)

//   // private response, in case you don't want to disturb your team.
//   } else if (text && text === 'private') {
//     scrapeBook(res, webhookURL, 'ephemeral', postMssg);
//     return res.status(200).json()

//   // default
//   } else if (!text){
//     scrapeBook(res, webhookURL, 'in_channel', postMssg);
//     return res.status(200).json()

//   // invalid command
//   } else {
//     return res.status(200).json({text: 'valid commands: `/freebook`, `/freebook private`, `/freebook 1-23`, ' +
//       '`/freebook cancel` or `/freebook help`'})
//   }
// }
