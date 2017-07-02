'use strict'

// functions that handle non-bot related stuff
module.exports = {
  formatTime: function(mTime) {
    mTime = parseInt(mTime);
    if (mTime === 0) {
      return 12 + 'am'
    } else if (mTime === 12) {
      return 12 + 'pm'
    } else if (mTime > 12) {
      return mTime - 12 + 'pm'
    }
    return mTime + 'am'
  }

}
