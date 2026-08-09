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

  const backHalf = Object.freeze([
    { id: "festival-build-current", sceneId: "festival_build", from: 1, to: 18, assetPath: "assets/visuals-07/novel-bg-exhibition-v3.png" },
    { id: "gx-current", sceneId: "gx_deep_time", from: 1, to: 26, assetPath: "assets/visuals-07/novel-bg-exhibition-v3.png" },
    { id: "mode03-current", sceneId: "mode03_map", from: 1, to: 20, assetPath: "assets/visuals-07/novel-bg-exhibition-v3.png" },
    { id: "mode07-current", sceneId: "mode07_abstract", from: 1, to: 8, assetPath: "assets/visuals-07/novel-bg-exhibition-v3.png" },
    { id: "mode07-public-eve-record", sceneId: "mode07_abstract", from: 9, to: 54, assetPath: "assets/visuals-07/novel-bg-production-shared-meeting-v3.png" },
    { id: "interlude-room-departure", sceneId: "interlude_sea", from: 1, to: 7, assetPath: "assets/visuals-07/novel-bg-production-shared-meeting-v3.png" },
    { id: "interlude-zushi-coast", sceneId: "interlude_sea", from: 8, to: 45, assetPath: "assets/visuals-07/novel-bg-zushi-coast-night-v2.png" },
    { id: "interlude-room-return", sceneId: "interlude_sea", from: 46, to: 67, assetPath: "assets/visuals-07/novel-bg-production-shared-meeting-v3.png" },
    { id: "mode08-current", sceneId: "mode08_map_layers", from: 1, to: 19, assetPath: "assets/visuals-07/novel-bg-exhibition-v3.png" },
    { id: "mode10-current", sceneId: "mode10_space", from: 1, to: 18, assetPath: "assets/visuals-07/novel-bg-exhibition-v3.png" },
    { id: "choice-editorial-current", sceneId: "choice_editorial", from: 1, to: 7, assetPath: "assets/visuals-07/novel-bg-exhibition-v3.png" },
    { id: "epilogue-current", sceneId: "epilogue_reflection_field", from: 1, to: 2, assetPath: "assets/visuals-07/novel-bg-exhibition-v3.png" },
    { id: "reflection-current", sceneId: "choice_reflection", from: 1, to: 3, assetPath: "assets/visuals-07/novel-bg-exhibition-v3.png" },
    { id: "final-record-current", sceneId: "final_record", from: 1, to: 27, assetPath: "assets/visuals-07/novel-bg-exhibition-v3.png" },
    { id: "pause-current-exhibition", sceneId: "return_to_start", from: 1, to: 17, assetPath: "assets/visuals-07/novel-bg-exhibition-v3.png" },
    { id: "central-entrance-current", sceneId: "return_to_start", from: 18, to: 36, assetPath: "assets/visuals-07/novel-bg-coastal-venue-v2.png" },
  ].map((cue) => Object.freeze(cue)));

  const backHalfSceneIds = Object.freeze([...new Set(backHalf.map((cue) => cue.sceneId))]);

  const productionStepNumber = (stepId) => {
    const match = /^production_year_(\d{3})$/.exec(String(stepId || ""));
    return match ? Number(match[1]) : null;
  };

  const numberedStep = (step, sceneId) => {
    const match = new RegExp(`^${sceneId}_(\\d{3})$`).exec(String(step?.id || ""));
    return match ? Number(match[1]) : null;
  };

  const forStep = (step) => {
    if (step?.sceneId === "production_year") {
      const number = productionStepNumber(step.id);
      const cue = number === null ? null : productionYear.find((candidate) => number >= candidate.from && number <= candidate.to);
      if (!cue) throw new Error(`[GAIA novel] Missing production_year background cue for ${step?.id || "unknown step"}`);
      if (!cue.assetPath) throw new Error(`[GAIA novel] Missing approved production_year background asset for ${step.id} (${cue.id})`);
      return cue;
    }
    if (!backHalfSceneIds.includes(step?.sceneId)) return null;
    const number = numberedStep(step, step.sceneId);
    const cue = number === null ? null : backHalf.find((candidate) => (
      candidate.sceneId === step.sceneId && number >= candidate.from && number <= candidate.to
    ));
    if (!cue) throw new Error(`[GAIA novel] Missing back-half background cue for ${step?.id || "unknown step"}`);
    if (!cue.assetPath) throw new Error(`[GAIA novel] Missing approved back-half background asset for ${step.id} (${cue.id})`);
    return cue;
  };

  globalThis.GAIA_NOVEL_BACKGROUND_CUES = Object.freeze({ productionYear, backHalf, backHalfSceneIds, forStep });
})();
