import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const audioPath = path.join(root, "assets", "audio", "gaia-map-ambient-harp-felt-piano.wav");
const wav = fs.readFileSync(audioPath);
const openingAudioSource = fs.readFileSync(path.join(root, "opening-audio.js"), "utf8");
const novelModeSource = fs.readFileSync(path.join(root, "novel-mode.js"), "utf8");

assert(openingAudioSource.includes('senseware: "./assets/audio/gaia-map-ambient-harp-felt-piano.wav"'), "data-map route does not use the new ambience");
[
  "event-cg-festival-map-transition-five-plane",
  "modis-land-cover-2023.png",
  "novel-bg-map01-data-provenance",
].forEach((background) => {
  assert(novelModeSource.includes(`["${background}", "senseware"]`), `story MAP 01 background does not use the new ambience: ${background}`);
});

assert.equal(wav.toString("ascii", 0, 4), "RIFF", "map ambience must use a RIFF container");
assert.equal(wav.toString("ascii", 8, 12), "WAVE", "map ambience must be a WAVE file");
assert.equal(wav.readUInt16LE(20), 1, "map ambience must use uncompressed PCM");

const channels = wav.readUInt16LE(22);
const sampleRate = wav.readUInt32LE(24);
const bitsPerSample = wav.readUInt16LE(34);
const dataSize = wav.readUInt32LE(40);
const bytesPerFrame = channels * bitsPerSample / 8;
const frameCount = dataSize / bytesPerFrame;
const durationSeconds = frameCount / sampleRate;

assert.equal(channels, 2, "map ambience must be stereo");
assert.equal(sampleRate, 24_000, "map ambience sample rate changed");
assert.equal(bitsPerSample, 16, "map ambience must use 16-bit PCM");
assert.equal(durationSeconds, 40, "map ambience must preserve its 40-second loop");
assert.equal(wav.length, 44 + dataSize, "WAV data length is inconsistent");

let peak = 0;
let squareSum = 0;
let leftSquareSum = 0;
let rightSquareSum = 0;
let differenceSquareSum = 0;
let dcLeft = 0;
let dcRight = 0;
let previousLeft = 0;
let previousRight = 0;
let maximumStep = 0;
let lowLeft = 0;
let lowRight = 0;
let highBandSquareSum = 0;
let lowBandSquareSum = 0;
const lowAlpha = 1 - Math.exp((-Math.PI * 2 * 110) / sampleRate);
const highReferenceAlpha = 1 - Math.exp((-Math.PI * 2 * 6_000) / sampleRate);
let highReferenceLeft = 0;
let highReferenceRight = 0;
const secondRms = [];

for (let second = 0; second < durationSeconds; second += 1) {
  let windowSquareSum = 0;
  for (let offset = 0; offset < sampleRate; offset += 1) {
    const frame = second * sampleRate + offset;
    const byteOffset = 44 + frame * bytesPerFrame;
    const left = wav.readInt16LE(byteOffset) / 32_768;
    const right = wav.readInt16LE(byteOffset + 2) / 32_768;
    peak = Math.max(peak, Math.abs(left), Math.abs(right));
    squareSum += left * left + right * right;
    windowSquareSum += left * left + right * right;
    leftSquareSum += left * left;
    rightSquareSum += right * right;
    differenceSquareSum += (left - right) ** 2;
    dcLeft += left;
    dcRight += right;
    maximumStep = Math.max(maximumStep, Math.abs(left - previousLeft), Math.abs(right - previousRight));
    previousLeft = left;
    previousRight = right;

    lowLeft += lowAlpha * (left - lowLeft);
    lowRight += lowAlpha * (right - lowRight);
    lowBandSquareSum += lowLeft * lowLeft + lowRight * lowRight;
    highReferenceLeft += highReferenceAlpha * (left - highReferenceLeft);
    highReferenceRight += highReferenceAlpha * (right - highReferenceRight);
    highBandSquareSum += (left - highReferenceLeft) ** 2 + (right - highReferenceRight) ** 2;
  }
  secondRms.push(Math.sqrt(windowSquareSum / (sampleRate * channels)));
}

const rms = Math.sqrt(squareSum / (frameCount * channels));
const stereoDifferenceRms = Math.sqrt(differenceSquareSum / frameCount);
const highBandRatio = highBandSquareSum / squareSum;
const lowBandRatio = lowBandSquareSum / squareSum;
const crestFactor = peak / rms;
const loopLeft = Math.abs(wav.readInt16LE(44) - wav.readInt16LE(44 + (frameCount - 1) * bytesPerFrame)) / 32_768;
const loopRight = Math.abs(wav.readInt16LE(46) - wav.readInt16LE(46 + (frameCount - 1) * bytesPerFrame)) / 32_768;
const quietestSecond = Math.min(...secondRms);
const loudestSecond = Math.max(...secondRms);

assert(peak > 0.55 && peak < 0.84, `peak level is outside the transparent headroom target: ${peak}`);
assert(rms > 0.085 && rms < 0.12, `RMS level is outside the gallery ambience target: ${rms}`);
assert(crestFactor > 5.5 && crestFactor < 9.5, `score no longer has spacious transient headroom: ${crestFactor}`);
assert(highBandRatio < 0.012, `piercing high-frequency energy is too strong: ${highBandRatio}`);
assert(lowBandRatio > 0.08 && lowBandRatio < 0.58, `sub/ocean foundation is outside its intended range: ${lowBandRatio}`);
assert(stereoDifferenceRms > 0.018, `stereo field collapsed: ${stereoDifferenceRms}`);
assert(Math.abs(dcLeft / frameCount) < 0.001 && Math.abs(dcRight / frameCount) < 0.001, "DC offset is audible");
assert(maximumStep < 0.42, `a sharp construction-like transient remains: ${maximumStep}`);
assert(loopLeft < 0.004 && loopRight < 0.004, `loop boundary is not continuous: ${loopLeft}, ${loopRight}`);
assert(loudestSecond / quietestSecond > 1.35, "the score no longer leaves breathing room between gestures");

console.log(JSON.stringify({
  status: "passed",
  file: path.relative(root, audioPath).split(path.sep).join("/"),
  durationSeconds,
  sampleRate,
  channels,
  peak: Number(peak.toFixed(6)),
  rms: Number(rms.toFixed(6)),
  crestFactor: Number(crestFactor.toFixed(3)),
  highBandRatio: Number(highBandRatio.toFixed(6)),
  lowBandRatio: Number(lowBandRatio.toFixed(6)),
  stereoDifferenceRms: Number(stereoDifferenceRms.toFixed(6)),
  maximumStep: Number(maximumStep.toFixed(6)),
  loopBoundary: [Number(loopLeft.toFixed(6)), Number(loopRight.toFixed(6))],
  oneSecondDynamics: {
    quietest: Number(quietestSecond.toFixed(6)),
    loudest: Number(loudestSecond.toFixed(6)),
  },
}, null, 2));
