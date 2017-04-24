const QuestionController = require('../controllers/question.controller');

module.exports = class QuestionRoute {
  static init(app, router) {
    router
      .get('/api/admin/question', (req, res, next) => {
        let setId = req.body;
        let status = !!question ? 200 : 400;
        return res.status(status).json({ data: question })
      })
      .post('/api/admin/question', (req, res, next) => {
        let uid;
        let questions = req.body;
        let status = 400;

        if (!!questions) {
          status = 201;

          uid = QuestionController.save(questions);
        }
        return res.status(status).json({ data: uid })
      })
  }
}