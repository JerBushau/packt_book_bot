'use strict'

const request = require("request");
const cheerio = require("cheerio");
const packt = "https://www.packtpub.com/packt/offers/free-learning/";

module.exports = function (req, res, next) {

  request(packt, (error, response, body) => {
    if (error) {
      return console.error(`error:  ${error}`);
    }

    const $ = cheerio.load(body);
    const freeBook = $('.dotd-title h2').text().trim();
    const botPayload = {
      text : `Today's free book is "${freeBook}".`
    };

    return res.status(200).json(botPayload);
  });
}
