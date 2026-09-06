import governor from "./lod-governor.js?v=gaia-budget-devices-1";
import { mount } from "./live-data.js?v=gaia-national-analysis-1";
import "./live-exhibits.js?v=gaia-realtime-analysis-disabled-1";
import "./estat-exhibits.js?v=gaia-lodging-color-1";
import "./firms-exhibit.js?v=gaia-realtime-analysis-disabled-1";
import "./planet-signals-exhibit.js?v=gaia-realtime-analysis-disabled-1";
import "./map-demo.js?v=gaia-demo-default-on-1";

globalThis.GaiaExploration = Object.freeze({ governor, live: globalThis.GaiaLiveData });
void mount().catch((error) => console.error(error));
