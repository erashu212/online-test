'use strict';

const firebaseAuth = require('../../firebase.auth');
const serverModel = require('../models/server.model');

// TODO: Convert these APIs to Socket IO
module.exports = class QuestionRoute {
  static init(app, router) {
    router
      .post('/api/admin/question', (req, res) => {
        let sessionId;
        let {test, token} = req.body;

        if (test) {
          firebaseAuth.verifyIdToken(token)
            .then((decodedToken) => {
                sessionId = serverModel.newSession(test, decodedToken.uid);
                res.status(201).json({ 'sessionId': sessionId });
            }).catch((error) => {
              console.log(error);
              // TODO: Handle error
            });
        }
      })
  }
}