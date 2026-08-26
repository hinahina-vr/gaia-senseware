import governor from "./lod-governor.js";
import { mount } from "./live-data.js";

globalThis.GaiaExploration = Object.freeze({ governor, live: globalThis.GaiaLiveData });
void mount().catch((error) => console.error(error));
