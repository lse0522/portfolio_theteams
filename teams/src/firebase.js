// FireBase
// import firebase from "firebase/app";
import firebase from "firebase/compat/app"
// import "firebase/firestore";
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

// 회원가입
import { initializeApp } from 'firebase/app';

// firebase 설정과 관련된 개인 정보
const firebaseConfig = {
  apiKey: "AIzaSyBwMj3o6DmmdXWPEIsA9MuMFM340DXjZzE",
  authDomain: "teams-73eb6.firebaseapp.com",
  projectId: "teams-73eb6",
  storageBucket: "teams-73eb6.appspot.com",
  messagingSenderId: "307943011345",
  appId: "1:307943011345:web:fcabcef60dbc6e1679adb0",
  measurementId: "G-JNZGEQFGK5"
};


// firebaseConfig 정보로 firebase 시작
// firebase.initializeApp(firebaseConfig);
// const firebase = initializeApp(firebaseConfig);

// 필요한 곳에서 사용할 수 있도록 내보내기
// const firestore = firebase.firestore();
// const app = initializeApp(firebaseConfig);
const app = firebase.initializeApp(firebaseConfig);
const firestore = app.firestore();
const auth = firebase.auth();

export {app ,firestore, auth};