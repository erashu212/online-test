const EventEmitter = require('events').EventEmitter;
const socketEmitter = new EventEmitter();

module.exports = {
  emitter: socketEmitter,
  socket: (io) => {
    io.on('connection', (client) => {
      console.log('Connected client', client);
    })

    return io;
  }
}