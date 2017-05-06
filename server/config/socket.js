"use strict";

const serverModel = require('../api/models/server.model');
const firebaseAuth = require('../firebase.auth');

module.exports = {
  socket: (io) => {

    io.on('connection', (socket) => {
      const query = socket.handshake.query;

      switch (query.client_type) {
        case 'test_taker':
          initTestTakerSetup(socket, query.id);
          break;
        case 'admin':
          initAdminSetup(socket);
          break;
        default:
          // TODO: Error handling.  Maybe send error msg and disconnect?
          console.error('Invalid client_type for SocketJS connection:', client_type);
      }
    });
    return io;
  }
}

function initTestTakerSetup(socket, sessionId) {
  const session = serverModel.getSession(sessionId);

  if (!session) {
    // TODO: We can figure out if the session id is valid.
    //       Make use of this.
    // if (serverModel.isSessionIdValid(sessionId)) {
    //   console.log("session id valid");
    // } else {
    //   console.log("session id invalid");
    // }
    socket.emit('setInvalidTest');
    return;
  };

  // Multiple connection is disallowed.
  if (!session.clientConnected(socket)) {
    // TODO: Show multiple connection error message.
    return;
  }

  socket.on('nextQuestion', () => {
    session.next();
  });

  socket.on('answerTextUpdate', (diff) => {
    session.answerTextUpdate(diff);
  })

  socket.on('disconnect', () => {
    session.clientDisconnected();
  });
}

function initAdminSetup(socket) {
  // TODO: Check if token is expired.
  let uid = null;

  socket.on('updateToken', (token) => {
    firebaseAuth.verifyIdToken(token)
      .then((decodedToken) => {
        uid = decodedToken.uid;
      }).catch((error) => {
        uid = null;
        // TODO: error handling.  Maybe send an error msg or request a new token?
        console.error(token, error);
      });
  });

  socket.on('getSessionList', (callbackFn) => {
    if (!uid) {
      // TODO: error handling.
      return;
    }
    callbackFn(serverModel.getSessions(uid));
  });

  socket.on('createSession', (testJson, callbackFn) => {
    if (!uid) {
      // TODO: error handling.
      return;
    }
    const sessionId = serverModel.newSession(testJson, uid);
    callbackFn(sessionId);
  });
}