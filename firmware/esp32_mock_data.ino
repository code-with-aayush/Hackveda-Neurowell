#include <WiFi.h>
#include <FirebaseESP32.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// ================= WIFI & FIREBASE CONFIG =================
#define WIFI_SSID "aayush"
#define WIFI_PASSWORD "aayush123"

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

// ================= MOCK VARIABLES ==================
#define REPORTING_PERIOD_MS 1000
uint32_t lastReport = 0;

// Filters for smoothing the random walk
float hrFiltered   = 75;
float spo2Filtered = 98;
float hrvFiltered  = 50;
float gsrFiltered  = 10;
const float alpha = 0.1; // Slower filter for smoother random walk

void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22);

  // OLED Init
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
     if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3D)) {
        Serial.println(F("OLED Allocation Failed"));
     }
  }
  
  display.clearDisplay();
  display.setTextColor(WHITE);
  display.setTextSize(1);
  display.setCursor(0,0); display.println("Booting Mock FW...");
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
  
  Firebase.signUp(&config, &auth, "", ""); 
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  display.println("Mock Mode Ready"); display.display();
  delay(1000);
}

// Helper to simulate smooth random changes
float randomWalk(float current, float minVal, float maxVal, float step) {
  float change = (random(200) - 100) / 100.0 * step;
  float newVal = current + change;
  if (newVal < minVal) newVal = minVal;
  if (newVal > maxVal) newVal = maxVal;
  return newVal;
}

float calculateAdvancedStress(float hr, float gsr, float hrv) {
  // 1. HR Contribution
  float scoreHR = map(constrain(hr, 50, 110), 50, 110, 0, 100);
  // 2. GSR Contribution
  float scoreGSR = gsr; 
  // 3. HRV Contribution (Inverse)
  float scoreHRV = map(constrain(hrv, 10, 80), 10, 80, 100, 0); 

  float weightedScore = (scoreHR * 0.3) + (scoreGSR * 0.4) + (scoreHRV * 0.3);
  return weightedScore / 10.0;
}

void loop() {
  if (millis() - lastReport > REPORTING_PERIOD_MS) {
    
    // 1. Generate Mock Data (Random Walk)
    hrFiltered = randomWalk(hrFiltered, 60, 100, 5.0);
    spo2Filtered = randomWalk(spo2Filtered, 96, 100, 1.0);
    hrvFiltered = randomWalk(hrvFiltered, 20, 80, 10.0);
    // GSR often slowly rises or falls
    gsrFiltered = randomWalk(gsrFiltered, 10, 90, 5.0); 

    // 2. Calculate Stress based on these
    float stress = calculateAdvancedStress(hrFiltered, gsrFiltered, hrvFiltered);

    // 3. Display on OLED
    display.clearDisplay();
    display.setCursor(0,0);
    display.println("--- MOCK DATA ---");
    display.printf("HR:  %d bpm\n", (int)hrFiltered);
    display.printf("SpO2:%d %%\n", (int)spo2Filtered);
    display.printf("HRV: %d ms\n", (int)hrvFiltered);
    display.printf("GSR: %d\n", (int)gsrFiltered);
    display.printf("STR: %.1f", stress);
    display.display();

    // 4. Upload to Firebase
    FirebaseJson json;
    json.set("heartRate", (int)hrFiltered);
    json.set("hrv", (int)hrvFiltered);
    json.set("gsr", gsrFiltered);
    json.set("stress", stress);
    json.set("spo2", (int)spo2Filtered);
    
    Firebase.setTimestamp(firebaseData, "/devices/" + deviceId + "/lastSeen");
    
    if (Firebase.updateNode(firebaseData, "/devices/" + deviceId + "/liveData", json)) {
       Serial.printf("Sent Mock: HR=%d, Stress=%.1f\n", (int)hrFiltered, stress);
    }

    lastReport = millis();
  }
}
