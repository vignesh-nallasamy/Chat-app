import firebase from "firebase"

var firebaseConfig = {
    apiKey: "AIzaSyDniaaja7UCB3gv5eslnIt_M_-eQpoU3xc",
    authDomain: "chat-app-d8aff.firebaseapp.com",
    databaseURL: "https://chat-app-d8aff.firebaseio.com",
    projectId: "chat-app-d8aff",
    storageBucket: "chat-app-d8aff.appspot.com",
    messagingSenderId: "66563022708",
    appId: "1:66563022708:web:0bc55a98e3fb4007685621",
    measurementId: "G-P3165M4XHJ"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

   export const auth = firebase.auth;
   export const db = firebase.firestore()
   export const fireup = firebase.firestore;
   export const storage = firebase.storage().ref();
 