import governor from "./lod-governor.js?v=gaia-budget-devices-1";
import { mount } from "./live-data.js?v=gaia-wind-brush-1";
import "./live-exhibits.js?v=gaia-wind-brush-1";
import "./estat-exhibits.js?v=gaia-estat-start-zoom-1";

globalThis.GaiaExploration = Object.freeze({ governor, live: globalThis.GaiaLiveData });
void mount().catch((error) => console.error(error));
