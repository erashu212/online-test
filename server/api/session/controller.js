"use strict";

const Promise = require('bluebird');
const _ = require('lodash');
const SessionDAO = require('./dao');

module.exports = class SessionController {

  static getCurrentStatus(setId) {
    return new Promise((resolve, reject) => {
      SessionDAO.get(setId).then(res => {
        if(!_.isEmpty(res)) {
          res = _.isArray(res) ? res[0] : res;
          resolve({
            questionId: res.question_id,
            setId: res.set_id,
            question: res.question,
            timeRemaining: res.time_remaining,
            timeAllotted: res.time_limit
          })
        }
      })
    })
  }

  static save(setId, session) {
    return SessionDAO.save(setId, session);
  }

  static remove(setId) {
    return SessionDAO.remove(setId);
  }
}