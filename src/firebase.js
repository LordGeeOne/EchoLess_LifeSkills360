import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAARhhrKccGGDSfMemCwv8jPloK_3VnLmw",
    authDomain: "lifeskills360-56b34.firebaseapp.com",
    projectId: "lifeskills360-56b34",
    storageBucket: "lifeskills360-56b34.firebasestorage.app",
    messagingSenderId: "1020983834185",
    appId: "1:1020983834185:web:ac64e544185bf639c2f198",
    measurementId: "G-3VT1NFS9KL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: 'select_account'
});

export { 
    auth, 
    provider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
};