import governor from "./lod-governor.js";
import { mount } from "./live-data.js";
import "./live-exhibits.js?v=gaia-live-description-aligned-2";

globalThis.GaiaExploration = Object.freeze({ governor, live: globalThis.GaiaLiveData });
void mount().catch((error) => console.error(error));
