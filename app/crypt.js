'use strict'

const crypto = require('crypto');

class Crypt {
  constructor() {
    this.algorithm = process.env.CRYPT_ALGORITHM;
    this.password = process.env.CRYPT_PASSWORD;
  }

  encrypt(text){
    const cipher = crypto.createCipher(this.algorithm, this.password);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
  }

  decrypt(text){
    const decipher = crypto.createDecipher(this.algorithm, this.password);
    let dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  }

}

module.exports = Crypt;
