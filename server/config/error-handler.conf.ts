"use strict";

const errorHandler = require('errorhandler');

module.exports = class ErrorHandler {
  static init(app: any) {
    app.use(errorHandler());
  }
}
