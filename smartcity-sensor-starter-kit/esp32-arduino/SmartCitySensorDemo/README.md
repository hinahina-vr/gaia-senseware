# SmartCitySensorDemo

1. `config.example.h` を `config.h` へコピーします。
2. `root_ca.example.h` を `root_ca.h` へコピーし、production API domainのchainに合うRoot CAか必ず照合します。
3. ArduinoJson 7.xを導入し、ESP32 / ESP32-S3へ書き込みます。
4. `CITY-SENSOR-XXXX`へ接続し、`http://192.168.4.1/` のSetup画面へWi-Fiと一回限りのPairing Codeを入力します。

Wi-Fi、Device ID、Device Token、seqはPreferences/NVSへ保存されます。Pairing成功後、Pairing CodeはNVSから消去して再利用しません。Token・Wi-Fi password・Pairing CodeはSerialへ表示しません。`setInsecure()`は禁止です。

実センサーへ差し替えるときは `USE_MOCK_SENSOR false` にし、`readSensors(SensorValues&)` だけを変更してください。
