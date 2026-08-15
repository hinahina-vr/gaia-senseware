# SmartCitySensorDemo

1. `config.example.h` を `config.h` へコピーします。
2. `root_ca.example.h` を `root_ca.h` へコピーし、production API domainのchainに合うRoot CAか必ず照合します。
3. ArduinoJson 7.xを導入し、ESP32 / ESP32-S3へ書き込みます。
4. `CITY-SENSOR-XXXX`へ接続し、`http://192.168.4.1/` のSetup画面へWi-Fiと一回限りのPairing Codeを入力します。

Wi-Fi、Device ID、Device Token、seqはPreferences/NVSへ保存されます。Pairing成功後、Pairing CodeはNVSから消去して再利用しません。Token・Wi-Fi password・Pairing CodeはSerialへ表示しません。`setInsecure()`は禁止です。

## 復旧と電源断耐性

- Wi-Fiへ3回接続できない場合、または初回Wi-Fi/Pairingに失敗した場合は、自動的に `CITY-SENSOR-XXXX` Setup APへ戻ります。新しいWi-FiとPairing Codeを同じ画面で上書きしてください。
- Pairing済みDeviceのWi-Fiだけを変更する場合、Setup画面のPairing Codeは空欄で構いません。
- いつでもBOOTボタン（標準はGPIO 0）を5秒間押し続けると、Wi-Fi・Device credential・pending telemetryをローカルNVSから消し、Setup APへ戻ります。利用boardに合わせて `REPROVISION_BUTTON_PIN` を変更してください。Web側Deviceは自動削除されないため、必要ならWeb画面でも削除します。
- telemetryは送信前に`seq`と完全なJSON本文をNVSのpending envelopeへ保存します。電源断後は同じbyte列を再送し、初回なら202、既に保存済みなら200 duplicateを受けてからseqを進めます。seq保存後・pending削除前の電源断も、再起動時に残骸を安全に消します。

実センサーへ差し替えるときは `USE_MOCK_SENSOR false` にし、`readSensors(SensorValues&)` だけを変更してください。
