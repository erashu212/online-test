"use strict";

// TODO: Review and cleanup.
module.exports = class Routes {
    static init(app: any, router: any) {

        /*eslint-disable */
        app.use((req: any, res: any, next: any) => {
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