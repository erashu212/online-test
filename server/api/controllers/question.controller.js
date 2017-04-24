var problems = {};

module.exports = class QuestionController {

  static save(value) {
    let key = new Date().getTime();

    if(!!value) {

      value = value.map(v => ({
        question: v.question,
        timeLimitSec: v.time_limit
      }));
    }

    let problem = Object.assign({}, {
      setId: key
    }, {
      questions: value
    });
    
    problems[key] = problem;

    return key;
  }

  static get(key) {
    return problems[key];
  }
}