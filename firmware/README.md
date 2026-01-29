# Neurowell ESP32 Firmware Instructions

## Hardware Requirements
- **ESP32** (Development Board)
- **MAX30100** Pulse Oximeter Sensor
- **SSD1306 OLED Display** (0.96 inch, I2C)

## Wiring Connections

| Component | Pin  | ESP32 Pin |
|-----------|------|-----------|
| **OLED**  | SDA  | GPIO 21   |
|           | SCL  | GPIO 22   |
|           | VCC  | 3.3V      |
|           | GND  | GND       |
| **MAX301**| SDA  | GPIO 21   |
|           | SCL  | GPIO 22   |
|           | VCC  | 3.3V (or 5V) |
|           | GND  | GND       |
| **ECG**   | Out  | GPIO 34 (Analog) |
| **GSR**   | Out  | GPIO 35 (Analog) |

> **Note:** MAX30100 and OLED share the I2C bus (Pins 21 & 22).

## Dependencies (Arduino IDE Library Manager)
Install the following libraries:
1.  **Firebase ESP32 Client** by Mobizt (Version 4.x recommended)
2.  **Adafruit SSD1306** by Adafruit
3.  **Adafruit GFX Library** by Adafruit
4.  **MAX30100lib** by OXullo Intersecans (or compatible MAX30100 library)

## Setup
1.  Open `esp32_firmware.ino`.
2.  Update `WiFi` credentials if not already done.
3.  Ensure `FIREBASE_HOST` and `FIREBASE_AUTH` are correct (Already configured).
4.  Select Board: **DOIT ESP32 DEVKIT V1**.
5.  Upload.
