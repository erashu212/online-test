"use strict";

const Promise = require('bluebird');
const DBConfig = require('../../config/db.conf');
const _ = require('lodash');

module.exports = class SessionDAO {

  static get(setId) {
    return new Promise((resolve, reject) => {
      let sql = "SELECT " +
        " session.question_id, "
        + "session.set_id, "
        + "session.time_remaining, "
        + "question_master.question, "
        + "question_master.time_limit "
        + "FROM session "
        + "INNER JOIN question_master ON session.question_id = question_master.question_id "
        + "WHERE session.set_id = '" + setId + "'";

      DBConfig.getDBInstance()
        .all(sql, (err, rows) => {
          err ? reject(err)
            : resolve(rows);
        })
    })
  }

  static save(setId, data) {
    return new Promise((resolve, reject) => {
      DBConfig.getDBInstance()
        .run(
        `INSERT INTO session(set_id, question_id, time_remaining, created_date) 
           VALUES ('${setId}', ${data.questionId}, ${data.timeRemaining}, '${new Date().toString()}')`,
        (err, res) => {
          err ? reject(err)
            : resolve(res);
        });
    })
  }

  static remove(setId) {
    return new Promise((resolve, reject) => {
      DBConfig.getDBInstance()
        .run("DELETE FROM  session WHERE set_id ='" + setId + "'",
        (err, res) => {
          err ? reject(err)
            : resolve(res);
        });
    })
  }
}