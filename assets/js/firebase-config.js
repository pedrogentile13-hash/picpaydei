/* ============================
   Lidara — Firebase Config
   ============================ */

const firebaseConfig = {
  apiKey: "AIzaSyB44hUMEH8bSPduP4bUY5NB0cv6GWJkec4",
  authDomain: "picpaydei.firebaseapp.com",
  projectId: "picpaydei",
  storageBucket: "picpaydei.firebasestorage.app",
  messagingSenderId: "969415480553",
  appId: "1:969415480553:web:fb98663e3497eec53a4c78",
  measurementId: "G-VJ0B2D8YGE"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Enable offline persistence
db.enablePersistence({ synchronizeTabs: true }).catch(function(err) {
  if (err.code === 'failed-precondition') {
    console.warn('Firestore: Multiple tabs open, persistence enabled in first tab only.');
  } else if (err.code === 'unimplemented') {
    console.warn('Firestore: Browser does not support persistence.');
  }
});

console.log('Firebase initialized successfully');
