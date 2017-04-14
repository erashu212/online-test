"use strict";

const Promise = require('bluebird');
const QuestionDAO = require('./dao');
const CacheManager = require('../../common/cache/cache');
const socketEmitter = require('../../config/socket').emitter;
const _ = require('lodash');

module.exports = class QuestionController {
  static get(setId) {

    return new Promise((resolve, reject) => {

      QuestionDAO.get(setId).then(res => {
        if (!_.isEmpty(res)) {

          let questions = _.map(res, (p) => {
            return {
              questionId: p.question_id,
              question: p.question,
              timeAllotted: p.time_limit,
              timeRemaining: p.time_limit
            }
          });

          CacheManager.save(setId, questions);

          resolve({
            setId: setId,
            total: questions.length,
            problems: questions
          })
        }
      })
    });
  }
}