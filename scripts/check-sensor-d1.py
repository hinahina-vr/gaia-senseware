import json
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MIGRATIONS = sorted((ROOT / "sensor-platform" / "migrations").glob("*.sql"))

database = sqlite3.connect(":memory:")
database.execute("PRAGMA foreign_keys = ON")
for migration in MIGRATIONS:
    database.executescript(migration.read_text(encoding="utf-8"))
codes = [row[0] for row in database.execute("SELECT code FROM countries ORDER BY code")]
foreign_keys = database.execute("PRAGMA foreign_key_list(devices)").fetchall()
device_columns = {row[1] for row in database.execute("PRAGMA table_info(devices)")}
pairing_columns = {row[1] for row in database.execute("PRAGMA table_info(device_pairing_codes)")}
assert len(MIGRATIONS) == 5
assert len(codes) == 249 and len(set(codes)) == 249
assert all(len(code) == 2 and code.isascii() and code.isupper() for code in codes)
assert {"JP", "US", "DE", "BR", "AQ"}.issubset(codes)
assert any(row[2] == "countries" and row[3] == "country_code" and row[4] == "code" for row in foreign_keys)
assert {"subdivision_code", "municipality_code", "admin1_code", "locality_name", "location_precision"}.issubset(device_columns)
assert {"subdivision_code", "municipality_code", "admin1_code", "locality_name"}.issubset(pairing_columns)

print(json.dumps({
    "status": "passed",
    "migrations": [migration.name for migration in MIGRATIONS],
    "application": "passed",
    "countryCount": len(codes),
    "countryFormatErrors": 0,
    "foreignKey": "devices.country_code -> countries.code",
}, ensure_ascii=False, indent=2))
