'use strict'

const request = require('request');
const cheerio = require('cheerio');
const packt = 'https://www.packtpub.com/packt/offers/free-learning/';

module.exports = function (req, res, next) {

  request(packt, function (error, response, body) {
    if (error) {
      const botPayload = {
        response_type: 'ephemeral',
        text: `Sorry, try again in a few seconds!`
      };

      return res.status(500).json(botPayload);
    }

    const $ = cheerio.load(body);
    const freeBook = $('.dotd-title h2').text().trim();
    const botPayload = {
      response_type: 'in_channel',
      text: `Today's free book is '${freeBook}'. \n:point_right: ${packt}`
    };

    return res.status(200).json(botPayload);
  });
}
