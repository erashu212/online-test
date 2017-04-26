'use strict';

module.exports = class AdminRoute {
  static init(app, router) {
    router
      .post('/api/admin/session', (req, res) => {
        let user = req.body.user;
        let status = 400;
        if (!!user) {
          req.session.user = user;
          status = 201;
        }
        return res.status(status).json({ data: user })
      })
      .delete('/api/admin/session', (req, res) => {
        delete req.session.user;
        let status = 400;
        if (!req.session.user) {
          status = 200;
        }
        return res.status(status).json({ data: '' })
      });
  }
}