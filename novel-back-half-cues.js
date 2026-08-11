(() => {
  "use strict";

  const expectedSceneCounts = Object.freeze({
    festival_build: 18,
    gx_deep_time: 24,
    mode03_map: 20,
    mode07_abstract: 54,
    interlude_sea: 67,
    mode08_map_layers: 19,
    mode10_space: 18,
    choice_editorial: 6,
    epilogue_reflection_field: 4,
    choice_reflection: 2,
    final_record: 27,
    return_to_start: 36,
  });

  const backHalfSceneIds = Object.freeze(Object.keys(expectedSceneCounts));
  const freezeRows = (rows) => Object.freeze(rows.map((row) => Object.freeze(row)));
  const temporal = freezeRows([
    { id: "festival-build-current", sceneId: "festival_build", from: 1, to: 18, context: "CURRENT", date: "2026-11-01", time: "14:40", dayPeriod: "day", location: "exhibition-hall" },
    { id: "gx-current", sceneId: "gx_deep_time", from: 1, to: 24, context: "CURRENT", date: "2026-11-01", time: "14:44", dayPeriod: "day", location: "exhibition-terminal" },
    { id: "mode03-current", sceneId: "mode03_map", from: 1, to: 20, context: "CURRENT", date: "2026-11-01", time: "14:53", dayPeriod: "day", location: "exhibition-terminal" },
    { id: "mode07-current", sceneId: "mode07_abstract", from: 1, to: 8, context: "CURRENT", date: "2026-11-01", time: "15:00", dayPeriod: "day", location: "exhibition-terminal" },
    { id: "mode07-record-evening", sceneId: "mode07_abstract", from: 9, to: 12, context: "RECORD", date: "2026-10-31", time: "18:00", dayPeriod: "night", location: "shared-meeting-room" },
    { id: "mode07-record-2200", sceneId: "mode07_abstract", from: 13, to: 15, context: "RECORD", date: "2026-10-31", time: "22:00", dayPeriod: "night", location: "shared-meeting-room" },
    { id: "mode07-record-2300", sceneId: "mode07_abstract", from: 16, to: 54, context: "RECORD", date: "2026-10-31", time: "23:00", dayPeriod: "night", location: "shared-meeting-room" },
    { id: "interlude-record-2320", sceneId: "interlude_sea", from: 1, to: 10, context: "RECORD", date: "2026-10-31", time: "23:20", dayPeriod: "night", location: "shared-room-to-hall" },
    { id: "interlude-record-coast", sceneId: "interlude_sea", from: 11, to: 45, context: "RECORD", date: "2026-10-31", time: "23:31–23:43", precision: "period", dayPeriod: "night", location: "zushi-coast" },
    { id: "interlude-record-2358", sceneId: "interlude_sea", from: 46, to: 53, context: "RECORD", date: "2026-10-31", time: "23:58", dayPeriod: "night", location: "shared-meeting-room" },
    { id: "interlude-record-midnight", sceneId: "interlude_sea", from: 54, to: 58, context: "RECORD", date: "2026-11-01", time: "00:00", dayPeriod: "night", location: "shared-meeting-room" },
    { id: "interlude-record-0026", sceneId: "interlude_sea", from: 59, to: 67, context: "RECORD", date: "2026-11-01", time: "00:26", dayPeriod: "night", location: "shared-meeting-room" },
    { id: "mode08-current", sceneId: "mode08_map_layers", from: 1, to: 19, context: "CURRENT", date: "2026-11-01", time: "15:22", dayPeriod: "day", location: "exhibition-terminal" },
    { id: "mode10-current", sceneId: "mode10_space", from: 1, to: 18, context: "CURRENT", date: "2026-11-01", time: "15:30", dayPeriod: "day", location: "exhibition-terminal" },
    { id: "choice-editorial-current", sceneId: "choice_editorial", from: 1, to: 6, context: "CURRENT", date: "2026-11-01", time: "15:38", dayPeriod: "day", location: "exhibition-booth" },
    { id: "epilogue-current", sceneId: "epilogue_reflection_field", from: 1, to: 4, context: "CURRENT", date: "2026-11-01", time: "15:42", dayPeriod: "day", location: "exhibition-booth" },
    { id: "reflection-current", sceneId: "choice_reflection", from: 1, to: 2, context: "CURRENT", date: "2026-11-01", time: "15:44", dayPeriod: "day", location: "exhibition-booth" },
    { id: "final-record-1547", sceneId: "final_record", from: 1, to: 7, context: "CURRENT", date: "2026-11-01", time: "15:47", dayPeriod: "day", location: "exhibition-booth" },
    { id: "final-record-1552", sceneId: "final_record", from: 8, to: 16, context: "CURRENT", date: "2026-11-01", time: "15:52", dayPeriod: "day", location: "exhibition-booth" },
    { id: "final-record-1554", sceneId: "final_record", from: 17, to: 27, context: "CURRENT", date: "2026-11-01", time: "15:54", dayPeriod: "day", location: "exhibition-booth" },
    { id: "pause-1555", sceneId: "return_to_start", from: 1, to: 17, context: "CURRENT", date: "2026-11-01", time: "15:55", dayPeriod: "day", location: "exhibition-booth" },
    { id: "entrance-1600", sceneId: "return_to_start", from: 18, to: 31, context: "CURRENT", date: "2026-11-01", time: "16:00", dayPeriod: "day", location: "central-entrance" },
    { id: "entrance-1603", sceneId: "return_to_start", from: 32, to: 36, context: "CURRENT", date: "2026-11-01", time: "16:03", dayPeriod: "day", location: "central-entrance" },
  ]);

  const interactions = freezeRows([
    { sceneId: "gx_deep_time", prepStepIds: ["gx_deep_time_001", "gx_deep_time_002"], stepId: "gx_deep_time_003", kind: "gx", returnStepId: "gx_deep_time_004", postStepIds: ["gx_deep_time_004", "gx_deep_time_005"] },
    { sceneId: "mode03_map", prepStepIds: ["mode03_map_001", "mode03_map_002"], stepId: "mode03_map_003", kind: "map03", returnStepId: "mode03_map_004", postStepIds: ["mode03_map_004", "mode03_map_005"] },
    { sceneId: "mode07_abstract", prepStepIds: ["mode07_abstract_001", "mode07_abstract_002"], stepId: "mode07_abstract_003", kind: "abstract07", returnStepId: "mode07_abstract_004", postStepIds: ["mode07_abstract_004", "mode07_abstract_005"] },
    { sceneId: "mode08_map_layers", prepStepIds: ["mode08_map_layers_001", "mode08_map_layers_002"], stepId: "mode08_map_layers_003", kind: "map08", returnStepId: "mode08_map_layers_004", postStepIds: ["mode08_map_layers_004", "mode08_map_layers_005"], optional: true },
    { sceneId: "mode10_space", prepStepIds: ["mode10_space_001", "mode10_space_002"], stepId: "mode10_space_003", kind: "space10", returnStepId: "mode10_space_004", postStepIds: ["mode10_space_004", "mode10_space_005"] },
  ]);

  const choices = freezeRows([
    { id: "editorial", prepStepIds: ["mode10_space_017", "mode10_space_018"], stepId: "choice_editorial_001", type: "choice", postStepIds: ["epilogue_reflection_field_001", "epilogue_reflection_field_002"] },
    { id: "reflection", prepStepIds: ["epilogue_reflection_field_003", "epilogue_reflection_field_004"], stepId: "choice_reflection_001", type: "reflectionChoice", resultStepId: "final_record_001", postStepIds: ["final_record_002", "final_record_003"] },
  ]);

  const devices = freezeRows([
    { id: "mode03-native-overlay", sceneId: "mode03_map", from: 3, to: 3, device: "native-mode-overlay" },
    { id: "mode07-native-overlay", sceneId: "mode07_abstract", from: 3, to: 3, device: "native-mode-overlay" },
    { id: "mode08-native-overlay", sceneId: "mode08_map_layers", from: 3, to: 3, device: "native-mode-overlay" },
    { id: "mode10-native-overlay", sceneId: "mode10_space", from: 3, to: 3, device: "native-mode-overlay" },
    { id: "mode10-record-terminal", sceneId: "mode10_space", from: 10, to: 15, device: "wide-exhibition-terminal" },
    { id: "amane-phone-prep", sceneId: "final_record", from: 8, to: 8, device: "portrait-operations-phone", phase: "prepare" },
    { id: "amane-official-notice", sceneId: "final_record", from: 9, to: 16, device: "portrait-operations-phone", phase: "official-notice" },
    { id: "amane-phone-audio", sceneId: "final_record", from: 17, to: 27, device: "portrait-operations-phone", phase: "incoming-audio" },
  ]);

  const audio = freezeRows([
    { stepId: "gx_deep_time_016", cue: "archive-recording-start" },
    { stepId: "gx_deep_time_017", cue: "archived-voices" },
    { stepId: "gx_deep_time_018", cue: "archive-room-foley" },
    { stepId: "gx_deep_time_019", cue: "archive-recording-stop" },
    { stepId: "mode10_space_006", cue: "eleven-second-recording-start" },
    { stepId: "mode10_space_007", cue: "recording-foley" },
    { stepId: "mode10_space_008", cue: "recording-to-current-hall-crossfade" },
    { stepId: "mode10_space_009", cue: "eleven-second-recording-stop" },
    { stepId: "final_record_004", cue: "railroad-single-pass" },
    { stepId: "final_record_005", cue: "current-hall-ambience" },
    { stepId: "final_record_009", cue: "operations-phone-vibration" },
    { stepId: "final_record_018", cue: "incoming-audio-call" },
    { stepId: "final_record_019", cue: "audio-call-connect" },
    { stepId: "final_record_021", cue: "phone-pa-delay" },
    { stepId: "final_record_027", cue: "audio-call-hangup" },
    { stepId: "return_to_start_017", cue: "exhibition-screen-fade" },
    { stepId: "return_to_start_018", cue: "central-entrance-ambience" },
    { stepId: "return_to_start_035", cue: "coastal-wind" },
  ]);

  const operationsPhone = Object.freeze({
    noticeTime: "15:52",
    noticeSender: "大学学生支援窓口",
    noticeBody: "本人の安全を確認しました。本人の同意により、中央入口で二人と話したい旨をお伝えします。",
    audioSpeaker: "サクヤ",
  });

  const stepNumber = (step, sceneId = step?.sceneId) => {
    const match = new RegExp(`^${sceneId}_(\\d{3})$`).exec(String(step?.id || ""));
    return match ? Number(match[1]) : null;
  };
  const ranged = (rows, step) => {
    const number = stepNumber(step);
    return rows.find((row) => row.sceneId === step.sceneId && number >= row.from && number <= row.to) || null;
  };

  const forStep = (step) => {
    if (!backHalfSceneIds.includes(step?.sceneId)) return null;
    const temporalCue = ranged(temporal, step);
    if (!temporalCue) throw new Error(`[GAIA novel] Missing back-half temporal cue for ${step?.id || "unknown step"}`);
    const deviceCue = ranged(devices, step);
    const number = stepNumber(step);
    const viewpoint = step.sceneId === "return_to_start" && number >= 18
      ? "work-camera"
      : temporalCue.context === "RECORD" ? "archive-record" : "visitor";
    let castMode = "normal";
    if (step.sceneId === "gx_deep_time" && number >= 17 && number <= 19) castMode = "archived-voice-no-cast";
    if (step.sceneId === "final_record" && number >= 9 && number <= 27) castMode = "remote-sakuya-no-cast";
    if (step.sceneId === "return_to_start" && number >= 18 && number <= 20) castMode = "sakuya-unseen";
    if (step.sceneId === "return_to_start" && number >= 21) castMode = "central-entrance-distance";
    const phone = deviceCue?.device === "portrait-operations-phone" ? Object.freeze({
      clock: temporalCue.time,
      noticeTime: operationsPhone.noticeTime,
      noticeSender: operationsPhone.noticeSender,
      noticeBody: operationsPhone.noticeBody,
      audioSpeaker: operationsPhone.audioSpeaker,
      audioStatus: number <= 18 ? "音声着信" : number === 27 ? "通話終了" : "接続中",
    }) : null;
    return Object.freeze({
      temporal: temporalCue,
      device: deviceCue?.device || "none",
      devicePhase: deviceCue?.phase || "none",
      viewpoint,
      castMode,
      audio: audio.find((entry) => entry.stepId === step.id)?.cue || "none",
      phone,
    });
  };

  globalThis.GAIA_NOVEL_BACK_HALF_CUES = Object.freeze({
    expectedSceneCounts,
    backHalfSceneIds,
    temporal,
    interactions,
    choices,
    devices,
    audio,
    operationsPhone,
    forStep,
  });
})();
