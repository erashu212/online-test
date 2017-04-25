const serverModel = require('../models/server.model');

module.exports = class QuestionRoute {
  static init(app, router) {
    router
      .get('/api/admin/question', (req, res, next) => {
        let setId = req.body;
        let status = question ? 200 : 400;
        return res.status(status).json({ data: question })
      })
      .post('/api/admin/question', (req, res, next) => {
        let sessionId;
        let test = req.body;
        let status = 400;

        if (test) {
          status = 201;
          sessionId = serverModel.newSession(test);
        }
        return res.status(status).json({ 'sessionId': sessionId })
      })
  }
}