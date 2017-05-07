'use strict';

const admin = require("firebase-admin");
const firebaseAdminCredential = require("./firebase.admin.credential.json");

const app = admin.initializeApp({
  credential: admin.credential.cert(firebaseAdminCredential),
  // TODO: Read from a separate config file.
  databaseURL: "https://online-test-dev.firebaseio.com"
});

module.exports = app.auth();