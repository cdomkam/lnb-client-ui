import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
// import { getStorage } from 'firebase/storage'
import { getFunctions } from 'firebase/functions'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBFGptajxz6U3grRGMPGhWnGiW_0nfLCJo",
    authDomain: "gemini-team.firebaseapp.com",
    projectId: "gemini-team",
    storageBucket: "gemini-team.appspot.com",
    messagingSenderId: "583960075765",
    appId: "1:583960075765:web:09a5c6a680454aa903d4bc"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
// export const storage = getStorage(app)
export const functions = getFunctions(app)
export const firestore = getFirestore(app)