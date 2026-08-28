import governor from "./lod-governor.js";
import { mount } from "./live-data.js?v=gaia-live-compact-jpt-audio-1";
import "./live-exhibits.js?v=gaia-mobile-exhibit-hud-5";

globalThis.GaiaExploration = Object.freeze({ governor, live: globalThis.GaiaLiveData });
void mount().catch((error) => console.error(error));
