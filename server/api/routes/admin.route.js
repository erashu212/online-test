module.exports = class AdminRoute {
  static init(app, router) {
    router
      .post('/api/admin/session', (req, res, next) => {
        let user = req.body.user;
        let status = 400;
        if (!!user) {
          req.session.user = user;
          status = 201;
        }
        return res.status(status).json({ data: user })
      })
      .delete('/api/admin/session', (req, res, next) => {
        delete req.session.user;
        let status = !!req.session.user ? 400 : 200;
        return res.status(status).json({ data: '' })
      });
  }
}