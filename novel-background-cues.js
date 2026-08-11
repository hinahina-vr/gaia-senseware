(() => {
  "use strict";

  const expectedSceneCounts = Object.freeze({
    festival_concept: 76,
    map_mode01: 43,
    gx_experience: 58,
    esp32_pitch: 43,
    circle_invitation: 81,
    welcome_chat: 95,
  });

  const limitedStory = Object.freeze([
    { id: "festival-concept-exhibition", sceneId: "festival_concept", from: 1, to: 76, assetPath: "assets/visuals-07/novel-bg-exhibition-v3.png" },
    { id: "map01-exhibition", sceneId: "map_mode01", from: 1, to: 43, assetPath: "assets/visuals-07/novel-bg-exhibition-v3.png" },
    { id: "gx-exhibition", sceneId: "gx_experience", from: 1, to: 58, assetPath: "assets/visuals-07/novel-bg-exhibition-v3.png" },
    { id: "esp32-exhibition", sceneId: "esp32_pitch", from: 1, to: 43, assetPath: "assets/visuals-07/novel-bg-exhibition-v3.png" },
    { id: "circle-invitation-exhibition", sceneId: "circle_invitation", from: 1, to: 81, assetPath: "assets/visuals-07/novel-bg-exhibition-v3.png" },
    { id: "welcome-wide-chat", sceneId: "welcome_chat", from: 1, to: 54, assetPath: "assets/visuals-07/novel-bg-exhibition-v3.png" },
    { id: "welcome-physical-exhibition", sceneId: "welcome_chat", from: 55, to: 77, assetPath: "assets/visuals-07/novel-bg-exhibition-v3.png" },
    { id: "welcome-mobile-route", sceneId: "welcome_chat", from: 78, to: 95, assetPath: "assets/visuals-07/novel-bg-coastal-venue-v2.png" },
  ].map((cue) => Object.freeze(cue)));

  const sceneIds = Object.freeze(Object.keys(expectedSceneCounts));
  const numberedStep = (step) => {
    const match = new RegExp(`^${step?.sceneId}_(\\d{3})$`).exec(String(step?.id || ""));
    return match ? Number(match[1]) : null;
  };

  const forStep = (step) => {
    if (!sceneIds.includes(step?.sceneId)) {
      throw new Error(`[GAIA novel] Unknown contest-v10 background scene for ${step?.id || "unknown step"}`);
    }
    const number = numberedStep(step);
    const cue = number === null ? null : limitedStory.find((candidate) => (
      candidate.sceneId === step.sceneId && number >= candidate.from && number <= candidate.to
    ));
    if (!cue) throw new Error(`[GAIA novel] Missing contest-v10 background cue for ${step?.id || "unknown step"}`);
    if (!cue.assetPath) throw new Error(`[GAIA novel] Missing approved contest-v10 background asset for ${step.id} (${cue.id})`);
    return cue;
  };

  globalThis.GAIA_NOVEL_BACKGROUND_CUES = Object.freeze({
    expectedSceneCounts,
    sceneIds,
    limitedStory,
    // Compatibility aliases retained for the current runtime while the route is v10-only.
    productionYear: Object.freeze([]),
    backHalf: limitedStory,
    backHalfSceneIds: sceneIds,
    forStep,
  });
})();
