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
    { id: "festival-campus-entrance", sceneId: "festival_concept", from: 1, to: 7, assetPath: "assets/visuals-07/zushi-campus-story-bg-v4.webp", motion: "drift-right" },
    { id: "festival-exhibition-entrance", sceneId: "festival_concept", from: 8, to: 14, assetPath: "assets/visuals-07/novel-bg-coastal-venue-v3.png", motion: "push-in" },
    { id: "festival-first-encounter-cg", sceneId: "festival_concept", from: 15, to: 26, assetPath: "assets/visuals-07/event-cg-first-encounter-v1.png", motion: "event-focus", presentation: "event-cg" },
    { id: "festival-gaia-booth", sceneId: "festival_concept", from: 27, to: 76, assetPath: "assets/visuals-07/novel-bg-exhibition-v2.png", motion: "drift-left" },
    { id: "map01-terminal-booth", sceneId: "map_mode01", from: 1, to: 43, assetPath: "assets/visuals-07/novel-bg-exhibition-v2.png", motion: "push-in" },
    { id: "gx-terminal-booth", sceneId: "gx_experience", from: 1, to: 58, assetPath: "assets/visuals-07/novel-bg-exhibition-v3.png", motion: "drift-right" },
    { id: "esp32-exhibition", sceneId: "esp32_pitch", from: 1, to: 43, assetPath: "assets/visuals-07/novel-bg-exhibition-v2.png", motion: "drift-left" },
    { id: "circle-closing-exhibition", sceneId: "circle_invitation", from: 1, to: 47, assetPath: "assets/visuals-07/novel-bg-exhibition-v3.png", motion: "push-in" },
    { id: "circle-welcome-cg", sceneId: "circle_invitation", from: 48, to: 69, assetPath: "assets/visuals-07/event-cg-circle-welcome-v1.png", motion: "event-focus", presentation: "event-cg" },
    { id: "circle-after-welcome", sceneId: "circle_invitation", from: 70, to: 81, assetPath: "assets/visuals-07/novel-bg-exhibition-v3.png", motion: "drift-right" },
    { id: "welcome-wide-night", sceneId: "welcome_chat", from: 1, to: 54, assetPath: "assets/visuals-07/novel-bg-online-night-v2.png", motion: "drift-left" },
    { id: "welcome-physical-venue", sceneId: "welcome_chat", from: 55, to: 77, assetPath: "assets/visuals-07/novel-bg-coastal-venue-v2.png", motion: "push-in" },
    { id: "welcome-station-route", sceneId: "welcome_chat", from: 78, to: 82, assetPath: "assets/visuals-07/novel-bg-production-station-meeting-v1.png", motion: "drift-right" },
    { id: "welcome-return-train", sceneId: "welcome_chat", from: 83, to: 95, assetPath: "assets/visuals-07/novel-bg-production-return-train-v1.png", motion: "drift-left" },
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
    if (!cue.motion) throw new Error(`[GAIA novel] Missing contest-v10 background motion for ${step.id} (${cue.id})`);
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
