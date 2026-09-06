// Visual-regression tests explicitly represent a listener who knows the tracks.
// Fresh-visitor lock behavior is covered separately by check-sound-lock-browser.
export const seedHeardSoundArchive = target => target.addInitScript(() => {
  localStorage.setItem("gaia-senseware-heard-tracks:v1", JSON.stringify({
    version: 1,
    tracks: ["opening", "story", "windowlight", "firstlight", "foldedwind", "snowfire", "snowafter", "moonbook", "senseware", "moonreopen", "ending", "trueend"],
  }));
});
