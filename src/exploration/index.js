import governor from "./lod-governor.js?v=gaia-budget-devices-1";
import { mount } from "./live-data.js?v=gaia-wind-brush-1";
import "./live-exhibits.js?v=gaia-live-next-16-1";
import "./estat-exhibits.js?v=gaia-warm-stat-map-1";
import "./firms-exhibit.js?v=gaia-firms-next-27-1";
import "./planet-signals-exhibit.js?v=gaia-satellite-clouds-1";

globalThis.GaiaExploration = Object.freeze({ governor, live: globalThis.GaiaLiveData });
void mount().catch((error) => console.error(error));
