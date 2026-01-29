#include <WiFi.h>
#include <FirebaseESP32.h>
#include <Wire.h>
#include "MAX30100_PulseOximeter.h"
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// ================= WIFI & FIREBASE CONFIG =================
#define WIFI_SSID "moto g13"
#define WIFI_PASSWORD "aayush@123"

#define FIREBASE_HOST "neuro-well-default-rtdb.asia-southeast1.firebasedatabase.app"
#define FIREBASE_AUTH "AIzaSyAsEKgyNzeJkIvIx2_EzP1EJhslUcfyX1c" 

FirebaseData firebaseData;
FirebaseAuth auth;
FirebaseConfig config;
String deviceId = "ESP32_NEUROWELL_01";

// ================= OLED =================
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

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
const float alpha = 0.2; 

// ================= CALLBACKS =======================
// We use MAX30100 beat detection for HRV now (More reliable than simple ECG thresh)
void onBeatDetected() {
  Serial.print("B"); // Debug Beat
  unsigned long now = millis();
  
  if (lastBeatTime > 0) {
    unsigned long rr = now - lastBeatTime;
    
    // Filter noise: RR must be between 250ms (240 BPM) and 2000ms (30 BPM)
    if (rr > 250 && rr < 2000) {
       rrIntervals[rrIndex] = rr;
       rrIndex = (rrIndex + 1) % RR_BUFFER_SIZE;
    }
  }
  lastBeatTime = now;
}

void calculateRMSSD() {
    // Root Mean Square of Successive Differences
    long sumSquaredDiffs = 0;
    int count = 0;
    
    for (int i = 0; i < RR_BUFFER_SIZE - 1; i++) {
        // Only count if we have valid data (non-zero)
        if (rrIntervals[i] > 0 && rrIntervals[i+1] > 0) {
            long diff = (long)rrIntervals[i] - (long)rrIntervals[i+1];
            sumSquaredDiffs += (diff * diff);
            count++;
        }
    }
    
    if (count > 0) {
        currentRMSSD = sqrt(sumSquaredDiffs / count);
    } else {
        currentRMSSD = 0;
    }
}

float calculateAdvancedStress(float hr, float gsr, float rmssd) {
  // A Weighted Stress Model (0-10)
  
  // 1. HR Contribution (30%): HR > 100 is stressful
  float scoreHR = map(constrain(hr, 50, 110), 50, 110, 0, 100);
  
  // 2. GSR Contribution (40%): High GSR is stressful
  float scoreGSR = gsr; // Already 0-100
  
  // 3. HRV (RMSSD) Contribution (30%): Low HRV < 20ms is stressful, > 100ms is relaxed
  // Invert: High HRV = Low Stress
  float scoreHRV = map(constrain(rmssd, 10, 80), 10, 80, 100, 0); 

  float weightedScore = (scoreHR * 0.3) + (scoreGSR * 0.4) + (scoreHRV * 0.3);
  return weightedScore / 10.0; // Scale to 0-10
}

// ================= SETUP =================
void tokenStatusCallback(TokenInfo info);

