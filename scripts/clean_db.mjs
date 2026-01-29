import { initializeApp } from "firebase/app";
import { getDatabase, ref, remove } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAsEKgyNzeJkIvIx2_EzP1EJhslUcfyX1c",
    authDomain: "neuro-well.firebaseapp.com",
    databaseURL: "https://neuro-well-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "neuro-well",
    storageBucket: "neuro-well.firebasestorage.app",
    messagingSenderId: "525269956319",
    appId: "1:525269956319:web:e416130a7e00cf0d1c5b6a",
    measurementId: "G-5FVLCRZSSH"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function cleanDB() {
    console.log("Cleaning 'devices' node...");
    const devicesRef = ref(db, 'devices'); // Wipe all devices state or just the known one?
    // Let's wipe the specific esp32 to be safe
    const espRef = ref(db, 'devices/ESP32_NEUROWELL_01');

    try {
        await remove(espRef);
        console.log("Successfully removed 'devices/ESP32_NEUROWELL_01'");
    } catch (e) {
        console.error("Error cleaning DB:", e);
    }
    process.exit(0);
}

cleanDB();
