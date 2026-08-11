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

  const sceneIds = Object.freeze(Object.keys(expectedSceneCounts));
  const freezeRows = (rows) => Object.freeze(rows.map((row) => Object.freeze(row)));
  const stepIds = (sceneId, from, to) => Object.freeze(Array.from(
    { length: to - from + 1 },
    (_, index) => `${sceneId}_${String(from + index).padStart(3, "0")}`,
  ));

  // Contest v10 is a timed presentation, not an in-world absolute chronology.
  // Keep the source-authored duration and location without inventing a calendar date.
  const temporal = freezeRows([
    { id: "festival-concept-current", sceneId: "festival_concept", from: 1, to: 76, context: "CURRENT", precision: "APPROXIMATE", date: "", time: "0:00–1:45", duration: "0:00–1:45", dayPeriod: "", location: "オンライン大学・年次対面イベント／学生作品・体験展示ホール" },
    { id: "map01-current", sceneId: "map_mode01", from: 1, to: 43, context: "CURRENT", precision: "APPROXIMATE", date: "", time: "1:45–3:25", duration: "1:45–3:25", dayPeriod: "", location: "展示端末・地図MODE 01" },
    { id: "gx-current", sceneId: "gx_experience", from: 1, to: 58, context: "CURRENT", precision: "APPROXIMATE", date: "", time: "3:25–5:35", duration: "3:25–5:35", dayPeriod: "", location: "展示端末・GX／太古の海" },
    { id: "esp32-current", sceneId: "esp32_pitch", from: 1, to: 43, context: "CURRENT", precision: "APPROXIMATE", date: "", time: "5:35–7:15", duration: "5:35–7:15", dayPeriod: "", location: "年次対面イベント・GAIA SENSEWARE展示ブース" },
    { id: "circle-invitation-current", sceneId: "circle_invitation", from: 1, to: 81, context: "CURRENT", precision: "APPROXIMATE", date: "", time: "7:15–9:05", duration: "7:15–9:05", dayPeriod: "", location: "年次対面イベント・GAIA SENSEWARE展示ブース" },
    { id: "welcome-current", sceneId: "welcome_chat", from: 1, to: 95, context: "CURRENT", precision: "APPROXIMATE", date: "", time: "9:05–11:30", duration: "9:05–11:30", dayPeriod: "", location: "学内チャット『惑星の放課後』／閉場後の展示ホールから帰路へ" },
  ]);

  const interactions = freezeRows([
    {
      sceneId: "map_mode01",
      prepStepIds: stepIds("map_mode01", 1, 3),
      stepId: "map_mode01_004",
      kind: "map01",
      modeIndex: 0,
      modeId: "breathing-earth",
      target: "#japan-layer",
      returnStepId: "map_mode01_005",
      postStepIds: stepIds("map_mode01", 5, 43),
    },
    {
      sceneId: "gx_experience",
      prepStepIds: stepIds("gx_experience", 1, 16),
      stepId: "gx_experience_017",
      kind: "gx",
      target: "#gx-layer",
      returnStepId: "gx_experience_018",
      postStepIds: stepIds("gx_experience", 18, 58),
    },
  ]);

  const choices = freezeRows([
    {
      id: "demo-interest",
      sceneId: "gx_experience",
      stepId: "gx_experience_046",
      type: "choice",
      scope: "scene-local-demo",
      resultToken: "demo_interest",
    },
  ]);

  const devices = freezeRows([
    { id: "map01-native-overlay", sceneId: "map_mode01", from: 4, to: 4, device: "native-mode-overlay", phase: "open" },
    { id: "gx-native-overlay", sceneId: "gx_experience", from: 17, to: 17, device: "native-mode-overlay", phase: "open" },
    { id: "welcome-wide-chat", sceneId: "welcome_chat", from: 1, to: 54, device: "wide-campus-chat", phase: "wide" },
    { id: "welcome-physical", sceneId: "welcome_chat", from: 55, to: 77, device: "none", phase: "physical" },
    { id: "welcome-mobile-chat", sceneId: "welcome_chat", from: 78, to: 95, device: "mobile-campus-chat", phase: "mobile" },
  ]);

  const characters = freezeRows([
    { id: "welcome-wide-text-only", sceneId: "welcome_chat", from: 1, to: 54, cast: "none", portrait: "none", avatar: "none", voice: "none" },
    { id: "welcome-physical-mizuha-amane", sceneId: "welcome_chat", from: 55, to: 77, cast: "mizuha-amane", portrait: "normal", avatar: "none", voice: "none" },
    { id: "welcome-mobile-text-only", sceneId: "welcome_chat", from: 78, to: 95, cast: "none", portrait: "none", avatar: "none", voice: "none" },
  ]);

  // The short script contains no character voice or archive-recording cue.
  const audio = Object.freeze([]);

  const stepNumber = (step) => {
    const match = new RegExp(`^${step?.sceneId}_(\\d{3})$`).exec(String(step?.id || ""));
    return match ? Number(match[1]) : null;
  };
  const ranged = (rows, step) => {
    const number = stepNumber(step);
    return rows.find((row) => row.sceneId === step.sceneId && number >= row.from && number <= row.to) || null;
  };

  const forStep = (step) => {
    if (!sceneIds.includes(step?.sceneId)) {
      throw new Error(`[GAIA novel] Unknown contest-v10 staging scene for ${step?.id || "unknown step"}`);
    }
    const temporalCue = ranged(temporal, step);
    if (!temporalCue) throw new Error(`[GAIA novel] Missing contest-v10 temporal cue for ${step?.id || "unknown step"}`);
    const deviceCue = ranged(devices, step);
    const characterCue = ranged(characters, step);
    const number = stepNumber(step);
    const isInteraction = interactions.some((entry) => entry.stepId === step.id);
    let castMode = "normal";
    if (isInteraction) castMode = "interaction-no-cast";
    if (step.sceneId === "welcome_chat" && number <= 54) castMode = "chat-text-only-no-cast";
    if (step.sceneId === "welcome_chat" && number >= 78) castMode = "chat-text-only-no-cast";

    return Object.freeze({
      temporal: temporalCue,
      device: deviceCue?.device || "none",
      devicePhase: deviceCue?.phase || "none",
      viewpoint: "visitor",
      castMode,
      character: characterCue || Object.freeze({ cast: "normal", portrait: "normal", avatar: "normal", voice: "none" }),
      audio: "none",
      phone: null,
    });
  };

  globalThis.GAIA_NOVEL_BACK_HALF_CUES = Object.freeze({
    expectedSceneCounts,
    sceneIds,
    // Compatibility name retained until the runtime registry is renamed.
    backHalfSceneIds: sceneIds,
    temporal,
    interactions,
    choices,
    devices,
    characters,
    audio,
    operationsPhone: null,
    forStep,
  });
})();
