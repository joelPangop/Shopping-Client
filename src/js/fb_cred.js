// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAPhAsMPLUjU8eCDWOE17_yoIyaCu7D3kU",
    authDomain: "egoal-shopping.firebaseapp.com",
    databaseURL: "https://egoal-shopping.firebaseio.com",
    projectId: "egoal-shopping",
    storageBucket: "egoal-shopping.appspot.com",
    messagingSenderId: "135938716350",
    appId: "1:135938716350:web:8d5e38fada46137f26a4ef",
    measurementId: "G-1QECVFYK2L"
};
// Initialize Firebasef

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
firebase.analytics();
