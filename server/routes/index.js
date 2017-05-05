"use strict";

const QuestionRoute = require('../api/routes/question.route');

module.exports = class Routes {
    static init(app, router) {

        QuestionRoute.init(app, router);

        /*eslint-disable */
        app.use((req, res, next) => {
            if (req.url.match(/\/api\/*/g)) {
                next();
            }
            else {
                res.sendFile(process.cwd() + '/dist/index.html');
            }
        });
        /*eslint-enable */

        app.use(router);
    }
}