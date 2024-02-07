import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';

firebase.initializeApp({
  // old
  // apiKey: "AIzaSyDOqKQRSQkZHT9qcwizrkg6DhHLI2j0rFM",
  // authDomain: "bizchina-8527e.firebaseapp.com",
  // projectId: "bizchina-8527e",
  // storageBucket: "bizchina-8527e.appspot.com",
  // messagingSenderId: "905102109826",
  // appId: "1:905102109826:web:b0c6f64d2d04553536d89b",
  // measurementId: "G-CQ1FZNSMX7"
  
  // new
  apiKey: "AIzaSyDk-6N5sDu5LsLv8IDFoQvg3woJJwlvd8I",
  authDomain: "bizchinatemp.firebaseapp.com",
  projectId: "bizchinatemp",
  storageBucket: "bizchinatemp.appspot.com",
  messagingSenderId: "960504861530",
  appId: "1:960504861530:web:d932ad5c29226e9bfc1963",
  measurementId: "G-KCZ9TQLGE0"
})