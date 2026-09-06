import assert from "node:assert/strict";
import { realtimeStatus } from "../src/exploration/realtime-exhibit-status.js";
const now = Date.parse("2026-09-07T03:00:00Z");
const current = { now, observedAt: "2026-09-07T02:00:00Z" };
assert.equal(realtimeStatus().state, "loading");
for (const sourceState of ["LIVE", "LIVE CACHE"]) {
  const result = realtimeStatus({ ...current, sourceState });
  assert.equal(result.state, "live");
  assert.equal(result.time, "2026/09/07 11:00 JST");
  assert.equal(realtimeStatus({ ...current, sourceState, observedAt: "2026-09-01T02:00:00Z" }).state, "delayed");
  assert.equal(realtimeStatus({ ...current, sourceState, observedAt: "unknown" }).state, "delayed");
}
const sample = realtimeStatus({ ...current, sourceState: "SAVED VALUES" });
assert.equal(sample.state, "sample");
assert.equal(sample.time, "—", "Generated sample timestamp must not pass for current observations");
assert.equal(sample.iso, "");
const saved = realtimeStatus({ ...current, sourceState: "SAVED SNAPSHOT" });
assert.equal(saved.state, "saved");
assert.match(saved.label, /ライブ未接続/u);
assert.equal(saved.time, "2026/09/07 11:00 JST", "Saved real observations retain their actual timestamp");
assert.equal(realtimeStatus({ ...current, sourceState: "ERROR" }).state, "error");
console.log("Realtime identity: live/cache, delayed/unknown time, saved observations, generated samples and failure states passed.");