void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22);
  Wire.setClock(400000); // Fast I2C

  Serial.println("\n--- I2C Scanner ---");
  byte error, address;
  int nDevices = 0;
  for(address = 1; address < 127; address++ ) {
    Wire.beginTransmission(address);
    error = Wire.endTransmission();
    if (error == 0) {
      Serial.print("Found I2C device at 0x");
      if (address<16) Serial.print("0");
      Serial.print(address,HEX);
      Serial.println("  !");
      nDevices++;
    }
  }
  if (nDevices == 0) Serial.println("No I2C devices found\n");
  else Serial.println("done\n");
  
  // OLED Init
  // Try both common addresses
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
     if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3D)) {
        Serial.println(F("OLED Allocation Failed"));
     } else {
        Serial.println(F("OLED Found at 0x3D"));
     }
  } else {
     Serial.println(F("OLED Found at 0x3C"));
  }
  
  display.clearDisplay();
  display.setTextColor(WHITE);
  display.setTextSize(1);
  display.setCursor(0,0); display.println("Booting...");
  display.display();

  // WiFi Init
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); Serial.print(".");
  }
  Serial.println("\nWiFi Connected");
  display.println("WiFi OK"); display.display();

  // Firebase Init
  config.database_url = FIREBASE_HOST; 
  config.api_key = FIREBASE_AUTH;
  config.token_status_callback = tokenStatusCallback;
  
  Firebase.signUp(&config, &auth, "", ""); // Anonymous
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  // MAX30100 Init
  Serial.print("MAX30100 Init...");
  if (!pox.begin()) {
    Serial.println("FAILED");
    display.println("MAX30100 Fail"); display.display();
  } else {
    Serial.println("SUCCESS");
    display.println("Sensor OK"); display.display();
  }
  
  pox.setOnBeatDetectedCallback(onBeatDetected);
  // Tuned for typical finger transmission
  pox.setIRLedCurrent(MAX30100_LED_CURR_24MA); // Try 24mA or 27.1mA
  
  // Clear buffers
  for(int i=0; i<RR_BUFFER_SIZE; i++) rrIntervals[i] = 0;
  
  delay(1000);
}

void tokenStatusCallback(TokenInfo info) {
    // Optional debug
}

// ================= LOOP ==================
void loop() {
  pox.update(); // Keep this running as fast as possible!

  if (millis() - lastReport > REPORTING_PERIOD_MS) {
    
    // 1. Read Raw Sensors
    float hr  = pox.getHeartRate();
    float spo2 = pox.getSpO2();
    int gsrRaw = analogRead(GSR_PIN);

    // 2. Calculate Algorithms
    calculateRMSSD(); // Updates 'currentRMSSD' based on beat history

    // Normalize GSR (Assume 1000-3500 range)
    float gsrNorm = map(constrain(gsrRaw, 1000, 3500), 1000, 3500, 0, 100);

    // 3. Filter Data (EMA)
    // Initialize if first run
    if (hrFiltered == 0) { hrFiltered = hr; spo2Filtered = spo2; gsrFiltered = gsrNorm; }

    hrFiltered   = alpha * hr   + (1 - alpha) * hrFiltered;
    spo2Filtered = alpha * spo2 + (1 - alpha) * spo2Filtered;
    gsrFiltered  = alpha * gsrNorm + (1 - alpha) * gsrFiltered;
    
    // HRV doesn't need aggressive filtering if RMSSD is used, but we can smooth it
    hrvFiltered  = alpha * currentRMSSD + (1 - alpha) * hrvFiltered;

    // 4. Calculate Stress
    float stress = calculateAdvancedStress(hrFiltered, gsrFiltered, hrvFiltered);

    // 5. Display on OLED
    display.clearDisplay();
    display.setCursor(0,0);
    display.printf("HR:  %d bpm\n", (int)hrFiltered);
    display.printf("SpO2:%d %%\n", (int)spo2Filtered);
    display.printf("HRV: %d ms\n", (int)hrvFiltered);
    display.printf("GSR: %d\n", (int)gsrFiltered);
    display.printf("STR: %.1f", stress);
    display.display();

    // 6. Upload to Firebase
    FirebaseJson json;
    json.set("heartRate", (int)hrFiltered);
    json.set("hrv", (int)hrvFiltered);
    json.set("gsr", gsrFiltered);
    json.set("stress", stress);
    json.set("spo2", (int)spo2Filtered);
    
    // Critical for Offline Detection
    Firebase.setTimestamp(firebaseData, "/devices/" + deviceId + "/lastSeen");
    
    if (Firebase.updateNode(firebaseData, "/devices/" + deviceId + "/liveData", json)) {
       Serial.printf("Sent: HR=%d, Stress=%.1f\n", (int)hrFiltered, stress);
    } else {
       Serial.print("Error: "); Serial.println(firebaseData.errorReason());
    }

    lastReport = millis();
  }
}
