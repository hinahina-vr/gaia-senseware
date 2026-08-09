(() => {
  "use strict";

  const productionYear = Object.freeze([
    { id: "current-exhibition-intro", from: 1, to: 6, assetPath: "assets/visuals-07/novel-bg-exhibition-v3.png" },
    { id: "remote-planning-night", from: 7, to: 59, assetPath: "assets/visuals-07/novel-bg-online-night-v2.png" },
    { id: "remote-white-red", from: 60, to: 79, assetPath: "assets/visuals-07/novel-bg-online-night-v2.png" },
    { id: "amane-white-red-night", from: 80, to: 82, assetPath: "assets/visuals-07/novel-bg-amane-room-night-v1.png" },
    { id: "amane-white-red-morning", from: 83, to: 85, assetPath: "assets/visuals-07/novel-bg-amane-room-morning-v1.png" },
    { id: "sakuya-white-red-day", from: 86, to: 86, assetPath: "assets/visuals-07/novel-bg-sakuya-room-day-v1.png" },
    { id: "amane-white-red-evening-note", from: 87, to: 88, assetPath: "assets/visuals-07/novel-bg-amane-room-evening-v1.png" },
    { id: "sakuya-photo-morning", from: 89, to: 89, assetPath: "assets/visuals-07/novel-bg-sakuya-room-morning-v1.png" },
    { id: "sakuya-deleted-line-evening", from: 90, to: 102, assetPath: "assets/visuals-07/novel-bg-sakuya-room-evening-v1.png" },
    { id: "mizuha-deleted-line-evening", from: 103, to: 108, assetPath: "assets/visuals-07/novel-bg-mizuha-room-evening-v1.png" },
    { id: "amane-deleted-line-evening", from: 109, to: 115, assetPath: "assets/visuals-07/novel-bg-amane-room-evening-v1.png" },
    { id: "sakuya-apology-morning", from: 116, to: 121, assetPath: "assets/visuals-07/novel-bg-sakuya-room-morning-v1.png" },
    { id: "remote-lunch-thread", from: 122, to: 129, assetPath: "assets/visuals-07/novel-bg-online-night-v2.png" },
    { id: "remote-new-year-huddle", from: 130, to: 149, assetPath: "assets/visuals-07/novel-bg-online-night-v2.png" },
    { id: "current-exhibition-audio", from: 150, to: 155, assetPath: "assets/visuals-07/novel-bg-exhibition-v3.png" },
    { id: "remote-ten-modes", from: 156, to: 168, assetPath: "assets/visuals-07/novel-bg-online-night-v2.png" },
    { id: "station-meeting", from: 169, to: 174, assetPath: "assets/visuals-07/novel-bg-production-station-meeting-v1.png" },
    { id: "shared-room-first-session", from: 175, to: 194, assetPath: "assets/visuals-07/novel-bg-production-shared-meeting-v3.png" },
    { id: "return-train", from: 195, to: 199, assetPath: "assets/visuals-07/novel-bg-production-return-train-v1.png" },
    { id: "shared-room-user-test", from: 200, to: 214, assetPath: "assets/visuals-07/novel-bg-production-shared-meeting-v3.png" },
    { id: "remote-publication-agreement", from: 215, to: 232, assetPath: "assets/visuals-07/novel-bg-online-night-v2.png" },
    { id: "venue-preparation", from: 233, to: 238, assetPath: "assets/visuals-07/novel-bg-production-venue-prep-v1.png" },
    { id: "used-equipment-store", from: 239, to: 247, assetPath: "assets/visuals-07/novel-bg-production-used-equipment-store-v1.png" },
    { id: "amane-reservation-day", from: 248, to: 253, assetPath: "assets/visuals-07/novel-bg-amane-room-day-v1.png" },
    { id: "amane-reservation-evening", from: 254, to: 256, assetPath: "assets/visuals-07/novel-bg-amane-room-evening-v1.png" },
    { id: "amane-next-session-evening-hold", from: 257, to: 258, assetPath: "assets/visuals-07/novel-bg-amane-room-evening-v1.png" },
    { id: "current-exhibition-return", from: 259, to: 261, assetPath: "assets/visuals-07/novel-bg-exhibition-v3.png" },
  ].map((cue) => Object.freeze(cue)));

  const productionStepNumber = (stepId) => {
    const match = /^production_year_(\d{3})$/.exec(String(stepId || ""));
    return match ? Number(match[1]) : null;
  };

  const forStep = (step) => {
    if (step?.sceneId !== "production_year") return null;
    const number = productionStepNumber(step.id);
    const cue = number === null ? null : productionYear.find((candidate) => number >= candidate.from && number <= candidate.to);
    if (!cue) throw new Error(`[GAIA novel] Missing production_year background cue for ${step?.id || "unknown step"}`);
    if (!cue.assetPath) throw new Error(`[GAIA novel] Missing approved production_year background asset for ${step.id} (${cue.id})`);
    return cue;
  };

  globalThis.GAIA_NOVEL_BACKGROUND_CUES = Object.freeze({ productionYear, forStep });
})();
