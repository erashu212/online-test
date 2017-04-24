"use strict";

const StaticDispatcher = require('../common/static/index');

const AdminRoute = require('../api/routes/admin.route');
const QuestionRoute = require('../api/routes/question.route');

module.exports = class Routes {
    static init(app, router) {

        AdminRoute.init(app, router);
        QuestionRoute.init(app, router);

        app.use((req, res, next) => {
            if (!req.url.match(/\/api\/*/g)) {
                res.sendFile(process.cwd() + '/dist/index.html');
            }
            else {
                next();
            }
        });

        app.use(router);
    }
}