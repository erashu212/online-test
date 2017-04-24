module.exports = class Session {
  constructor() {
    this.problems = [];
    this.problemStartedTime = null;
    this.problemIndex = null;
    this.isTestFinished = false;
    Object.seal(this);
  }
}