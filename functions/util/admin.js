const admin = require('firebase-admin');

var serviceAccount = require('../../pengaduan-lotim-firebase-adminsdk.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = { admin, db };

//tes git
