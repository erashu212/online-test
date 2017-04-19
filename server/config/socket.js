"use strict";

const TIMER_INTERVAL_MS = 1000;

class Problem {
  constructor() {
    this.question = null;
    this.timeLimitSec = null;
    Object.seal(this);
  }
}

class Session {
  constructor() {
    this.problems = [];
    this.problemStartedTime = null;
    this.problemIndex = null;
    this.isTestFinished = false;
    Object.seal(this);
  }
}

function getDummySession() {
  let session = new Session();

  let problem1 = new Problem();
  problem1.question = "What's your **favorite** color?";
  problem1.timeLimitSec = 10;
  let problem2 = new Problem();
  problem2.question = 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it is able to trap after raining.\
<img src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnsAAADyAQMAAAAP2pHtAAAAA3NCSVQICAjb4U/gAAAABlBMVEX///8AAABVwtN+AAAACXBIWXMAABYlAAAWJQFJUiTwAAAA70lEQVR4nO3bwQ3CIBiGYRCiRwfw0FHKZjKaozBCN0BTTerBNCF+JD/6vte2T+hPLxzqHBH9Sl4NBjmYxeBJDt7E4FkOFjE4qcF5MQ8WMaj/DgEBAQEBAQEBAQEBAQEBhweTeTCbB1s2xde1/ZtaZhie4P4D9sGWGQICAgICAgICAgICAg4J2j+ajXnWm2pjpSN4UINHNRjNzxAQEBAQEBAQEBAQ8N/AoAa9+VfuB17ersytYF3c9qPLC2xHPqobeBWBPotXKAf7zRAQEBAQEBAQEBAQENAIGJP1FT7A76XOYNCCMTltcjCIPSIiWrsDYz85NQG0QW8AAAAASUVORK5CYII=">';
  problem2.timeLimitSec = 15;

  session.problems = [problem1, problem2];
  session.problemStartedTime = new Date();
  session.problemIndex = 0;

  return session;
}

class SessionManager {
  constructor(session, socket) {
    this.session = session;
    this.socket = socket;
    this.timeout = null;
    // TODO: A better way to do is that, getting client status on connection
    //       and update only the difference.
    this.isQuestionUpdateNeeded = true;
    this.clientNextButtonClicked = false;
    Object.seal(this);

    this.scheduleUpdate();
  }

  next() {
    this.clientNextButtonClicked = true;
    this.scheduleUpdate();
  }

  disconnected() {
    clearTimeout(this.timeout);
  }

  // TODO better function naming.
  scheduleUpdate() {
    clearTimeout(this.timeout);
    let nextUpdateMs = this._updateSessionState();
    if (nextUpdateMs != null) {
      let self = this;
      nextUpdateMs = Math.min(nextUpdateMs, TIMER_INTERVAL_MS);
      this.timeout = setTimeout(() => {self.scheduleUpdate();}, nextUpdateMs);
    }
  }

  // Updates session problem state and notify to the client.
  // Returns the next expected update time in ms or null if no more update expected.
  _updateSessionState() {
    let session = this.session;
    if (session.isTestFinished) {
      return null;
    }

    const currentTime = new Date();
    if (this.clientNextButtonClicked ||
        currentTime - session.problemStartedTime >
            session.problems[session.problemIndex].timeLimitSec * 1000) {
      this.clientNextButtonClicked = false;
      session.problemIndex += 1;

      if (session.problemIndex == session.problems.length) {
        session.isTestFinished = true;
        this.socket.emit('setTestFinished');
        return null;
      }

      session.problemStartedTime = currentTime;
      this.isQuestionUpdateNeeded = true;
    }

    if (this.isQuestionUpdateNeeded) {
      this.socket.emit('setQuestion', session.problems[session.problemIndex].question);
      this.isQuestionUpdateNeeded = false;
    }

    let problemTimeLimitMs = session.problems[session.problemIndex].timeLimitSec * 1000;
    let elapsedTimeMs = currentTime - session.problemStartedTime;
    let remainingTimeMs = problemTimeLimitMs - elapsedTimeMs;
    this.socket.emit('setRemainingTime', remainingTimeMs);

    return remainingTimeMs;
  }
}

module.exports = {
  socket: (io) => {
    let sessions = {};
    io.on('connection', (socket) => {
      let sessionId = socket.handshake.query.id;

      if (sessionId in sessions) {
        // TODO: This is a temporary code to disallow multiple connections.
        return;
      } else {
        sessions[sessionId] = getDummySession();
      }

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
