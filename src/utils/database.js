import { ref, push, set, get, child, onValue, off, update, remove } from "firebase/database";
import { database } from "../firebaseConfig";

// Patient Management
export const addPatient = async (userId, patientData) => {
    if (!userId) throw new Error("User ID is required");
    const patientsRef = ref(database, `users/${userId}/patients`);
    const newPatientRef = push(patientsRef);

    // Generate simple 3-digit ID
    const displayId = Math.floor(100 + Math.random() * 900).toString();

    await set(newPatientRef, {
        ...patientData,
        displayId,
        createdAt: Date.now()
    });
    return newPatientRef.key;
};

export const getPatients = async (userId) => {
    if (!userId) return [];
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `users/${userId}/patients`));
    if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map(key => ({
            id: key,
            ...data[key]
        }));
    } else {
        return [];
    }
};

// Session Management
export const createSession = async (userId, patientId, deviceId, notes = "") => {
    if (!userId) throw new Error("User ID is required");

    // Store session under the user
    const sessionsRef = ref(database, `users/${userId}/sessions`);
    const newSessionRef = push(sessionsRef);
    const sessionId = newSessionRef.key;

    // Initial session data
    const sessionData = {
        patientId,
        deviceId,
        date: new Date().toLocaleDateString(),
        startTime: new Date().toLocaleTimeString(),
        timestamp: Date.now(),
        status: 'active', // active, completed
        notes,
        stats: {
            duration: '0s',
            avgStress: 'Calculating...',
            peakHR: 0
        }
    };

    await set(newSessionRef, sessionData);

    // Update device status globally
    await update(ref(database, `devices/${deviceId}`), {
        status: 'in-session',
        currentSessionId: sessionId,
        currentUserId: userId // metadata who is using it
    });

    return sessionId;
};

export const getSessions = async (userId) => {
    if (!userId) return [];
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `users/${userId}/sessions`));
    if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map(key => ({
            id: key,
            ...data[key]
        }));
    } else {
        return [];
    }
};

export const endSession = async (userId, sessionId, deviceId, stats) => {
    const sessionRef = ref(database, `users/${userId}/sessions/${sessionId}`);
    await update(sessionRef, {
        status: 'completed',
        endTime: new Date().toLocaleTimeString(),
        stats
    });

    // Reset device status
    await update(ref(database, `devices/${deviceId}`), {
        status: 'connected',
        currentSessionId: null,
        currentUserId: null
    });
};

export const deletePatient = async (userId, patientId) => {
    if (!userId || !patientId) return;
    const patientRef = ref(database, `users/${userId}/patients/${patientId}`);
    await remove(patientRef);
};

export const deleteSession = async (userId, sessionId) => {
    if (!userId || !sessionId) return;
    const sessionRef = ref(database, `users/${userId}/sessions/${sessionId}`);
    await remove(sessionRef);
};

// Device / ESP32 Interactions (Global)
export const getDeviceStatus = async (deviceId) => {
    const deviceRef = ref(database, `devices/${deviceId}`);
    const snapshot = await get(deviceRef);
    if (snapshot.exists()) {
        const val = snapshot.val();
        const lastSeen = val.lastSeen ? val.lastSeen : 0;
        const now = Date.now();
        const diff = now - lastSeen;
        // Check if device was seen in the last 8 seconds
        // Handle potential small negative diffs (clock skew) safely
        const connected = diff < 8000;

        console.log(`[DeviceCheck] Connected: ${connected} | Diff: ${diff}ms`);
        return { connected, diff, lastSeen };
    }
    return { connected: false, diff: -1, lastSeen: 0 };
};

export const checkDeviceConnection = async (deviceId) => {
    const status = await getDeviceStatus(deviceId);
    return status.connected;
};

export const subscribeToDeviceData = (deviceId, callback) => {
    const dataRef = ref(database, `devices/${deviceId}/liveData`);
    onValue(dataRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            callback(data);
        }
    });
    return () => off(dataRef); // Return unsubscribe function
};
