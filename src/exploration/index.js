import governor from "./lod-governor.js?v=gaia-budget-devices-1";
import { mount } from "./live-data.js?v=gaia-national-analysis-1";
import "./live-exhibits.js?v=gaia-poi-manual-1";
import "./estat-exhibits.js?v=gaia-poi-manual-1";
import "./firms-exhibit.js?v=gaia-poi-manual-1";
import "./planet-signals-exhibit.js?v=gaia-inline-data-sources-1";
import "./map-demo.js?v=gaia-poi-manual-1";

globalThis.GaiaExploration = Object.freeze({ governor, live: globalThis.GaiaLiveData });
void mount().catch((error) => console.error(error));
