"use strict";

const serverModel = require('../api/models/server.model');

module.exports = {
  socket: (io) => {

    io.on('connection', (socket) => {
      let sessionId = socket.handshake.query.id;
      const session = serverModel.getSession(sessionId);

      if (!session) {
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
    });
    return io;
  }
}
