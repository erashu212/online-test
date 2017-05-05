"use strict";

const serverModel = require('../api/models/server.model');
const firebaseAuth = require('../firebase.auth');

module.exports = {
  socket: (io) => {

    io.on('connection', (socket) => {
      let { id: sessionId, token } = socket.handshake.query;

      if (token) {
        firebaseAuth.verifyIdToken(token)
          .then((decodedToken) => {
            const sessions = serverModel.getSessions(decodedToken.uid);
            // TODO: Change from push to pull API, i.e., `getSessionList`.
            socket.emit('setSessionList', sessions);
          }).catch((error) => {
            console.log(error);
            // TODO: Handle error
          });
      }
      else if (sessionId) {
        initTestTakerSetup(socket, sessionId);
      }
      else {
        return;
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
