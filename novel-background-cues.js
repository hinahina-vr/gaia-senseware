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

  const gallery = Object.freeze([
    {
      id: "first-encounter",
      title: "はじめまして",
      chapter: "01｜学園祭の展示ホール",
      unlockStepId: "festival_concept_015",
      assetPath: "assets/visuals-07/event-cg-first-encounter-v1.png",
      alt: "海辺の展示ブースで、ミズハとアマネに初めて出会う",
    },
    {
      id: "amane-closeup",
      title: "振り向いた光",
      chapter: "01｜学園祭の展示ホール",
      unlockStepId: "festival_concept_019",
      assetPath: "assets/visuals-07/event-cg-amane-closeup-v1.png",
      alt: "ケーブルから手を離し、穏やかに振り向くアマネ",
    },
    {
      id: "mizuha-closeup",
      title: "海色のまなざし",
      chapter: "01｜学園祭の展示ホール",
      unlockStepId: "festival_concept_023",
      assetPath: "assets/visuals-07/event-cg-mizuha-closeup-v1.png",
      alt: "タブレット越しにこちらを見つめるミズハ",
    },
    {
      id: "esp32-collaboration",
      title: "手のひらから始まる地球",
      chapter: "04｜ESP32プロトタイプ",
      unlockStepId: "esp32_pitch_008",
      assetPath: "assets/visuals-07/event-cg-esp32-collaboration-v1.png",
      alt: "ESP32とセンサーを囲み、三人で試作を考え始める",
    },
    {
      id: "circle-welcome",
      title: "ようこそ、同じ円へ",
      chapter: "05｜サークルへの招待",
      unlockStepId: "circle_invitation_048",
      assetPath: "assets/visuals-07/event-cg-circle-welcome-v1.png",
      alt: "夕暮れの展示会場で、サークル加入を迎えるミズハとアマネ",
    },
    {
      id: "exhibition-finale",
      title: "展示会の、その先へ",
      chapter: "06｜はじめまして",
      unlockStepId: "welcome_chat_092",
      assetPath: "assets/visuals-07/event-cg-exhibition-finale-v1.png",
      alt: "展示会場の地球ディスプレイを前に、三人の次の活動が始まる",
    },
  ].map((entry) => Object.freeze(entry)));

  const limitedStory = Object.freeze([
    { id: "festival-campus-entrance", sceneId: "festival_concept", from: 1, to: 7, assetPath: "assets/visuals-07/zushi-campus-story-bg-v4.webp", motion: "drift-right" },
    { id: "festival-exhibition-entrance", sceneId: "festival_concept", from: 8, to: 14, assetPath: "assets/visuals-07/novel-bg-coastal-venue-v3.png", motion: "push-in" },
    { id: "festival-first-encounter-cg", sceneId: "festival_concept", from: 15, to: 18, assetPath: "assets/visuals-07/event-cg-first-encounter-v1.png", motion: "event-focus", presentation: "event-cg", galleryId: "first-encounter" },
    { id: "festival-amane-closeup-cg", sceneId: "festival_concept", from: 19, to: 22, assetPath: "assets/visuals-07/event-cg-amane-closeup-v1.png", motion: "event-focus", presentation: "event-cg", galleryId: "amane-closeup" },
    { id: "festival-mizuha-closeup-cg", sceneId: "festival_concept", from: 23, to: 26, assetPath: "assets/visuals-07/event-cg-mizuha-closeup-v1.png", motion: "event-focus", presentation: "event-cg", galleryId: "mizuha-closeup" },
    { id: "festival-gaia-booth", sceneId: "festival_concept", from: 27, to: 76, assetPath: "assets/visuals-07/novel-bg-exhibition-v2.png", motion: "drift-left" },
    { id: "map01-terminal-booth", sceneId: "map_mode01", from: 1, to: 43, assetPath: "assets/visuals-07/novel-bg-exhibition-v2.png", motion: "push-in" },
    { id: "gx-terminal-booth", sceneId: "gx_experience", from: 1, to: 58, assetPath: "assets/visuals-07/novel-bg-exhibition-v3.png", motion: "drift-right" },
    { id: "esp32-exhibition-opening", sceneId: "esp32_pitch", from: 1, to: 7, assetPath: "assets/visuals-07/novel-bg-exhibition-v2.png", motion: "drift-left" },
    { id: "esp32-collaboration-cg", sceneId: "esp32_pitch", from: 8, to: 18, assetPath: "assets/visuals-07/event-cg-esp32-collaboration-v1.png", motion: "event-focus", presentation: "event-cg", galleryId: "esp32-collaboration" },
    { id: "esp32-exhibition-return", sceneId: "esp32_pitch", from: 19, to: 43, assetPath: "assets/visuals-07/novel-bg-exhibition-v2.png", motion: "drift-left" },
    { id: "circle-closing-exhibition", sceneId: "circle_invitation", from: 1, to: 47, assetPath: "assets/visuals-07/novel-bg-exhibition-v3.png", motion: "push-in" },
    { id: "circle-welcome-cg", sceneId: "circle_invitation", from: 48, to: 69, assetPath: "assets/visuals-07/event-cg-circle-welcome-v1.png", motion: "event-focus", presentation: "event-cg", galleryId: "circle-welcome" },
    { id: "circle-after-welcome", sceneId: "circle_invitation", from: 70, to: 81, assetPath: "assets/visuals-07/novel-bg-exhibition-v3.png", motion: "drift-right" },
    { id: "welcome-wide-night", sceneId: "welcome_chat", from: 1, to: 54, assetPath: "assets/visuals-07/novel-bg-online-night-v2.png", motion: "drift-left" },
    { id: "welcome-physical-venue", sceneId: "welcome_chat", from: 55, to: 77, assetPath: "assets/visuals-07/novel-bg-coastal-venue-v2.png", motion: "push-in" },
    { id: "welcome-closing-exhibition", sceneId: "welcome_chat", from: 78, to: 91, assetPath: "assets/visuals-07/novel-bg-exhibition-v3.png", motion: "push-in" },
    { id: "welcome-exhibition-finale-cg", sceneId: "welcome_chat", from: 92, to: 95, assetPath: "assets/visuals-07/event-cg-exhibition-finale-v1.png", motion: "event-focus", presentation: "event-cg", galleryId: "exhibition-finale" },
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
    gallery,
    // Compatibility aliases retained for the current runtime while the route is v10-only.
    productionYear: Object.freeze([]),
    backHalf: limitedStory,
    backHalfSceneIds: sceneIds,
    forStep,
  });
})();
