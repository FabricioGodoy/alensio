// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDEEAmfn3xIIDxRDtSJinz2hpd7WtEUTW0",
  authDomain: "alensio-5ea42.firebaseapp.com",
  projectId: "alensio-5ea42",
  storageBucket: "alensio-5ea42.appspot.com",
  messagingSenderId: "323410383047",
  appId: "1:323410383047:web:c64bbfdf67fab7cf652ee2",
  measurementId: "G-Z3ZRT808NF"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);