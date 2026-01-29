import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAsEKgyNzeJkIvIx2_EzP1EJhslUcfyX1c",
    authDomain: "neuro-well.firebaseapp.com",
    projectId: "neuro-well",
    storageBucket: "neuro-well.firebasestorage.app",
    messagingSenderId: "525269956319",
    appId: "1:525269956319:web:039b29b6ff24f9551c5b6a",
    measurementId: "G-5FVLCRZSSH",
    databaseURL: "https://neuro-well-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
