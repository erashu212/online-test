"use strict";

const serverModel = require('../api/models/server.model');

module.exports = {
  socket: (io) => {

    io.on('connection', (socket) => {
      let { id: sessionId, user } = socket.handshake.query;

      if (user) {
        let sessions = serverModel.getSessions(user);

        socket.emit('setSessionList', sessions);
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
