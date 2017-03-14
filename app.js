#!/usr/bin/env node
let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

io.on('connection', (socket) => {
  console.log('user connected');
  io.emit('problem', 'Write a function that computes fibonacci number.');
});

http.listen(5000, () => {
  console.log('started on port 5000');
});