#include <WiFi.h>
#include <FirebaseESP32.h>
#include <Wire.h>
#include "MAX30100_PulseOximeter.h"

/******************************************************************************
 *  NEUROWELL V2 - ESP32 FIRMWARE (DEBUG MODE)
 *  
 *  SENSORS & WIRING CONNECTIONS
 *  ----------------------------
 *  1. ESP32 (DOIT DEVKIT V1)
 *     - Power via Micro USB or VIN (5V)
 *     
 *  2. MAX30100 (Pulse Oximeter & Heart Rate)
 *     - VIN  -> 3.3V (Recommended) or 5V
 *     - GND  -> GND
 *     - SCL  -> GPIO 22
 *     - SDA  -> GPIO 21
 *     
 *  3. GSR Sensor (Galvanic Skin Response / Skin Conductivity)
 *     - VCC  -> 3.3V or 5V
 *     - GND  -> GND
 *     - SIG  -> GPIO 35 (Analog Input)
 *     
 *  4. AD8232 ECG Sensor (Heart Monitor)
 *     - 3.3V -> 3.3V
 *     - GND  -> GND
 *     - OUTPUT -> GPIO 34 (Analog Input)
 ******************************************************************************/

// ================= WIFI & FIREBASE CONFIG =================
#define WIFI_SSID "aayush"
#define WIFI_PASSWORD "aayush123"

#define FIREBASE_HOST "neuro-well-default-rtdb.asia-southeast1.firebasedatabase.app"
#define FIREBASE_AUTH "AIzaSyAsEKgyNzeJkIvIx2_EzP1EJhslUcfyX1c" 

FirebaseData firebaseData;
FirebaseAuth auth;
FirebaseConfig config;
String deviceId = "ESP32_NEUROWELL_01";

// ================= MAX30100 ==============
PulseOximeter pox;
#define REPORTING_PERIOD_MS 1000
uint32_t lastReport = 0;

// ================= PINS ==================
#define ECG_PIN 34
#define GSR_PIN 35

// ================= ALGO BUFFERS ===================
const int RR_BUFFER_SIZE = 20;
unsigned long rrIntervals[RR_BUFFER_SIZE];
int rrIndex = 0;
unsigned long lastBeatTime = 0;
float currentRMSSD = 0;

// ================= FILTER VARIABLES ================
float hrFiltered   = 0;
float spo2Filtered = 0;
float hrvFiltered  = 0;
float gsrFiltered  = 0;
float ecgFiltered  = 0;
const float alpha = 0.2; 

// ================= CALLBACKS =======================
void onBeatDetected() {
  Serial.print("B"); // IMP: This 'B' proves the sensor is seeing a heart beat!
  unsigned long now = millis();
  
  if (lastBeatTime > 0) {
    unsigned long rr = now - lastBeatTime;
    
    if (rr > 250 && rr < 2000) {
       rrIntervals[rrIndex] = rr;
       rrIndex = (rrIndex + 1) % RR_BUFFER_SIZE;
    }
  }
  lastBeatTime = now;
}

void calculateRMSSD() {
    long sumSquaredDiffs = 0;
    int count = 0;
    for (int i = 0; i < RR_BUFFER_SIZE - 1; i++) {
        if (rrIntervals[i] > 0 && rrIntervals[i+1] > 0) {
            long diff = (long)rrIntervals[i] - (long)rrIntervals[i+1];
            sumSquaredDiffs += (diff * diff);
            count++;
        }
    }
    if (count > 0) {
        currentRMSSD = sqrt(sumSquaredDiffs / count);
    }
}

float calculateAdvancedStress(float hr, float gsr, float rmssd) {
  // A Weighted Stress Model (0-10)
  // 1. HR > 100 is high stress
  float scoreHR = map(constrain((long)hr, 50, 110), 50, 110, 0, 100);
  
  // 2. GSR: High Conductivity = High Stress
  float scoreGSR = gsr; 
  
  // 3. HRV: Low HRV = High Stress
  float scoreHRV = map(constrain((long)rmssd, 10, 80), 10, 80, 100, 0); 

  float weightedScore = (scoreHR * 0.3) + (scoreGSR * 0.4) + (scoreHRV * 0.3);
  return weightedScore / 10.0;
}

