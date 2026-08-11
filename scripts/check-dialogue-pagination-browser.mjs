import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const [moduleArgument, executableArgument, outputArgument, baseUrlArgument] = process.argv.slice(2);
const moduleRoot = process.env.GAIA_PLAYWRIGHT_PATH || moduleArgument;
const executablePath = process.env.GAIA_BROWSER_EXECUTABLE || executableArgument;
const outputDir = path.resolve(process.env.GAIA_BROWSER_ARTIFACTS || outputArgument || "artifacts/dialogue-pagination");
const baseUrl = process.env.GAIA_BASE_URL || baseUrlArgument || "http://127.0.0.1:4311";
const viewportFilter = process.env.GAIA_VIEWPORT_FILTER || "";
const stepFilter = process.env.GAIA_STEP_FILTER || "";
if (!moduleRoot || !executablePath) throw new Error("GAIA_PLAYWRIGHT_PATH and GAIA_BROWSER_EXECUTABLE are required");

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
delete globalThis.GAIA_NOVEL_STORY;
await import(`${pathToFileURL(path.join(projectRoot, "novel-story-data.js")).href}?dialogue-pagination=${Date.now()}`);
const story = globalThis.GAIA_NOVEL_STORY;
const allSteps = story.scenes.flatMap((scene) => scene.steps);
const textSteps = allSteps
  .filter((step) => ["narration", "dialogue"].includes(step.type))
  .filter((step) => !stepFilter || step.id === stepFilter)
  .map(({ id, sceneId, type, text }) => ({ id, sceneId, type, text: String(text || "") }));
assert(textSteps.length > 0, `no text steps matched ${stepFilter || "the story"}`);

const viewports = [
  { name: "pc-1440", width: 1440, height: 900 },
  { name: "mobile-390", width: 390, height: 844 },
].filter((viewport) => !viewportFilter || viewport.name === viewportFilter);
assert(viewports.length > 0, `unknown viewport filter: ${viewportFilter}`);

const { chromium } = await import(pathToFileURL(path.join(moduleRoot, "index.mjs")));
const routeUrl = new URL("/story", baseUrl).href;
const storageKey = "gaiaSensewareNovel:progress";
const configKey = "gaiaSensewareNovel:config:v2";
const report = {
  status: "running",
  storyVersion: story.storyVersion,
  totalSteps: allSteps.length,
  auditedTextSteps: textSteps.length,
  viewports: {},
  consoleErrors: [],
  pageErrors: [],
  responses404: [],
};
fs.mkdirSync(outputDir, { recursive: true });

const baseState = {
  storyVersion: story.storyVersion,
  stepId: textSteps[0].id,
  reachedSceneIds: [],
  viewed: {},
  metCharacters: { mizuha: false, amane: false, sakuya: false },
  evesRoute: [],
  observationOrder: null,
  editorialChoice: null,
  reflectionIds: [],
  resultTone: null,
  audio: { muted: true, volume: 0 },
  readStepIds: [],
  clear: false,
  archivesUnlocked: false,
  sessionId: "dialogue-pagination-check",
};

const sentenceEnd = /[\u3002\uff01\uff1f!?][\u300d\u300f\u3011\u3015\uff3d\uff09\)\u3009\u300b\u201d\u2019"']*$/u;
const safeBoundary = /[\u3002\uff01\uff1f!?\u3001\uff0c,\u30fb\uff1a:；;\s\u300d\u300f\u3011\uff09\)]$/u;
const asciiToken = /[A-Za-z0-9_]/u;
const predicateOnly = /^(?:入って|残って|映って|置かれて|表示されて|書かれて|続いて|揃って|含まれて|見えて|聞こえて|なって|分かって|できて|いる|いた|ある|あった|なる|なった|だった|です|ます|ました|する|した|している|できる|できた)[^\u3002\uff01\uff1f!?]{0,12}[\u3002\uff01\uff1f!?]$/u;
const structuredLine = (line) => /^\s*(?:[-*+>\u30fb\u2022\u25cf\u25a0\u25c6\u25c7\u25cb\u3010]|\d+[.\)\u3001\uff09]|[A-Z][.\uff1a:])/u.test(line)
  || /^\s*[^\u3002\uff01\uff1f!?\n]{1,16}[|\uff5c\uff1a:]/u.test(line)
  || /^\s*(?:\u300c[^\n]*\u300d|\u300e[^\n]*\u300f)\s*$/u.test(line);

