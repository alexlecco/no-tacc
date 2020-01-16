import * as firebase from 'firebase';

// Initialize Firebase
const firebaseConfig = {
    // apiKey: "AIzaSyAiQFTkUeOInS6qM5UQysZ-8wNaPy0FlhY",
    apiKey: "AIzaSyAMc4kbavMZEUFAf5mEqZFpXAxYtaw4HJc",
    authDomain: "prceliaco-1cfac.firebaseapp.com",
    databaseURL: "https://prceliaco-1cfac.firebaseio.com",
    projectId: "prceliaco-1cfac",
    storageBucket: "prceliaco-1cfac.appspot.com",
    messagingSenderId: "34893812883",
    // appId: "1:34893812883:web:7a4d0f64439cc1a6a32966",
    appId: "1:34893812883:android:8bf3eb1636eba2ada32966",
    measurementId: "G-HWY6YYGY1F"
};

firebase.initializeApp(firebaseConfig);

const firebaseApp = firebase;

export {
	firebaseApp,
};