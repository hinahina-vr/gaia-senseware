#include <Arduino.h>
#include <ArduinoJson.h>
#include <DNSServer.h>
#include <HTTPClient.h>
#include <Preferences.h>
#include <WebServer.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <time.h>

#include "config.h"
#include "root_ca.h"

struct SensorValues {
  float temperature;
  float humidity;
  float pm25;
};

Preferences preferences;
DNSServer dnsServer;
WebServer setupServer(80);
String deviceId;
String deviceToken;
String wifiSsid;
String wifiPassword;
String pairingCode;
uint64_t sequenceNumber = 0;
bool setupMode = false;

String htmlEscape(const String& value) {
  String escaped;
  escaped.reserve(value.length());
  for (size_t index = 0; index < value.length(); ++index) {
    switch (value[index]) {
      case '&': escaped += F("&amp;"); break;
      case '<': escaped += F("&lt;"); break;
      case '>': escaped += F("&gt;"); break;
      case '"': escaped += F("&quot;"); break;
      default: escaped += value[index];
    }
  }
  return escaped;
}

String setupPage(const String& message = "") {
  return String(F(
    "<!doctype html><html lang='ja'><meta name='viewport' content='width=device-width,initial-scale=1'>"
    "<title>ESP32 SENSOR SETUP</title><style>body{font:16px system-ui;background:#071727;color:#eef9ff;"
    "max-width:34rem;margin:0 auto;padding:2rem}form{display:grid;gap:1rem;background:#102a40;padding:1.4rem;"
    "border-radius:1rem}label{display:grid;gap:.4rem}input,button{font:inherit;padding:.85rem;border-radius:.6rem;"
    "border:1px solid #80e7e0}button{background:#80e7e0;color:#071727;font-weight:700}</style>"
    "<h1>ESP32 SENSOR SETUP</h1>")) +
    (message.length() ? "<p role='status'>" + htmlEscape(message) + "</p>" : "") +
    "<form method='post' action='/save'>"
    "<label>Wi-Fi SSID<input name='ssid' maxlength='32' required value='" + htmlEscape(wifiSsid) + "'></label>"
    "<label>Wi-Fi Password<input name='password' type='password' maxlength='63' required autocomplete='new-password'></label>"
    "<label>Pairing Code<input name='pairing' maxlength='9' pattern='[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}' required autocomplete='off'></label>"
    "<button type='submit'>Connect &amp; Register</button></form></html>";
}

void startSetupMode() {
  setupMode = true;
  WiFi.mode(WIFI_AP);
  const String suffix = String(static_cast<uint32_t>(ESP.getEfuseMac()), HEX).substring(4);
  const String accessPoint = "CITY-SENSOR-" + suffix;
  WiFi.softAP(accessPoint.c_str());
  dnsServer.start(53, "*", WiFi.softAPIP());
  setupServer.on("/", HTTP_GET, []() {
    setupServer.sendHeader("Cache-Control", "no-store");
    setupServer.send(200, "text/html; charset=utf-8", setupPage());
  });
  setupServer.on("/save", HTTP_POST, []() {
    const String submittedSsid = setupServer.arg("ssid");
    const String submittedPassword = setupServer.arg("password");
    String submittedPairing = setupServer.arg("pairing");
    submittedPairing.toUpperCase();
    const bool codeShape = submittedPairing.length() == 9 && submittedPairing[4] == '-';
    if (submittedSsid.length() == 0 || submittedSsid.length() > 32 || submittedPassword.length() < 8 ||
        submittedPassword.length() > 63 || !codeShape) {
      setupServer.send(400, "text/html; charset=utf-8", setupPage("入力内容を確認してください。"));
      return;
    }
    preferences.putString("wifiSsid", submittedSsid);
    preferences.putString("wifiPass", submittedPassword);
    preferences.putString("pairCode", submittedPairing);
    setupServer.sendHeader("Cache-Control", "no-store");
    setupServer.send(200, "text/html; charset=utf-8", setupPage("保存しました。再起動して接続します。"));
    delay(700);
    ESP.restart();
  });
  setupServer.onNotFound([]() {
    setupServer.sendHeader("Location", "/", true);
    setupServer.send(302, "text/plain", "");
  });
  setupServer.begin();
  Serial.printf("Setup Wi-Fi started: %s; open http://192.168.4.1/\n", accessPoint.c_str());
  Serial.println("Wi-Fi password and Pairing Code are never printed.");
}

bool readSensors(SensorValues& values) {
#if USE_MOCK_SENSOR
  const float phase = static_cast<float>(millis() % 60000UL) / 60000.0f;
  values.temperature = 24.0f + sinf(phase * TWO_PI) * 1.8f;
  values.humidity = 58.0f + cosf(phase * TWO_PI) * 5.0f;
  values.pm25 = 8.0f + sinf(phase * TWO_PI * 0.6f) * 2.0f;
  return true;
#else
  // Replace only this function with your sensor implementation.
  return false;
#endif
}

bool connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(wifiSsid.c_str(), wifiPassword.c_str());
  Serial.print("Connecting to Wi-Fi");
  const unsigned long deadline = millis() + 30000UL;
  while (WiFi.status() != WL_CONNECTED && millis() < deadline) {
    delay(350);
    Serial.print(".");
  }
  Serial.println();
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Wi-Fi connection failed. Credentials are never printed.");
    return false;
  }
  Serial.println("Wi-Fi connected.");
  configTime(0, 0, "pool.ntp.org", "time.google.com");
  return true;
}

