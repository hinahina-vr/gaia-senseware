import governor from "./lod-governor.js?v=gaia-budget-devices-1";
import { mount } from "./live-data.js?v=gaia-live-loading-1";
import "./live-exhibits.js?v=gaia-exhibit-catalog-1";
import "./estat-exhibits.js?v=gaia-exhibit-catalog-1";
import "./firms-exhibit.js?v=gaia-subject-categories-1";
import "./planet-signals-exhibit.js?v=gaia-unified-metric-legend-1";
import "./map-demo.js?v=gaia-map-demo-1";

globalThis.GaiaExploration = Object.freeze({ governor, live: globalThis.GaiaLiveData });
void mount().catch((error) => console.error(error));
