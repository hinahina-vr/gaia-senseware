import { toSoundParameters } from "./transforms.js";

class ProceduralAudio {
  constructor() {
    this.context = null;
    this.enabled = false;
    this.nodes = null;
    this.measurements = {};
    this.parameters = toSoundParameters({});
    document.addEventListener("visibilitychange", () => void this.syncVisibility());
    globalThis.addEventListener("gaia:audio-state", () => this.syncMaster());
    globalThis.addEventListener("gaia:live-update", (event) => this.update(event.detail?.measurements || {}));
  }

  async enable() {
    if (!this.context) this.createGraph();
    this.enabled = true;
    await this.syncVisibility();
    this.syncMaster();
    this.applyParameters();
    globalThis.dispatchEvent(new CustomEvent("gaia:procedural-audio-state", { detail: this.getState() }));
  }

  disable() {
    this.enabled = false;
    this.setTarget(this.nodes?.master?.gain, 0, 3);
    globalThis.dispatchEvent(new CustomEvent("gaia:procedural-audio-state", { detail: this.getState() }));
  }

  createGraph() {
    const AudioContextClass = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AudioContextClass) throw new Error("Web Audio API is not available");
    const context = new AudioContextClass({ latencyHint: "playback" });
    const master = context.createGain();
    const compressor = context.createDynamicsCompressor();
    const low = context.createOscillator();
    const lowGain = context.createGain();
    const lfo = context.createOscillator();
    const lfoGain = context.createGain();
    const noise = context.createBufferSource();
    const noiseFilter = context.createBiquadFilter();
    const noiseGain = context.createGain();
    const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let index = 0; index < channel.length; index += 1) channel[index] = Math.random() * 2 - 1;
    noise.buffer = buffer;
    noise.loop = true;
    noiseFilter.type = "bandpass";
    low.type = "sine";
    lfo.type = "sine";
    lowGain.gain.value = 0.025;
    noiseGain.gain.value = 0;
    lfoGain.gain.value = 4;
    master.gain.value = 0;
    low.connect(lowGain).connect(compressor);
    lfo.connect(lfoGain).connect(low.detune);
    noise.connect(noiseFilter).connect(noiseGain).connect(compressor);
    compressor.connect(master).connect(context.destination);
    low.start();
    lfo.start();
    noise.start();
    this.context = context;
    this.nodes = { master, low, lowGain, lfo, lfoGain, noise, noiseFilter, noiseGain };
  }

  update(measurements) {
    this.measurements = measurements;
    this.parameters = toSoundParameters(measurements);
    if (this.context) this.applyParameters();
  }

  applyParameters() {
    if (!this.nodes || !this.context) return;
    const parameters = this.parameters;
    this.setTarget(this.nodes.noiseGain.gain, parameters.noiseGain ?? 0, parameters.noiseGain == null ? 12 : 3);
    this.setTarget(this.nodes.noiseFilter.frequency, parameters.noiseCutoff ?? 180, 3);
    this.setTarget(this.nodes.noiseFilter.Q, parameters.resonance ?? 0.4, parameters.resonance == null ? 12 : 3);
    this.setTarget(this.nodes.low.frequency, parameters.baseFrequency ?? 55, 3);
    this.setTarget(this.nodes.low.detune, parameters.detune ?? 0, parameters.detune == null ? 12 : 3);
    this.setTarget(this.nodes.lfo.frequency, parameters.lfoFrequency ?? 0.03, 3);
    this.setTarget(this.nodes.lowGain.gain, parameters.pulseDensity == null ? 0.012 : 0.012 + Math.min(parameters.pulseDensity / 10, 1) * 0.018, parameters.pulseDensity == null ? 12 : 3);
    this.syncMaster();
  }

  setTarget(parameter, value, seconds) {
    if (!parameter || !this.context) return;
    parameter.cancelScheduledValues(this.context.currentTime);
    parameter.setTargetAtTime(value, this.context.currentTime, Math.max(3, seconds));
  }

  syncMaster() {
    if (!this.nodes) return;
    const opening = globalThis.GaiaOpeningAudio?.getState?.() || { muted: true, volume: 0.1 };
    const value = this.enabled && !document.hidden && !opening.muted ? Math.max(0, Math.min(1, opening.volume || 0)) * 0.08 : 0;
    this.setTarget(this.nodes.master.gain, value, 3);
  }

  async syncVisibility() {
    if (!this.context) return;
    if (document.hidden || !this.enabled) await this.context.suspend();
    else await this.context.resume();
    this.syncMaster();
  }

  getState() {
    return Object.freeze({ enabled: this.enabled, active: this.enabled && !document.hidden, parameters: this.parameters });
  }
}

const proceduralAudio = globalThis.GaiaProceduralAudio || new ProceduralAudio();
globalThis.GaiaProceduralAudio = proceduralAudio;
export default proceduralAudio;
