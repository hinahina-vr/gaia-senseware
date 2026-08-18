(() => {
  "use strict";

  const button = document.querySelector("#sensor-audio-toggle");
  const audio = window.GaiaOpeningAudio;
  if (!(button instanceof HTMLButtonElement) || !audio) return;

  let needsAction = false;
  const sync = (state = audio.getState()) => {
    const playing = Boolean(state?.playing && !state?.muted);
    button.dataset.muted = String(Boolean(state?.muted));
    button.dataset.playing = String(playing);
    button.dataset.needsAction = String(needsAction && !playing);
    button.setAttribute("aria-pressed", String(Boolean(state?.muted)));
    button.setAttribute("aria-label", playing ? "BGMを消音" : (needsAction ? "BGMを再開" : "BGMを再生"));
  };

  button.addEventListener("click", async () => {
    const state = audio.getState();
    needsAction = false;
    if (state.playing && !state.muted) await audio.setMuted(true);
    else await audio.setMuted(false);
    sync();
  });
  window.addEventListener("gaia:audio-state", (event) => sync(event.detail));
  sync();

  void audio.restoreNavigationState().then((result) => {
    needsAction = Boolean(result?.blocked);
    sync();
  });
})();
