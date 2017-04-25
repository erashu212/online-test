module.exports = class Session {
  constructor(problems) {
    this.problems = problems;
    this.problemStartedTime = undefined;
    this.problemIndex = undefined;
    this.isTestFinished = undefined;
    this.updateTimeout = undefined;
    this.socket = undefined;
    Object.seal(this);
  }

  start() {
    this.problemStartedTime = new Date();
    this.problemIndex = -1;
    this.isTestFinished = false;
    this.next();
  }

  // Set client socket to notify updates.
  // If a client is already connected, reject and returns false.
  clientConnected(socket) {
    if (this.socket) {
      return false;
    }

    this.socket = socket;
    this.updateClient();
    return true;
  }

  clientDisconnected() {
    this.socket = undefined;
  }

  // Send the session state to client.
  updateClient() {
    if (this.socket) {
      if (this.isTestFinished) {
        this.socket.emit('setTestFinished');
      } else {
        this.socket.emit('setQuestion', this.getProblem().question);
        this.socket.emit('setRemainingTime', this.getRemainingTimeMs());
      }
    }
  }

  next() {
    this.problemIndex += 1;
    if (this.problemIndex == this.problems.length) {
      this.isTestFinished = true;
      this.problemStartedTime = undefined;
    } else {
      this.problemStartedTime = new Date();
    }

    this.updateClient();
    this._update();
  }

  getProblem() {
    return this.problems[this.problemIndex];
  }

  getRemainingTimeMs() {
    const currentTime = new Date();
    const problemTimeLimitMs = this.getProblem().time_limit * 1000;
    const elapsedTimeMs = currentTime - this.problemStartedTime;
    return problemTimeLimitMs - elapsedTimeMs;
  }

  _update() {
    clearTimeout(this.updateTimeout);

    if (this.isTestFinished) {
      return;
    }

    if (this.getRemainingTimeMs() <= 0) {
      this.next();
    }

    // TODO: this.getRemainingTimeMs() can be negative, and if so, the below is not correct.
    const self = this;
    this.updateTimeout = setTimeout(() => {self._update();}, this.getRemainingTimeMs());
  }
}