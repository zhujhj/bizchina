const firebase = require('firebase');

const firebaseConfig = {
    apiKey: "AIzaSyDOqKQRSQkZHT9qcwizrkg6DhHLI2j0rFM",
    authDomain: "bizchina-8527e.firebaseapp.com",
    projectId: "bizchina-8527e",
    storageBucket: "bizchina-8527e.appspot.com",
    messagingSenderId: "905102109826",
    appId: "1:905102109826:web:b0c6f64d2d04553536d89b",
    measurementId: "G-CQ1FZNSMX7"
}

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const Tasks = db.collection("Tasks");
module.exports = Tasks;