const TIMER_REFRESH_INTERVAL_SEC = 10;

module.exports = class SessionManager {
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
      nextUpdateMs = Math.min(nextUpdateMs, TIMER_REFRESH_INTERVAL_SEC * 1000);
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