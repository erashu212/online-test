"use strict";

const Problem = require('../api/models/problem.model');
const Session = require('../api/models/session.model');

const SessionManager = require('../api/controllers/session.controller');
const QuestionController = require('../api/controllers/question.controller');

let sessionCache;

function getSession(sessionId) {
  let session = new Session();

  let problemSet = QuestionController.get(sessionId);
  if(!problemSet) return null;

  delete problemSet.setId;

  session.problems =  problemSet.questions;
  session.problemStartedTime = new Date();
  session.problemIndex = 0;

  // TODO: should be replaced with db integration.
  sessionCache[sessionId] = session;
  return session;
}

module.exports = {
  socket: (io) => {
    let sessions = {};
    // TODO: This will be removed when DB is integrated.
    sessionCache = {};
    io.on('connection', (socket) => {
      let sessionId = socket.handshake.query.id;

      if (sessionId in sessions) {
        // TODO: This is a temporary code to disallow multiple connections.
        return;
      } else {
        sessions[sessionId] = sessionCache[sessionId] || getSession(sessionId);
      }

      // if no question, test has been finished or not set
      if(!sessions[sessionId]) {
        socket.emit('setInvalidTest');
        return;
      };

      let sessionManager = new SessionManager(sessions[sessionId], socket);

      socket.on('nextQuestion', () => {
        sessionManager.next();
      });

      socket.on('disconnect', () => {
        // TODO: only pause updating session.
        sessionManager.disconnected();
        delete sessions[sessionId];
      });
    });
    return io;
  }
}
