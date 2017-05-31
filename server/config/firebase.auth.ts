'use strict';

const admin = require('firebase-admin');
const firebaseAdminCredential = require('../constants/firebase.admin.credential.json');

const app = admin.initializeApp({
  credential: admin.credential.cert(firebaseAdminCredential),
  // We are not setting databaseURL since we're not using database.
  databaseURL: ''
});

module.exports = app.auth();
