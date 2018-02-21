'use strict';
const functions = require('firebase-functions');
const app = require('./server/build/server.bundle.js').default;

exports.app = functions.https.onRequest(app);
