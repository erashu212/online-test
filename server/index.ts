
'use strict';

const PORT = process.env.PORT || 4200;

const os = require('os');
const http = require('http');
const express = require('express');

const app = express();

import * as socketIo from "socket.io";


const RoutesConfig = require('./config/routes.conf');
const DBConfig = require('./config/db.conf');
const ErrorHandler = require('./config/error-handler.conf');
const Routes = require('./routes/index');

let server = http.createServer(app)
  .listen(PORT, () => {
    console.log('up and running @: ' + os.hostname() + ' on port: ' + PORT);
    console.log(`enviroment: ${process.env.NODE_ENV || 'Dev'}`);
  });

const ios = socketIo.listen(server);

require('./config/socket').socket(ios);

RoutesConfig.init(app);
DBConfig.init();
ErrorHandler.init(app);

Routes.init(app, express.Router());

process.on('uncaughtException', function (err: any) {
  // handle the error safely
  DBConfig.close();
  console.log(err)
})