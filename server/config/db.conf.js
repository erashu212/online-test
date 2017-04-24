"use strict";

const sqlite3 = require('sqlite3').verbose();
const dbConst = require('../constants/db.json');

const FILE_NAME = "test.db";

module.exports = class DBConfig {
  static init() {
    let db = new sqlite3.Database(FILE_NAME);
    db.on('error', console.error.bind(console, 'An error ocurred with the DB connection: '));
  }

  static getDBInstance() {
    return new sqlite3.Database(FILE_NAME);
  }

  static close() {
    DBConfig.getDBInstance().close();
  }
};