"use strict";

const StaticDispatcher = require('../common/static/index');

module.exports = class Routes {
    static init(app, router) {

        router
            .route('*')
            .get(StaticDispatcher.sendIndex);

        app.get('/', function (req, res) {
            res.sendFile(process.cwd() + '/dist/index.html');
        });

        app.use('/', router);
    }
}