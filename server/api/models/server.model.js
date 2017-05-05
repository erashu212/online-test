'use strict';

const crypto = require('crypto');
const _ = require('lodash');

const Session = require('../models/session.model');

class ServerModel {
  constructor() {
    this.sessions = {};
    this.sessionIdCounter = 0;
    // TODO: Double check if the key size is 32 bytes.
    this.sessionIdGeneratorKey = crypto.randomBytes(32);
    Object.seal(this);
  }

  newSession(test, uid) {
    // TODO: Validate `test` and `uid`.
    let session = new Session(test.problem, uid);
    session.start();

    let sessionId = this.getNewSessionId();
    this.sessions[sessionId] = session;
    return sessionId;
  }

  getSessions(uid) {
    // TODO: Validate `uid`.
    const sessions = _.reduce(this.sessions, (acc, val, key) => {
      if (val['creatorUid'] == uid) {
        acc[key] = {
          'id': key,
          'problems': val.problems,
          'answers': val.answers,
          'problemIndex': val.problemIndex,
          'problemStartedTime': val.problemStartedTime,
          'isTestFinished': val.isTestFinished
        }
      }
      return acc;
    }, {});

    return _.values(sessions);
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
