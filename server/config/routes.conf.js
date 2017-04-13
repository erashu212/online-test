"use strict";

const bodyParser = require('body-parser');
const contentLength = require('express-content-length-validator');
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const cors = require('cors');

module.exports = class RouteConfig {
  static init(application) {

    application.use(bodyParser.urlencoded({ extended: true }));
    application.use(bodyParser.json());

    application.use(cookieParser());

    application.use(session({
      secret: 'fifipetshopapi',
      resave: true,
      saveUninitialized: true
    }));

    application.use(cors({
      credentials: true,
      origin: true
    }));

    application.use(morgan('dev'));
    application.use(contentLength.validateMax({ max: 999 }));
  }
}