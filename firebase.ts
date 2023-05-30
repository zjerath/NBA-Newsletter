import { getApp, getApps, initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAo-Kbuemp5RxdGmjlwsdV8r0w8WH_p9Ec",
  authDomain: "nba-newsletter.firebaseapp.com",
  projectId: "nba-newsletter",
  storageBucket: "nba-newsletter.appspot.com",
  messagingSenderId: "730760573627",
  appId: "1:730760573627:web:d6a0e44abf625d9abe6f9e"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db }