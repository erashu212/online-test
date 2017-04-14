"use strict";

const Promise = require('bluebird');
const DBConfig = require('../../config/db.conf');

module.exports = class QuestionDAO {

  static get(setId) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT test_master.set_id,
                  question_master.question_id,
                  question_master.question,
                  question_master.time_limit
                FROM test_master 
                INNER JOIN test_question ON  test_master.id = test_question.test_id
                INNER JOIN question_master ON test_question.question_id = question_master.question_id
                WHERE test_master.set_id = '${setId}'`;
                
      DBConfig.getDBInstance().all(sql, (err, rows) => {
        err ? reject(err)
          : resolve(rows);
      })
    })
  }
}