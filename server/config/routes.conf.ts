"use strict";

const bodyParser = require('body-parser');
import express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const cors = require('cors');

module.exports = class RouteConfig {
  static init(application: any) {

    application.use(express.static(process.cwd() + '/dist'));
    application.use(bodyParser.urlencoded({ extended: true }));
    application.use(bodyParser.json());

    application.use(cookieParser());

    application.use(session({
      secret: 'onlineinterview',
      resave: true,
      saveUninitialized: true
    }));

    application.use(cors({
      credentials: true,
      origin: true
    }));

  }
}