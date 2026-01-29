export const analyzeVitals = async (vitals) => {
    // Get URL from env or fallback to localhost for testing (which won't work for AWS without proxy)
    const API_URL = import.meta.env.VITE_API_GATEWAY_URL;

    if (!API_URL) {
        console.warn("AWS API Gateway URL is not configured.");
        return null;
    }

    console.log("[AI Service] Sending request to:", API_URL);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            mode: 'cors', // Explicitly request CORS
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(vitals)
        });

        if (!response.ok) {
            throw new Error(`AWS API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("AI Analysis Failed:", error);
        return null;
    }
};
