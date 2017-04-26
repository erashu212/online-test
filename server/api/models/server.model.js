'use strict';

const Session = require('../models/session.model');
class ServerModel {
  constructor() {
    this.sessions = {};
    Object.seal(this);
  }

  newSession(test) {
    // TODO: use proper UID.
    let sessionId = new Date().getTime().toString();

    let session = new Session(test.problem);
    session.start();

    this.sessions[sessionId] = session;
    return sessionId;
  }

  getSession(sessionId) {
    return this.sessions[sessionId];
  }
}

// Singleton.
const serverModel = new ServerModel();
module.exports = serverModel;