// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUCF3IQqD8No_Kh2herRvPpHjZ6pKG0Lo",
  authDomain: "hali-il.firebaseapp.com",
  projectId: "hali-il",
  storageBucket: "hali-il.firebasestorage.app",
  messagingSenderId: "561374706810",
  appId: "1:561374706810:web:b7c01e3445eab36f034fc3",
  measurementId: "G-BVE22KZ44F",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;