const analyzeStep = (step, pagination) => {
  const errors = [];
  const pageTexts = pagination.pages.map((page) => page.text);
  if (pageTexts.join("") !== step.text) errors.push("source text mismatch");
  pagination.pages.forEach((page, index) => {
    if (!page.fits) errors.push(`page ${index + 1} does not fit`);
    if (page.lines > 3 || page.lines > page.maxLines) errors.push(`page ${index + 1} exceeds rendered line limit`);
    if (page.indicatorSafety < 12) errors.push(`page ${index + 1} indicator safety ${page.indicatorSafety}`);
  });
  if (pagination.pages.length > 1) {
    const last = pagination.pages.at(-1);
    const lastText = last.text.trim();
    if (last.lines < 2) errors.push("final page has fewer than two rendered lines");
    if (last.characters <= 12) errors.push("final page has at most twelve characters");
    if (last.lines === 1 && last.characters <= 22) errors.push("final page is a short single line");
    if (predicateOnly.test(lastText)) errors.push("final page contains only a predicate fragment");
  }

  const sourceGlyphs = Array.from(step.text);
  let offset = 0;
  for (let index = 0; index < pagination.pages.length - 1; index += 1) {
    offset += Array.from(pagination.pages[index].text).length;
    const left = sourceGlyphs[offset - 1] || "";
    const right = sourceGlyphs[offset] || "";
    const lineStart = step.text.lastIndexOf("\n", Math.max(0, offset - 1)) + 1;
    const nextNewline = step.text.indexOf("\n", offset);
    const lineEnd = nextNewline < 0 ? step.text.length : nextNewline;
    const line = step.text.slice(lineStart, lineEnd);
    const withinStructuredLine = structuredLine(line) && offset > lineStart && offset < lineEnd;
    if (asciiToken.test(left) && asciiToken.test(right)) errors.push(`boundary ${index + 1} splits an ASCII token`);
    if (withinStructuredLine && !sentenceEnd.test(pagination.pages[index].text.trimEnd())) {
      errors.push(`boundary ${index + 1} splits a structured line`);
    }
    if (!sentenceEnd.test(pagination.pages[index].text.trimEnd()) && !safeBoundary.test(left)) {
      errors.push(`boundary ${index + 1} is not a safe punctuation or line boundary`);
    }
  }
  return errors;
};

const browser = await chromium.launch({ headless: true, executablePath, args: ["--no-first-run", "--disable-background-networking"] });
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, reducedMotion: "reduce" });
    const page = await context.newPage();
    page.on("console", (message) => { if (message.type() === "error") report.consoleErrors.push(`${viewport.name}: ${message.text()}`); });
    page.on("pageerror", (error) => report.pageErrors.push(`${viewport.name}: ${error.message}`));
    page.on("response", (response) => { if (response.status() === 404) report.responses404.push(`${viewport.name}: ${response.url()}`); });
    await page.goto(routeUrl, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(globalThis.GaiaNovel?.inspectDialoguePagination), null, { timeout: 15_000 });
    await page.evaluate(({ progressKey, settingsKey, progress }) => {
      localStorage.setItem(progressKey, JSON.stringify(progress));
      localStorage.setItem(settingsKey, JSON.stringify({ messageSpeedPercent: 400, reducedMotion: true }));
    }, { progressKey: storageKey, settingsKey: configKey, progress: baseState });
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(globalThis.GaiaNovel?.inspectDialoguePagination), null, { timeout: 15_000 });
    await page.evaluate(() => globalThis.GaiaNovel.open());
    await page.locator("#novel-resume-button").click();
    await page.evaluate(() => document.fonts?.ready);
    const results = await page.evaluate((steps) => steps.map((step) => ({
      id: step.id,
      pagination: globalThis.GaiaNovel.inspectDialoguePagination(step.text),
    })), textSteps);
    const byId = new Map(results.map((result) => [result.id, result.pagination]));
    const failures = textSteps.flatMap((step) => {
      const pagination = byId.get(step.id);
      return analyzeStep(step, pagination).map((error) => ({ id: step.id, error, pagination }));
    });
    report.viewports[viewport.name] = {
      viewport,
      audited: results.length,
      multiPage: results.filter((result) => result.pagination.pages.length > 1).length,
      failures,
    };
    await context.close();
  }
  const failures = Object.values(report.viewports).flatMap((viewport) => viewport.failures);
  assert.equal(failures.length, 0, `${failures.length} pagination failures; first: ${JSON.stringify(failures[0])}`);
  assert.equal(report.consoleErrors.length, 0, `console errors: ${report.consoleErrors.join("\n")}`);
  assert.equal(report.pageErrors.length, 0, `page errors: ${report.pageErrors.join("\n")}`);
  assert.equal(report.responses404.length, 0, `404 responses: ${report.responses404.join("\n")}`);
  report.status = "passed";
} catch (error) {
  report.status = "failed";
  report.error = error.stack || String(error);
  throw error;
} finally {
  fs.writeFileSync(path.join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
  await browser.close();
}

console.log(`dialogue pagination check passed: ${textSteps.length} steps x ${viewports.length} viewports`);
