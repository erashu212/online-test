"use strict";

const sqlite3 = require('sqlite3').verbose();
const dbConst = require('../constants/db.json');

module.exports = class DBConfig {
  static init() {
    const FILE_NAME = (process.env.NODE_ENV === 'production') 
                      ? dbConst.prod
                      : dbConst.dev;


    const db = new sqlite3.Database(FILE_NAME);
    db.on('error', console.error.bind(console, 'An error ocurred with the DB connection: '));
  }
};
