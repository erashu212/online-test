"use strict";

const errorHandler = require('errorhandler');

module.exports = class ErrorHandler {
  static init(app) {
    app.use(errorHandler());
  }
}
