import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAAwcRdTjSJBNZMPGouBuQ2cCYa0f0ksfs",
  authDomain: "poker-dd5ed.firebaseapp.com",
  projectId: "poker-dd5ed",
  storageBucket: "poker-dd5ed.firebasestorage.app",
  messagingSenderId: "580323812513",
  appId: "1:580323812513:web:0d42dc676bc3b2d03fbce0"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