// ================= SETUP =================
void tokenStatusCallback(TokenInfo info);

void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22);
  Wire.setClock(400000); 

  Serial.println("\n--- Neurowell V2 DEBUG ---");

  // WiFi Init
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); Serial.print(".");
  }
  Serial.println("\nWiFi Connected");

  // Firebase
  config.database_url = FIREBASE_HOST; 
  config.api_key = FIREBASE_AUTH;
  config.token_status_callback = tokenStatusCallback;
  Firebase.signUp(&config, &auth, "", "");
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  // MAX30100 Init
  Serial.print("Initializing MAX30100...");
  if (!pox.begin()) {
    Serial.println("FAILED! Check wiring (SDA=21, SCL=22).");
  } else {
    Serial.println("SUCCESS");
  }
  
  pox.setOnBeatDetectedCallback(onBeatDetected);
  
  // ERROR FIX 1: INCREASE LED CURRENT
  // Common cheap modules need 50mA to see through skin effectively
  pox.setIRLedCurrent(MAX30100_LED_CURR_50MA); 
  
  // Clear buffers
  for(int i=0; i<RR_BUFFER_SIZE; i++) rrIntervals[i] = 0;
}

void tokenStatusCallback(TokenInfo info) { }

// ================= LOOP ==================
void loop() {
  pox.update(); 

  if (millis() - lastReport > REPORTING_PERIOD_MS) {
    
    // 1. Read Raw Sensors
    float hr  = pox.getHeartRate();
    float spo2 = pox.getSpO2();
    int gsrRaw = analogRead(GSR_PIN);
    int ecgRaw = analogRead(ECG_PIN); 

    // 2. Algorithm
    calculateRMSSD(); 

    // ERROR FIX 2: CALIBRATE GSR
    // Relaxed (Dry) -> High Resistance -> Low Analog Value (~1000-2000)
    // Stressed (Sweat) -> Low Resistance -> High Analog Value (~3000+)
    // Map raw 1000-3500 to 0-100 score
    float gsrNorm = map(constrain(gsrRaw, 500, 4095), 500, 4095, 0, 100);

    // 3. Filter
    if (hrFiltered == 0) { hrFiltered = hr; spo2Filtered = spo2; gsrFiltered = gsrNorm; ecgFiltered = ecgRaw; }

    hrFiltered   = alpha * hr   + (1 - alpha) * hrFiltered;
    spo2Filtered = alpha * spo2 + (1 - alpha) * spo2Filtered;
    gsrFiltered  = alpha * gsrNorm + (1 - alpha) * gsrFiltered;
    hrvFiltered  = alpha * currentRMSSD + (1 - alpha) * hrvFiltered;
    ecgFiltered  = alpha * ecgRaw + (1 - alpha) * ecgFiltered;

    float stress = calculateAdvancedStress(hrFiltered, gsrFiltered, hrvFiltered);

    // 4. Firebase
    FirebaseJson json;
    json.set("heartRate", (int)hrFiltered);
    json.set("hrv", (int)hrvFiltered);
    json.set("gsr", gsrFiltered);
    json.set("stress", stress);
    json.set("spo2", (int)spo2Filtered);
    json.set("ecgValue", (int)ecgFiltered);
    
    Firebase.setTimestamp(firebaseData, "/devices/" + deviceId + "/lastSeen");
    
    // 5. DEBUG SERIAL OUTPUT
    // Printing RAW values to help you debug what the sensor is actually seeing
    Serial.printf("[DEBUG] RAW_GSR:%d | HR:%d SpO2:%d | Stress:%.1f\n", 
                  gsrRaw, (int)hrFiltered, (int)spo2Filtered, stress);

    if (Firebase.updateNode(firebaseData, "/devices/" + deviceId + "/liveData", json)) {
       // Success
    } else {
       Serial.print("Firebase err: "); Serial.println(firebaseData.errorReason());
    }

    lastReport = millis();
  }
}
