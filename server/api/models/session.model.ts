'use strict';

module.exports = class Session {
  private problems: any;
  private answers: any;
  private problemStartedTime?: Date;
  private problemIndex: number;
  private isTestFinished?: boolean;
  private creatorUid: string;
  private updateTimeout?: number;
  private socket: SocketIO.Socket | undefined;

  constructor(problems: any, uid: string) {
    this.problems = problems;
    // this.answers = [[], [], [], ... []] where the length is the length of
    // problems.
    this.answers = [...Array(problems.length)].map(() => []);
    this.problemStartedTime = undefined;
    this.problemIndex = -1;
    this.isTestFinished = undefined;
    this.creatorUid = uid;
    this.updateTimeout = undefined;
    this.socket = undefined;
    Object.seal(this);
  }

  start() {
    this.problemStartedTime = new Date();
    this.isTestFinished = false;
    this.next();
  }

  // Set client socket to notify updates.
  // If a client is already connected, reject and returns false.
  clientConnected(socket: SocketIO.Socket) {
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
  private updateClient() {
    if (this.socket) {
      if (this.isTestFinished) {
        this.socket.emit('setTestFinished');
      }
      else {
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
    }
    else {
      this.problemStartedTime = new Date();
    }

    this.updateClient();
    this._update();
  }

  answerTextUpdate(diff: string) {
    this.answers[this.problemIndex].push([new Date(), diff]);
  }

  getProblem() {
    return this.problems[this.problemIndex];
  }

  getRemainingTimeMs() {
    if (!this.problemStartedTime) {
      return undefined;
    }
    const currentTime = new Date();
    const problemTimeLimitMs = this.getProblem().time_limit * 1000;
    const elapsedTimeMs = currentTime.getTime() - this.problemStartedTime.getTime();
    return problemTimeLimitMs - elapsedTimeMs;
  }

  private _update() {
    if (!this.problemStartedTime) {
      return;
    }

    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
      this.updateTimeout = undefined;
    }

    if (this.isTestFinished) {
      return;
    }

    if (<number>this.getRemainingTimeMs() <= 0) {
      this.next();
    }

    // TODO: this.getRemainingTimeMs() can be negative, and if so, the below is not correct.
    const self = this;
    this.updateTimeout = setTimeout(() => {
      self._update();
    }, this.getRemainingTimeMs());
  }
}