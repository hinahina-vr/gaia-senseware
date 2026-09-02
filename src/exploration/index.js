import governor from "./lod-governor.js?v=gaia-budget-devices-1";
import { mount } from "./live-data.js?v=gaia-shared-map-zoom-1";
import "./live-exhibits.js?v=gaia-shared-map-zoom-1";

globalThis.GaiaExploration = Object.freeze({ governor, live: globalThis.GaiaLiveData });
void mount().catch((error) => console.error(error));
