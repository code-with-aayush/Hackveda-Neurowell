#include <Wire.h>
#include "MAX30100_PulseOximeter.h"

// ================= MAX30100 CONFIG =================
#define REPORTING_PERIOD_MS 1000
#define GSR_PIN 35

PulseOximeter pox;
uint32_t tsLastReport = 0;

// ================= CALLBACK =================
// This callback is fired by the library when a beat is detected
void onBeatDetected() {
    Serial.println("BEAT DETECTED!");
}

// ================= SETUP =================
void setup() {
    Serial.begin(115200);
    Serial.println("Initializing MAX30100...");

    // Initialize the MAX30100
    // If it fails to initialize, loop forever and print failure
    if (!pox.begin()) {
        Serial.println("FAILED: Check wiring (SDA=21, SCL=22)");
        for (;;);
    } else {
        Serial.println("SUCCESS: MAX30100 Initialized");
    }

    // Register the callback for beat detection
    pox.setOnBeatDetectedCallback(onBeatDetected);

    // CRITICAL SETTING: IR LED CURRENT
    // Many cheap MAX30100 modules require 50mA to work through skin.
    // If you see "Heart rate: 0", try changing this to 27MA or 50MA.
    pox.setIRLedCurrent(MAX30100_LED_CURR_50MA);
}

// ================= LIMITER FUNCTION =================
float applyLimit(float val, float minVal, float maxVal) {
    // If value is valid (>0) but outside our desired 'safe' range, 
    // or specifically usually high/erratic, we force it into range.
    // User logic: "if val > 70 (for HR), replace with random(70, 90)"
    // We apply this strictly to ensure output is always "clean".
    
    if (val > 0) {
        // If value is outside the target range (either too low or too high)
        // We replace it with a random value somewhere in the "Ideal" range.
        // For HR: range 70-90. For SpO2: range 95-100.
        if (val < minVal || val > maxVal) {
            // random() returns integer, so we divide if we needed floats, 
            // but for BPM/SpO2 integer randomness is fine.
            return (float)random((long)minVal, (long)maxVal + 1);
        }
    }
    return val;
}

// ================= LOOP =================
void loop() {
    // Make sure to call update as fast as possible
    pox.update();

    // Print values every 1 second
    if (millis() - tsLastReport > REPORTING_PERIOD_MS) {
        float bpm = pox.getHeartRate();
        float spo2 = pox.getSpO2();

        // APPLY LIMITS (User Requested)
        // HR: Target 70-90
        // SpO2: Target 95-100
        bpm = applyLimit(bpm, 70, 90);
        spo2 = applyLimit(spo2, 95, 100);

        // READ GSR (Safe inside 1-second block)
        int gsrRaw = analogRead(GSR_PIN);
        // Map 0-4095 (ESP32 ADC) to 0-100 (Arbitrary Unit)
        // Adjust these ranges based on your dry/wet finger test.
        // Usually dry skin is high resistance -> lower voltage.
        float gsr = map(constrain(gsrRaw, 0, 4095), 0, 4095, 0, 100);

        Serial.print("Heart rate: ");
        Serial.print(bpm);
        Serial.print(" bpm / SpO2: ");
        Serial.print(spo2);
        Serial.print(" % / GSR: ");
        Serial.println(gsr);

        tsLastReport = millis();
    }
}
