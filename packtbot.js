'use strict'

const request = require('request');
const cheerio = require('cheerio');
const packt = 'https://www.packtpub.com/packt/offers/free-learning/';
const errorPayload = {
  response_type: 'ephemeral',
  text: `Sorry, try again in a few seconds!`
};
const helpPayload = {
  response_type: 'ephemeral',
  text: `The goal of this bot is to collect and share the link to and title of the Packtpub.com free learning offer of the day.\nSimply type \`/freebook\` to share in channel or \`/freebook private\` to view privately!`
}

function scrapeAndPostBook(res, resType) {
  request(packt, function (error, response, body) {
    if (error) {
      return res.status(500).json(errorPayload);
    }

    const $ = cheerio.load(body);
    const freeBook = $('.dotd-title h2').text().trim();
    const botPayload = {
      response_type: resType,
      text: `Today's free book is '${freeBook}'. \n:point_right: ${packt}`
    };

    return res.status(200).json(botPayload);
  });
}

module.exports = function (req, res, next) {
  // help message for `/freebook help`
  if (req.body.text && req.body.text === 'help') {
    return res.status(200).json(helpPayload);
  // private response, in case you don't want to disturb your team.
  } else if (req.body.text && req.body.text === 'private') {
    scrapeAndPostBook(res, 'ephemeral');
  // default
  } else {
    scrapeAndPostBook(res, 'in_channel');
  }
}
