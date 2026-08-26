const LEVELS = Object.freeze(["high", "medium", "low", "static"]);
const PROFILES = Object.freeze({
  high: Object.freeze({ level: "high", dprCap: 1.75, particleRatio: 1, effectsRatio: 1, targetFps: 60 }),
  medium: Object.freeze({ level: "medium", dprCap: 1.25, particleRatio: 0.65, effectsRatio: 0.5, targetFps: 60 }),
  low: Object.freeze({ level: "low", dprCap: 1, particleRatio: 0.25, effectsRatio: 0, targetFps: 60 }),
  static: Object.freeze({ level: "static", dprCap: 1, particleRatio: 0, effectsRatio: 0, targetFps: 0 }),
});

export class GaiaFrameBudgetGovernor {
  constructor({ now = () => performance.now(), autoStart = true } = {}) {
    this.now = now;
    this.levelIndex = 0;
    this.samples = [];
    this.slowPeriods = 0;
    this.criticalPeriods = 0;
    this.fastPeriods = 0;
    this.contextLosses = 0;
    this.lastChangeAt = -Infinity;
    this.previousFrame = 0;
    this.frame = 0;
    this.running = false;
    this.tick = this.tick.bind(this);
    this.publish("initial");
    if (autoStart) this.start();
  }

  getProfile() {
    return PROFILES[LEVELS[this.levelIndex]];
  }

  getDprCap() {
    return this.getProfile().dprCap;
  }

  start() {
    if (this.running || this.levelIndex === LEVELS.length - 1) return;
    this.running = true;
    this.previousFrame = 0;
    this.frame = requestAnimationFrame(this.tick);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.previousFrame = 0;
  }

  tick(timestamp) {
    if (!this.running) return;
    if (!document.hidden && this.previousFrame > 0) this.addSample(timestamp - this.previousFrame);
    this.previousFrame = timestamp;
    this.frame = requestAnimationFrame(this.tick);
  }

  addSample(duration) {
    if (!Number.isFinite(duration) || duration <= 0 || duration > 1_000) return;
    this.samples.push(duration);
    if (this.samples.length < 120) return;
    const windowSamples = this.samples.splice(0, 120);
    this.evaluateWindow(windowSamples);
  }

  evaluateWindow(samples) {
    const sorted = [...samples].sort((a, b) => a - b);
    const p95 = sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * 0.95) - 1)] || 0;
    const longFrameRate = samples.filter((value) => value > 25).length / Math.max(1, samples.length);
    const level = LEVELS[this.levelIndex];

    this.slowPeriods = p95 > 18.5 ? this.slowPeriods + 1 : 0;
    this.criticalPeriods = level === "low" && p95 > 22 ? this.criticalPeriods + 1 : 0;
    this.fastPeriods = p95 < 14 ? this.fastPeriods + 1 : 0;

    if (this.criticalPeriods >= 3) this.setLevel("static", "sustained-frame-budget-failure");
    else if (this.slowPeriods >= 2 && level !== "static") this.setLevel(LEVELS[Math.min(this.levelIndex + 1, LEVELS.length - 1)], "frame-budget");
    else if (this.fastPeriods >= 4 && this.levelIndex > 0 && this.now() - this.lastChangeAt >= 15_000) {
      this.setLevel(LEVELS[this.levelIndex - 1], "recovered-frame-budget");
    }

    globalThis.dispatchEvent?.(new CustomEvent("gaia:lodsample", { detail: { p95, longFrameRate, level: this.getProfile().level } }));
    return { p95, longFrameRate, level: this.getProfile().level };
  }

  setLevel(level, reason = "manual") {
    const nextIndex = LEVELS.indexOf(level);
    if (nextIndex < 0 || nextIndex === this.levelIndex) return;
    this.levelIndex = nextIndex;
    this.slowPeriods = 0;
    this.criticalPeriods = 0;
    this.fastPeriods = 0;
    this.lastChangeAt = this.now();
    this.publish(reason);
    if (level === "static") this.stop();
  }

  reportFailure(reason = "webgl-unavailable") {
    if (reason === "context-lost") {
      this.contextLosses += 1;
      if (this.contextLosses < 2) {
        this.setLevel("low", reason);
        return;
      }
    }
    this.setLevel("static", reason);
  }

  publish(reason) {
    const profile = this.getProfile();
    document.documentElement.dataset.gaiaLod = profile.level;
    globalThis.dispatchEvent?.(new CustomEvent("gaia:lodchange", { detail: { ...profile, reason } }));
  }

  __testFeedWindow(samples) {
    if (!Array.isArray(samples) || samples.length !== 120) throw new TypeError("120 frame samples are required");
    return this.evaluateWindow(samples);
  }
}

const governor = globalThis.GaiaFrameBudgetGovernor instanceof GaiaFrameBudgetGovernor
  ? globalThis.GaiaFrameBudgetGovernor
  : new GaiaFrameBudgetGovernor();
globalThis.GaiaFrameBudgetGovernor = governor;
globalThis.GaiaFrameBudgetGovernorClass = GaiaFrameBudgetGovernor;
globalThis.GaiaFrameBudgetProfiles = PROFILES;
export default governor;
