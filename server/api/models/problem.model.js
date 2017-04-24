module.exports = class Problem {
  constructor() {
    this.question = null;
    this.timeLimitSec = null;
    Object.seal(this);
  }
}