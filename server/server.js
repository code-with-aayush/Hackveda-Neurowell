require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { BedrockRuntimeClient, ConverseCommand } = require("@aws-sdk/client-bedrock-runtime");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// AWS Configuration
const REGION = process.env.AWS_REGION || "us-east-1";
const MODEL_ID = "amazon.nova-pro-v1:0"; // Using Amazon Nova Pro as per hackathon guide

const client = new BedrockRuntimeClient({
    region: REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

app.post('/api/analyze', async (req, res) => {
    try {
        const vitals = req.body;
        console.log("Analyze request received for:", vitals);

        if (!vitals) {
            return res.status(400).json({ error: "Missing vitals data" });
        }

        const prompt = `Analyze the following patient vitals and provide a health assessment:
        ${JSON.stringify(vitals)}
        
        Provide the response in the following JSON format ONLY:
        {
            "insight": "Brief medical insight based on the data.",
            "recommendation": "Actionable health advice.",
            "risk": "Low/Medium/High"
        }`;

        const input = {
            modelId: MODEL_ID,
            messages: [
                {
                    role: "user",
                    content: [{ text: prompt }]
                }
            ],
            inferenceConfig: {
                maxTokens: 1000,
                temperature: 0.7
            }
        };

        const command = new ConverseCommand(input);
        const response = await client.send(command);

        // Parse the response from Nova model
        const outputText = response.output.message.content[0].text;

        // Attempt to parse JSON from the text response
        let jsonResponse;
        try {
            // Find the first '{' and last '}' to extract JSON if there's extra text
            const jsonStart = outputText.indexOf('{');
            const jsonEnd = outputText.lastIndexOf('}') + 1;
            if (jsonStart !== -1 && jsonEnd !== -1) {
                jsonResponse = JSON.parse(outputText.slice(jsonStart, jsonEnd));
            } else {
                jsonResponse = { insight: outputText, recommendation: "Check raw output", risk: "Unknown" };
            }
        } catch (e) {
            console.warn("Failed to parse JSON from model response:", outputText);
            jsonResponse = { insight: outputText, recommendation: "Review raw text", risk: "Unknown" };
        }

        console.log("Analysis successful");
        res.json(jsonResponse);

    } catch (error) {
        console.error("Bedrock Error:", error);
        res.status(500).json({
            error: "AI Analysis Failed",
            details: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Region: ${REGION}`);
    console.log(`Model: ${MODEL_ID}`);
});
