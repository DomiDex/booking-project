// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDyDm6MZ63z-tCx8iKqma8LDvst86dsGig',
  authDomain: 'bookings-17505.firebaseapp.com',
  projectId: 'bookings-17505',
  storageBucket: 'bookings-17505.appspot.com',
  messagingSenderId: '762864100651',
  appId: '1:762864100651:web:46fc9969633bf8ddab116e',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
