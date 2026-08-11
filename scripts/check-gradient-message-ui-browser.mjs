import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [moduleRoot, executablePath, outputArgument, baseUrl = "http://127.0.0.1:4315"] = process.argv.slice(2);
if (!moduleRoot || !executablePath) throw new Error("Playwright module and browser executable are required");
const { chromium } = await import(pathToFileURL(path.join(moduleRoot, "index.mjs")));
const outputDir = path.resolve(outputArgument || "artifacts/gradient-message-ui");
fs.mkdirSync(outputDir, { recursive: true });
const routeUrl = new URL("/story", baseUrl).href;
const viewports = [
  { name: "pc-1440", width: 1440, height: 900 },
  { name: "mobile-390", width: 390, height: 844 },
];
const expectedNav = ["novel-eves-button", "novel-log-button", "novel-save-button", "novel-load-button", "novel-config-button", "novel-auto-button", "novel-fast-forward-button", "novel-jump-button"];
const report = { status: "running", scans: [], consoleErrors: [], pageErrors: [], responses404: [] };
const browser = await chromium.launch({ headless: true, executablePath });

const bootAt = async (page, stepId) => {
  await page.evaluate((id) => {
    const story = globalThis.GAIA_NOVEL_STORY;
    localStorage.setItem("gaiaSensewareNovel:progress", JSON.stringify({
      storyVersion: story.storyVersion,
      stepId: id,
      reachedSceneIds: [],
      viewed: {},
      evesRoute: [],
      observationOrder: null,
      editorialChoice: null,
      reflectionIds: [],
      resultTone: null,
      metCharacters: { mizuha: false, amane: false, sakuya: false },
      audio: { muted: true, volume: 0 },
      readStepIds: [],
      clear: false,
      archivesUnlocked: false,
      sessionId: "gradient-message-ui",
    }));
    localStorage.setItem("gaiaSensewareNovel:config:v2", JSON.stringify({ messageSpeedPercent: 400, reducedMotion: true }));
  }, stepId);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Boolean(globalThis.GaiaNovel));
  await page.evaluate(() => globalThis.GaiaNovel.open());
  await page.locator("#novel-resume-button").click();
  await page.waitForFunction((id) => document.querySelector("#novel-layer")?.dataset.stepId === id, stepId);
};

