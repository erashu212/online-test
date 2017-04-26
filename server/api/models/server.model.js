'use strict';

const crypto = require('crypto');
const Session = require('../models/session.model');

class ServerModel {
  constructor() {
    this.sessions = {};
    this.sessionIdCounter = 0;
    // TODO: Double check if the key size is 32 bytes.
    this.sessionIdGeneratorKey = crypto.randomBytes(32);
    Object.seal(this);
  }

  newSession(test) {
    let sessionId = this.getNewSessionId();

    // TODO: We need to validate `test` first.
    let session = new Session(test.problem);
    session.start();

    this.sessions[sessionId] = session;
    return sessionId;
  }

  getSession(sessionId) {
    return this.sessions[sessionId];
  }

  getNewSessionId() {
    const cipher = crypto.createCipher(
        'AES-256-CBC-HMAC-SHA256', this.sessionIdGeneratorKey);
    let sessionId =
        cipher.update(this.sessionIdCounter.toString(), 'utf8', 'hex');
    sessionId += cipher.final('hex');
    this.sessionIdCounter += 1;
    return sessionId;
  }

  isSessionIdValid(sessionId) {
    const decipher = crypto.createDecipher(
        'AES-256-CBC-HMAC-SHA256', this.sessionIdGeneratorKey);
    try {
      decipher.update(sessionId, 'hex', 'utf8');
      decipher.final('utf8');
      return true;
    }
    catch (error) {
      return false;
    }
  }
}

// Singleton.
const serverModel = new ServerModel();
module.exports = serverModel;