bool httpsPost(const String& url, const String& body, const String& authorization, int& status, String& responseBody) {
  if (!url.startsWith("https://")) {
    Serial.println("Refusing non-HTTPS URL.");
    return false;
  }
  WiFiClientSecure client;
  client.setCACert(ROOT_CA);  // Certificate validation always stays enabled.
  HTTPClient http;
  http.setTimeout(HTTP_TIMEOUT_MS);
  if (!http.begin(client, url)) return false;
  http.addHeader("Content-Type", "application/json");
  if (authorization.length() > 0) http.addHeader("Authorization", authorization);
  status = http.POST(reinterpret_cast<const uint8_t*>(body.c_str()), body.length());
  if (status > 0 && status < 500) responseBody = http.getString();
  http.end();
  return status > 0;
}

bool pairDevice() {
  JsonDocument request;
  request["pairingCode"] = pairingCode;
  String requestBody;
  serializeJson(request, requestBody);

  int status = 0;
  String responseBody;
  if (!httpsPost(String(API_BASE_URL) + "/device/pair", requestBody, "", status, responseBody)) return false;
  if (status != 201) {
    Serial.printf("Pairing failed with HTTP %d. Generate a new code in GAIA SENSEWARE.\n", status);
    return false;
  }

  JsonDocument response;
  if (deserializeJson(response, responseBody) != DeserializationError::Ok) return false;
  const char* returnedId = response["deviceId"] | "";
  const char* returnedToken = response["deviceToken"] | "";
  if (strlen(returnedId) < 5 || strlen(returnedToken) < 40) return false;
  deviceId = returnedId;
  deviceToken = returnedToken;
  sequenceNumber = 0;
  preferences.putString("deviceId", deviceId);
  preferences.putString("deviceToken", deviceToken);
  preferences.putULong64("seq", sequenceNumber);
  preferences.remove("pairCode");
  pairingCode = "";
  Serial.println("Pairing succeeded. Device Token is stored in NVS and is not printed.");
  return true;
}

String isoTimestampIfSynchronized() {
  struct tm currentTime;
  if (!getLocalTime(&currentTime, 1000) || currentTime.tm_year < 120) return "";
  char buffer[25];
  strftime(buffer, sizeof(buffer), "%Y-%m-%dT%H:%M:%SZ", &currentTime);
  return String(buffer);
}

bool sendTelemetry(const SensorValues& values) {
  JsonDocument payload;
  payload["seq"] = sequenceNumber;
  const String observedAt = isoTimestampIfSynchronized();
  if (observedAt.length() > 0) payload["observedAt"] = observedAt;
  payload["data"]["temperature"] = roundf(values.temperature * 10.0f) / 10.0f;
  payload["data"]["humidity"] = roundf(values.humidity * 10.0f) / 10.0f;
  payload["data"]["pm25"] = roundf(values.pm25 * 10.0f) / 10.0f;
  String body;
  serializeJson(payload, body);

  const String endpoint = String(API_BASE_URL) + "/devices/" + deviceId + "/telemetry";
  for (int attempt = 0; attempt < RETRY_ATTEMPTS; ++attempt) {
    int status = 0;
    String responseBody;
    const bool sent = httpsPost(endpoint, body, String("Bearer ") + deviceToken, status, responseBody);
    if (sent && (status == 202 || status == 200)) {
      sequenceNumber += 1;
      preferences.putULong64("seq", sequenceNumber);
      Serial.printf("Telemetry accepted; next seq=%llu.\n", sequenceNumber);
      return true;
    }
    if (status == 401 || status == 409) {
      Serial.printf("Telemetry rejected with HTTP %d; not retrying this payload.\n", status);
      return false;
    }
    const unsigned long baseDelay = 5000UL << attempt;
    const unsigned long jitter = esp_random() % 800UL;
    Serial.printf("Telemetry retry %d after %lu ms.\n", attempt + 1, baseDelay + jitter);
    delay(baseDelay + jitter);
  }
  return false;
}

void setup() {
  Serial.begin(115200);
  delay(400);
  preferences.begin("gaia-sensor", false);
  deviceId = preferences.getString("deviceId", "");
  deviceToken = preferences.getString("deviceToken", "");
  wifiSsid = preferences.getString("wifiSsid", "");
  wifiPassword = preferences.getString("wifiPass", "");
  pairingCode = preferences.getString("pairCode", "");
  sequenceNumber = preferences.getULong64("seq", 0);
  if (wifiSsid.length() == 0 || wifiPassword.length() == 0 ||
      ((deviceId.length() == 0 || deviceToken.length() == 0) && pairingCode.length() == 0)) {
    startSetupMode();
    return;
  }
  if (!connectWiFi()) return;
  if (deviceId.length() == 0 || deviceToken.length() == 0) {
    if (!pairDevice()) Serial.println("Pairing is incomplete. Obtain a new one-time code and reboot.");
  } else {
    Serial.println("Device credential loaded from NVS. Secret value is not printed.");
  }
}

void loop() {
  if (setupMode) {
    dnsServer.processNextRequest();
    setupServer.handleClient();
    delay(2);
    return;
  }
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
    delay(1000);
    return;
  }
  if (deviceId.length() == 0 || deviceToken.length() == 0) {
    delay(TELEMETRY_INTERVAL_MS);
    return;
  }
  SensorValues values{};
  if (readSensors(values)) sendTelemetry(values);
  else Serial.println("Sensor read failed.");
  delay(TELEMETRY_INTERVAL_MS);
}