const snapshot = (page) => page.evaluate(() => {
  const rect = (node) => { const value = node.getBoundingClientRect(); return { left: value.left, top: value.top, right: value.right, bottom: value.bottom, width: value.width, height: value.height }; };
  const overlaps = (a, b) => a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1;
  const dialogue = document.querySelector("#novel-dialogue");
  const speaker = document.querySelector("#novel-speaker");
  const dialogueRect = rect(dialogue);
  const speakerRect = speaker.getClientRects().length ? rect(speaker) : null;
  const navButtons = [...document.querySelectorAll(".novel-topbar nav > button")].map((button) => {
    const style = getComputedStyle(button);
    const buttonRect = rect(button);
    return {
      id: button.id,
      hidden: button.hidden,
      display: style.display,
      pointerEvents: style.pointerEvents,
      rect: buttonRect,
      svgCount: button.querySelectorAll(":scope > svg.novel-nav-icon").length,
      labelRectCount: button.querySelector(".novel-nav-label")?.getClientRects().length || 0,
    };
  });
  const visible = navButtons.filter((button) => button.id !== "novel-close-button" && !button.hidden && button.display !== "none" && button.rect.width > 0 && button.rect.height > 0);
  const choices = [...document.querySelectorAll("#novel-choices > button")].filter((button) => getComputedStyle(button).display !== "none").map(rect);
  return {
    stepType: document.querySelector("#novel-layer").dataset.stepType,
    dialogue: dialogueRect,
    dialogueBorder: getComputedStyle(dialogue).borderWidth,
    dialogueBackground: getComputedStyle(dialogue).backgroundImage,
    gradientBoundary: getComputedStyle(dialogue, "::after").backgroundImage,
    speaker: speakerRect,
    speakerText: speaker.textContent,
    speakerDisplay: getComputedStyle(speaker).display,
    speakerCenterDelta: speakerRect ? Math.abs(((speakerRect.left + speakerRect.right) / 2) - ((dialogueRect.left + dialogueRect.right) / 2)) : 0,
    speakerBorder: getComputedStyle(speaker).borderWidth,
    nav: navButtons,
    visibleNav: visible.map((button) => button.id),
    targetMinimum: Math.min(...visible.map((button) => Math.min(button.rect.width, button.rect.height))),
    navDialogueOverlap: visible.some((button) => overlaps(button.rect, dialogueRect)),
    navSelfOverlap: visible.some((button, index) => visible.slice(index + 1).some((other) => overlaps(button.rect, other.rect))),
    navViewportContained: visible.every((button) => button.rect.left >= -1 && button.rect.right <= innerWidth + 1 && button.rect.top >= -1 && button.rect.bottom <= innerHeight + 1),
    iconCount: visible.reduce((sum, button) => sum + button.svgCount, 0),
    choices,
    choiceNavOverlap: choices.some((choice) => visible.some((button) => overlaps(choice, button.rect))),
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1,
  };
});

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
    const page = await context.newPage();
    page.on("console", (message) => { if (message.type() === "error") report.consoleErrors.push(`${viewport.name}: ${message.text()}`); });
    page.on("pageerror", (error) => report.pageErrors.push(`${viewport.name}: ${error.message}`));
    page.on("response", (response) => { if (response.status() === 404) report.responses404.push(`${viewport.name}: ${response.url()}`); });
    await page.goto(routeUrl, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(globalThis.GaiaNovel && globalThis.GAIA_NOVEL_STORY));
    const ids = await page.evaluate(() => {
      const steps = globalThis.GAIA_NOVEL_STORY.scenes.flatMap((scene) => scene.steps);
      return {
        dialogue: steps.find((step) => step.type === "dialogue")?.id,
        narration: steps.find((step) => step.type === "narration")?.id,
        choice: steps.find((step) => step.type === "choice")?.id,
      };
    });
    assert(ids.dialogue && ids.narration && ids.choice);

    await bootAt(page, ids.dialogue);
    const dialogue = await snapshot(page);
    assert.equal(dialogue.dialogueBorder, "0px");
    assert.equal(dialogue.dialogueBackground, "none");
    assert.match(dialogue.gradientBoundary, /radial-gradient/);
    assert(dialogue.speaker && dialogue.speakerText && dialogue.speakerCenterDelta <= 1 && dialogue.speakerBorder === "0px");
    assert.deepEqual(dialogue.visibleNav, expectedNav);
    assert(dialogue.targetMinimum >= 44 && dialogue.iconCount === 8 && !dialogue.navDialogueOverlap && !dialogue.navSelfOverlap && dialogue.navViewportContained && !dialogue.horizontalOverflow, `${viewport.name}: dialogue/nav geometry ${JSON.stringify(dialogue)}`);
    const restart = dialogue.nav.find((button) => button.id === "novel-restart-button");
    assert(restart.hidden && restart.display === "none" && restart.pointerEvents === "none" && restart.rect.width === 0 && restart.rect.height === 0);
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-dialogue.png`), animations: "disabled" });

    await page.locator("#novel-save-button").click();
    assert.equal(await page.locator("#novel-save-panel").isVisible(), true);
    await page.locator("#novel-save-close").click();
    assert.equal(await page.locator("#novel-save-panel").isHidden(), true);

    await bootAt(page, ids.narration);
    const narration = await snapshot(page);
    assert.equal(narration.speakerText, "");
    assert.equal(narration.speakerDisplay, "none");
    assert.deepEqual(narration.visibleNav, expectedNav);
    assert(!narration.navDialogueOverlap && !narration.horizontalOverflow);

    await bootAt(page, ids.choice);
    const choice = await snapshot(page);
    assert(choice.choices.length > 0 && !choice.choiceNavOverlap && !choice.horizontalOverflow);
    report.scans.push({ viewport, dialogue, narration, choice, primaryOperation: "SAVE open/close", passed: true });
    await context.close();
  }
  assert.equal(report.consoleErrors.length, 0);
  assert.equal(report.pageErrors.length, 0);
  assert.equal(report.responses404.length, 0);
  report.status = "passed";
} catch (error) {
  report.status = "failed";
  report.error = error.stack || String(error);
  throw error;
} finally {
  fs.writeFileSync(path.join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
  await browser.close();
}

console.log("gradient message UI browser check passed");
