const EventEmitter = require('events').EventEmitter;
const socketEmitter = new EventEmitter();

const QuestionController = require('../api/question/controller');
const SessionController = require('../api/session/controller');
const CacheManager = require('../common/cache/cache');

const _ = require('lodash');

let questionForUser;

const TIMER_INTERVAL = 1;

module.exports = {
  emitter: socketEmitter,
  socket: (io) => {
    let users = [],
      users_connected = [],
      questionForUser = null,
      uid = null;

    io.on('connection', (client) => {
      let sId = client.handshake.query.id;
      // client.on('register', (sId) => {

      if (users_connected.indexOf(sId) < 0) {
        users_connected.push(sId);
      }

      // check for new user
      if (users.indexOf(sId) < 0) {
        users.push(sId);
        emitFreshQuestionToUser(io, QuestionController.get(sId));
      } else {
        emitCurrentQuestionToUser(io, SessionController.getCurrentStatus(sId));
      }

      uid = sId;
      // });

      // get next question
      client.on('nextQuestion', (sId) => {
        getNextQuestion(io, sId);
      })

      client.on('disconnect', () => {
        users_connected.splice(users_connected.indexOf(uid), 1);

        setTimeout(() => {
          if(users_connected.indexOf(uid) < 0) {
            users.splice(users.indexOf(uid), 1);

            // removes user history
            SessionController.remove(uid);
            questionForUser = null;
          }
        }, 5000)
      })

    });

    return io;
  }
}

function emitFreshQuestionToUser(io, promise) {
  promise.then(res => {
    let index = getRandomQuestionIndex(res.total);

    let question = questionForUser = res.problems[index];

    startTimer(io, res.setId, questionForUser);
    io.sockets.emit('getQuestion', questionForUser);

    return SessionController.save(res.setId, question);
  })
}

function emitCurrentQuestionToUser(io, promise) {
  promise.then(res => {

    if (!!res) {
      let sid = res.setId;
      delete res.setId;

      let question = questionForUser = res;

      io.sockets.emit('getQuestion', questionForUser);

      startTimer(io, sid, questionForUser);
    }
  })
}

function getNextQuestion(io, sId) {
  QuestionController.get(sId).then(res => {
    let filteredQuestion = res.problems.filter(q => q.questionId != questionForUser.questionId);

    let index = getRandomQuestionIndex(filteredQuestion.length);

    let question = questionForUser = filteredQuestion[index];

    io.sockets.emit('getQuestion', questionForUser);

    startTimer(io, sId, question);

    return SessionController.save(res.sId, question);

  })
}

function startTimer(io, setId, question, offset = TIMER_INTERVAL) {
  let interval = setInterval(() => {
    //first remove entry
    SessionController.remove(setId);

    question = Object.assign({}, question, {
      timeRemaining: question.timeRemaining - offset
    });

    // temp code
    if (question.timeRemaining == 0) {
      clearInterval(interval);
    }

    SessionController.save(setId, question);

    io.sockets.emit('getQuestionTimer', question.timeRemaining)

  }, TIMER_INTERVAL * 1000);
}

function getRandomQuestionIndex(max, min = 0) {
  let index = Math.floor(Math.random() * (max - min + 1) + min);
  return index > 0 ? index - 1 : 0;
}
