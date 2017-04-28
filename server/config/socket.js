"use strict";

const serverModel = require('../api/models/server.model');

module.exports = {
  socket: (io) => {

    io.on('connection', (socket) => {
      let sessionId = socket.handshake.query.id;
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

      socket.on('disconnect', () => {
        session.clientDisconnected();
      });

      socket.on('answerTextUpdate', (diff) => {
        session.answerTextUpdate(diff);
      })
    });
    return io;
  }
}
