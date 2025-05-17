
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAWubpO9_1BK5OxKICIAanLPPz1qn_5l20",
    authDomain: "centraphone-df1cb.firebaseapp.com",
    projectId: "centraphone-df1cb",
    storageBucket: "centraphone-df1cb.firebasestorage.app",
    messagingSenderId: "885854984260",
    appId: "1:885854984260:web:438875613fb21a5b970411",
    measurementId: "G-WHWTJDZR7J"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
