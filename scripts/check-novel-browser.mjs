import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [moduleArgument, executableArgument, outputArgument, baseUrlArgument] = process.argv.slice(2);
const moduleRoot = process.env.GAIA_PLAYWRIGHT_PATH || moduleArgument;
const executablePath = process.env.GAIA_BROWSER_EXECUTABLE || executableArgument;
const baseUrl = process.env.GAIA_BASE_URL || baseUrlArgument || "http://127.0.0.1:4173";
const outputDir = path.resolve(process.env.GAIA_BROWSER_ARTIFACTS || outputArgument || "artifacts/novel-browser");
const standaloneOnly = process.argv.includes("--standalone-only");

if (!moduleRoot || !executablePath) {
  throw new Error("GAIA_PLAYWRIGHT_PATH and GAIA_BROWSER_EXECUTABLE are required.");
}

const { chromium } = await import(pathToFileURL(path.join(moduleRoot, "index.mjs")));
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ["--no-first-run", "--disable-background-networking"],
});

const report = {
  baseUrl,
  routes: [],
  screenshots: [],
  consoleErrors: [],
  pageErrors: [],
  visitorTextLeaks: [],
  mobile: null,
};

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const screenshot = async (page, name) => {
  const destination = path.join(outputDir, `${name}.png`);
  await page.screenshot({ path: destination, fullPage: false, animations: "disabled", timeout: 90000 });
  report.screenshots.push(destination);
};

const attachDiagnostics = (page, label) => {
  page.on("console", (message) => {
    if (message.text().includes("E2E_VISITOR_TEXT_")) {
      report.visitorTextLeaks.push(`${label}: console: ${message.text()}`);
    }
    if (message.type() === "error") report.consoleErrors.push(`${label}: ${message.text()}`);
  });
  page.on("pageerror", (error) => report.pageErrors.push(`${label}: ${error.message}`));
  page.on("request", (request) => {
    const payload = `${request.url()}\n${request.postData() || ""}`;
    if (payload.includes("E2E_VISITOR_TEXT_")) {
      report.visitorTextLeaks.push(`${label}: request: ${request.method()} ${request.url()}`);
    }
  });
};

const currentStep = (page) => page.evaluate(() => {
  const layer = document.querySelector("#novel-layer");
  const stepId = layer?.dataset.stepId || "";
  const step = globalThis.GAIA_NOVEL_STORY_V6?.scenes
    ?.flatMap((scene) => scene.steps)
    ?.find((candidate) => candidate.id === stepId);
  return step ? {
    id: step.id,
    sceneId: step.sceneId,
    type: step.type,
    choiceId: step.choiceId || null,
    options: step.options?.map((option) => option.value) || [],
    interaction: step.interaction?.kind || null,
  } : null;
});

const waitForStepChange = async (page, previousId) => {
  await page.waitForFunction(
    (stepId) => document.querySelector("#novel-layer")?.dataset.stepId !== stepId,
    previousId,
    { timeout: 5000 },
  );
};

const advanceLinearStep = async (page, step) => {
  await page.locator("#novel-dialogue").dispatchEvent("click");
  if ((await currentStep(page))?.id === step.id) {
    await page.locator("#novel-dialogue").dispatchEvent("click");
  }
  await waitForStepChange(page, step.id);
};

const clickChoice = async (page, step, value) => {
  const index = step.options.indexOf(value);
  assert(index >= 0, `Choice ${step.choiceId} does not include ${value}.`);
  await page.locator("#novel-choices button").nth(index).click();
  await waitForStepChange(page, step.id);
};

const elementBounds = (page, selector) => page.evaluate((targetSelector) => {
  const rectangle = document.querySelector(targetSelector)?.getBoundingClientRect();
  return rectangle ? { x: rectangle.x, y: rectangle.y, width: rectangle.width, height: rectangle.height } : null;
}, selector);

const completeInteraction = async (page, step, capturePrefix = "") => {
  console.log(`interaction: ${step.interaction}`);
  await page.locator("#novel-choices .novel-interaction-open").click();
  await page.locator("#novel-mode-bridge").waitFor({ state: "visible" });

  if (step.interaction === "gx") {
    await page.locator("#gx-layer").waitFor({ state: "visible" });
    await page.locator("#gx-loading").waitFor({ state: "hidden" });
    await page.waitForTimeout(180);
    if (capturePrefix) await screenshot(page, `${capturePrefix}-gx-deep-time`);
    if (await page.locator("#novel-mode-bridge-controls button").count()) {
      for (let index = 0; index < 3; index += 1) {
        await page.locator("#novel-mode-bridge-controls button").first().click();
        console.log(`gx key step ${index + 1}: ${await page.locator("#novel-mode-bridge-progress").innerText()}`);
      }
    } else {
      const bounds = await elementBounds(page, "#gx-canvas");
      assert(bounds, "GX canvas is not visible.");
      for (let index = 0; index < 3; index += 1) {
        const x = bounds.x + bounds.width * 0.6;
        const y = bounds.y + bounds.height * 0.5;
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x + 12, y + 4);
        await page.mouse.up();
        await page.waitForTimeout(100);
        console.log(`gx gesture ${index + 1}: ${await page.locator("#novel-mode-bridge-progress").innerText()}`);
      }
    }
  } else if (step.interaction === "map03") {
    if (capturePrefix) await screenshot(page, `${capturePrefix}-mode03-map`);
    for (let index = 0; index < 3; index += 1) {
      await page.locator("#novel-mode-bridge-controls button").nth(index).click();
      await page.waitForTimeout(20);
    }
  } else if (step.interaction === "abstract07") {
    await page.waitForTimeout(120);
    await page.locator("#gaia-canvas").press("Enter");
    for (let index = 0; index < 2; index += 1) {
      await page.locator("#novel-mode-bridge-controls button").nth(index).click();
      await page.waitForTimeout(20);
    }
    if (capturePrefix) await screenshot(page, `${capturePrefix}-mode07-abstract`);
  } else if (step.interaction === "map08") {
    for (let index = 0; index < 3; index += 1) {
      await page.locator("#novel-mode-bridge-controls button").nth(index).click();
      await page.waitForTimeout(20);
    }
    if (capturePrefix) await screenshot(page, `${capturePrefix}-mode08-layers`);
  } else if (step.interaction === "space10") {
    await page.locator("#space-layer").waitFor({ state: "visible" });
    const bounds = await elementBounds(page, "#space-canvas");
    assert(bounds, "Space canvas is not visible.");
    await page.mouse.click(bounds.x + bounds.width * 0.5, bounds.y + bounds.height * 0.5);
    if (capturePrefix) await screenshot(page, `${capturePrefix}-mode10-space`);
  } else {
    throw new Error(`Unknown interaction ${step.interaction}.`);
  }

  const returnButton = page.locator("#novel-mode-bridge-return");
  await returnButton.waitFor({ state: "visible" });
  assert(await returnButton.isEnabled(), `${step.interaction} did not satisfy its completion condition.`);
  await returnButton.click();
  await waitForStepChange(page, step.id);
};

const storageContains = (page, needle) => page.evaluate((value) => {
  for (let index = 0; index < localStorage.length; index += 1) {
    const stored = localStorage.getItem(localStorage.key(index));
    if (stored?.includes(value)) return true;
  }
  return false;
}, needle);

const enterNovelFromOpening = async (page) => {
  if (!(await page.locator("#gaia-opening").isVisible())) {
    const storyButton = page.locator("#intro-layer [data-novel-open]").first();
    await storyButton.waitFor({ state: "visible" });
    await storyButton.click();
    await page.locator("#novel-title-screen").waitFor({ state: "visible" });
    return;
  }
  const soundOff = page.locator("#gaia-opening-sound-off");
  if (await soundOff.isVisible()) await soundOff.click();
  const skip = page.locator("#gaia-opening-skip");
  await skip.waitFor({ state: "visible" });
  await skip.click();
  const storyRoute = page.locator("#gaia-opening-route-story");
  await storyRoute.waitFor({ state: "visible" });
  await storyRoute.click();
  await page.waitForFunction(() => !document.body.classList.contains("gaia-opening-active"));
  await page.locator("#novel-title-screen").waitFor({ state: "visible" });
};

const playRoute = async (page, route, index, { captureMajor = false } = {}) => {
  console.log(`route ${index + 1}: ${route.editorial} x ${route.visitor}`);
  const prefix = `route-${index + 1}`;
  const visitorMarker = `E2E_VISITOR_TEXT_${index + 1}`;
  const visited = [];
  let manualSaveChecked = false;
  let reloadChecked = false;
  let evesRewindChecked = false;
  let safety = 0;

  while (safety < 420) {
    safety += 1;
    const step = await currentStep(page);
    assert(step, "Novel runtime did not expose the current stable step.");
    visited.push(step.id);

    if (index === 0 && !manualSaveChecked && ["narration", "dialogue", "chat", "record", "ui", "transition", "details"].includes(step.type)) {
      const savedStepId = step.id;
      await page.locator("#novel-save-button").click();
      await page.locator("#novel-save-panel").waitFor({ state: "visible" });
      await page.locator(".novel-save-primary").first().click();
      assert((await page.locator("#novel-save-status").innerText()).includes("入力本文は含まれません"), "Manual save did not disclose the visitor-text boundary.");
      await page.locator("#novel-save-close").click();
      await advanceLinearStep(page, step);
      const advancedStep = await currentStep(page);
      await page.locator("#novel-load-button").click();
      await page.locator("#novel-save-panel").waitFor({ state: "visible" });
      await page.locator(".novel-save-primary").first().click();
      await page.waitForFunction((expected) => document.querySelector("#novel-layer")?.dataset.stepId === expected, savedStepId);
      assert(advancedStep?.id !== savedStepId, "Manual-save test did not advance before loading.");
      manualSaveChecked = true;
      continue;
    }

    if (step.type === "choice") {
      const selected = step.choiceId === "observation_order"
        ? "LOCAL_FIRST"
        : step.choiceId === "editorial_choice"
          ? route.editorial
          : route.visitor;
      await clickChoice(page, step, selected);
    } else if (step.type === "interaction") {
      await completeInteraction(page, step, captureMajor ? prefix : "");
    } else if (step.type === "visitorInput") {
      assert((await page.locator(".novel-visitor-policy").innerText()).includes("サーバー送信なし"), "Visitor privacy policy is missing.");
      if (route.visitor === "WRITE") await page.locator("#novel-visitor-post").fill(visitorMarker);
      assert(!(await storageContains(page, visitorMarker)), "Visitor draft leaked into localStorage before the final choice.");
      if (index === 0 && !reloadChecked) {
        await page.locator("#novel-save-button").click();
        await page.locator("#novel-save-panel").waitFor({ state: "visible" });
        await page.locator(".novel-save-primary").first().click();
        await page.locator(".novel-save-primary").first().click();
        await page.locator("#novel-save-close").click();
        assert(!(await storageContains(page, visitorMarker)), "Visitor draft leaked into a manual save.");
        await page.reload({ waitUntil: "networkidle" });
        await enterNovelFromOpening(page);
        await page.locator("#novel-resume-button").waitFor({ state: "visible" });
        await page.locator("#novel-resume-button").click();
        await page.waitForFunction(() => document.querySelector("#novel-layer")?.dataset.stepType === "visitorInput");
        assert((await page.locator("#novel-visitor-post").inputValue()) === "", "Visitor draft was restored after reload.");
        await page.locator("#novel-visitor-post").fill(visitorMarker);
        reloadChecked = true;
      }
      if (captureMajor) await screenshot(page, `${prefix}-visitor-input`);
      await page.getByRole("button", { name: "WRITE / LEAVE EMPTYの選択へ" }).click();
      await waitForStepChange(page, step.id);
    } else if (step.type === "result") {
      if (index === 0) {
        report.resultGeometry = await page.evaluate(() => {
          const measure = (selector) => {
            const rectangle = document.querySelector(selector)?.getBoundingClientRect();
            return rectangle ? { left: rectangle.left, right: rectangle.right, width: rectangle.width } : null;
          };
          const rightPoint = document.elementFromPoint(window.innerWidth - 80, window.innerHeight / 2);
          return {
            viewportWidth: window.innerWidth,
            experience: measure(".experience"),
            layer: measure("#novel-layer"),
            runtime: measure("#novel-runtime"),
            dialogue: measure("#novel-dialogue"),
            rightPoint: rightPoint ? `${rightPoint.tagName.toLowerCase()}#${rightPoint.id}.${rightPoint.className}` : null,
          };
        });
      }
      const heading = await page.locator(".novel-final-result h3").innerText();
      assert(heading === `${route.editorial} × ${route.visitor}`, `Unexpected final result: ${heading}`);
      const resultText = await page.locator(".novel-final-result").innerText();
      assert(route.visitor === "WRITE" ? resultText.includes(visitorMarker) : !resultText.includes("E2E_VISITOR_TEXT"), "Visitor result text is incorrect.");
      assert(!(await storageContains(page, visitorMarker)), "Visitor draft leaked into localStorage at the final result.");
      if (index === 0) {
        await page.locator("#novel-eves-button").click();
        await page.locator("#novel-eves-panel").waitFor({ state: "visible" });
        assert((await page.locator("#novel-eves-history li").count()) === 2, "E.V.E.S. did not render both decisions.");
        assert((await page.locator("#novel-eves-current").innerText()).includes("SOURCE RECORD × WRITE"), "E.V.E.S. current path is incorrect.");
        assert((await page.locator("#novel-eves-graph svg").count()) === 1, "E.V.E.S. graph is missing.");
        await page.locator("#novel-eves-close").click();
      }
      if (index === 2 && !evesRewindChecked) {
        await page.locator("#novel-eves-button").click();
        await page.locator("#novel-eves-panel").waitFor({ state: "visible" });
        await page.locator("#novel-eves-rewind").click();
        await page.waitForFunction(() => document.querySelector("#novel-layer")?.dataset.stepType === "choice");
        const rewoundChoice = await currentStep(page);
        assert(rewoundChoice?.choiceId === "visitor_action", "E.V.E.S. rewind did not return to the final decision.");
        await clickChoice(page, rewoundChoice, "WRITE");
        assert((await currentStep(page))?.type === "visitorInput", "WRITE without a draft did not return to the visitor input.");
        assert((await page.locator("#novel-visitor-post").inputValue()) === "", "E.V.E.S. rewind did not discard the visitor draft.");
        await page.locator("#novel-visitor-post").fill(visitorMarker);
        const inputStep = await currentStep(page);
        await page.getByRole("button", { name: "WRITE / LEAVE EMPTYの選択へ" }).click();
        await waitForStepChange(page, inputStep.id);
        await clickChoice(page, await currentStep(page), "WRITE");
        evesRewindChecked = true;
        continue;
      }
      await screenshot(page, `${prefix}-${route.editorial.toLowerCase()}-${route.visitor.toLowerCase()}`);
      await page.getByRole("button", { name: "展示ホールへ戻る" }).click();
      await waitForStepChange(page, step.id);
    } else if (step.type === "end") {
      const endText = await page.locator(".novel-end-v6").innerText();
      assert(endText.includes("本文は消えます"), "End screen does not explain visitor-text disposal.");
      if (captureMajor) await screenshot(page, `${prefix}-end`);
      await page.getByRole("button", { name: "STARTへ戻る（本文を破棄）" }).click();
      await page.locator("#novel-title-screen").waitFor({ state: "visible" });
      assert(!(await page.locator("body").innerText()).includes(visitorMarker), "Visitor text remained visible after returning to START.");
      assert(!(await storageContains(page, visitorMarker)), "Visitor text remained in localStorage after returning to START.");
      report.routes.push({ ...route, visitedSteps: visited.length, final: `${route.editorial} × ${route.visitor}` });
      return;
    } else {
      await advanceLinearStep(page, step);
    }
  }
  throw new Error(`Route ${index + 1} exceeded the step safety limit.`);
};

const routes = [
  { editorial: "SOURCE_RECORD", visitor: "WRITE" },
  { editorial: "SOURCE_RECORD", visitor: "LEAVE_EMPTY" },
  { editorial: "DISCLOSE_DERIVATION", visitor: "WRITE" },
  { editorial: "DISCLOSE_DERIVATION", visitor: "LEAVE_EMPTY" },
];

try {
  if (!standaloneOnly) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: "ja-JP" });
  const page = await context.newPage();
  attachDiagnostics(page, "desktop");
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await enterNovelFromOpening(page);
  assert((await page.locator("#novel-title-privacy").innerText()).includes("サーバーへ送りません"), "START privacy notice is missing.");
  await screenshot(page, "desktop-title");

  for (let index = 0; index < routes.length; index += 1) {
    await page.getByRole("button", { name: "START", exact: true }).click();
    await page.locator("#novel-runtime").waitFor({ state: "visible" });
    if (index === 0) await screenshot(page, "desktop-opening-notice");
    await playRoute(page, routes[index], index, { captureMajor: index === 0 });
  }

  const stats = await page.locator("#novel-event-stats").innerText();
  assert(stats.includes("4 セッション"), `Unexpected event session stats: ${stats}`);
  assert(stats.includes("WRITE 2") && stats.includes("LEAVE EMPTY 2"), `Unexpected event action stats: ${stats}`);
  assert((await page.locator(".novel-event-markers span.is-write").count()) === 2, "WRITE markers are incorrect.");
  assert((await page.locator(".novel-event-markers span.is-empty").count()) === 2, "LEAVE EMPTY markers are incorrect.");
  await screenshot(page, "desktop-title-event-trace");
  await page.locator("#novel-config-button").click();
  await page.locator("#novel-config-panel").waitFor({ state: "visible" });
  await page.locator("#novel-event-reset").click();
  assert((await page.locator("#novel-event-reset").innerText()).includes("もう一度"), "Event deletion did not require confirmation.");
  await page.locator("#novel-event-reset").click();
  assert((await page.locator("#novel-event-reset-status").innerText()).includes("消去しました"), "Event deletion did not complete.");
  assert((await page.locator("#novel-event-stats").innerText()).includes("0 セッション"), "Event counters were not cleared.");
  await page.locator("#novel-config-close").click();
  await context.close();

  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    locale: "ja-JP",
    reducedMotion: "reduce",
  });
  const mobile = await mobileContext.newPage();
  attachDiagnostics(mobile, "mobile");
  await mobile.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await enterNovelFromOpening(mobile);
  await screenshot(mobile, "mobile-title");
  await mobile.getByRole("button", { name: "START", exact: true }).click();
  await mobile.locator("#novel-runtime").waitFor({ state: "visible" });
  await playRoute(mobile, routes[2], 4);
  const overflow = await mobile.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }));
  assert(overflow.documentWidth <= overflow.viewportWidth + 1, `Mobile horizontal overflow: ${JSON.stringify(overflow)}`);
  report.mobile = overflow;
  await mobileContext.close();
  }

  const smokeContext = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: "ja-JP", reducedMotion: "reduce" });
  const smoke = await smokeContext.newPage();
  attachDiagnostics(smoke, "standalone");
  const showIntroPathStage = async () => {
    const soundCard = smoke.locator("#intro-layer [data-sound-gallery-open]");
    if (await soundCard.isVisible()) return;
    const pathBack = smoke.locator("#intro-path-back");
    if (await pathBack.isVisible()) await pathBack.click();
    else await smoke.locator("#intro-button").click();
    await soundCard.waitFor({ state: "visible" });
  };
  await smoke.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await smoke.locator("#intro-layer").waitFor({ state: "visible" });
  assert((await smoke.locator(".intro-mode-choice").count()) === 10, "Main menu does not expose all ten modes.");

  await smoke.locator("#intro-gx-feature").click();
  await smoke.locator("#gx-layer").waitFor({ state: "visible" });
  await smoke.keyboard.press("Escape");
  await smoke.locator("#gx-layer").waitFor({ state: "hidden" });
  await showIntroPathStage();

  await smoke.locator("#intro-layer [data-sound-gallery-open]").click();
  await smoke.locator("#sound-layer").waitFor({ state: "visible" });
  await smoke.locator("#sound-close").click();
  await smoke.locator("#sound-layer").waitFor({ state: "hidden" });
  await showIntroPathStage();

  await smoke.locator('[data-intro-path="map"]').click();
  await smoke.locator(".intro-mode-choice").nth(2).waitFor({ state: "visible" });
  await smoke.locator(".intro-mode-choice").nth(2).click();
  await smoke.locator("#intro-layer").waitFor({ state: "hidden" });
  await smoke.locator("#japan-layer").waitFor({ state: "visible" });
  await smoke.locator("#japan-map").focus();
  await smoke.keyboard.press("Enter");
  await smoke.locator("#japan-close").click();
  await smoke.locator("#japan-layer").waitFor({ state: "hidden" });
  await showIntroPathStage();

  await smoke.locator('[data-intro-path="abstract"]').click();
  await smoke.locator(".intro-mode-choice").nth(6).waitFor({ state: "visible" });
  await smoke.locator(".intro-mode-choice").nth(6).click();
  await smoke.locator("#intro-layer").waitFor({ state: "hidden" });
  await smoke.locator("#gaia-canvas").focus();
  await smoke.keyboard.press("Enter");
  await smoke.locator("#space-button").click();
  await smoke.locator("#space-layer").waitFor({ state: "visible" });
  await smoke.locator("#space-close").click();
  await smoke.locator("#space-layer").waitFor({ state: "hidden" });
  await smoke.locator("#intro-layer").waitFor({ state: "visible" });

  await smoke.evaluate(() => localStorage.setItem("gaiaSensewareNovel:v5", JSON.stringify({ sceneIndex: 999 })));
  await smoke.reload({ waitUntil: "networkidle" });
  await enterNovelFromOpening(smoke);
  await smoke.locator("#novel-legacy-notice").waitFor({ state: "visible" });
  report.standalone = { mainMenu: true, gx: true, map: true, abstract: true, space: true, sound: true, legacySave: true };
  await smokeContext.close();

  const actionableConsoleErrors = report.consoleErrors.filter((entry) => !entry.includes("favicon.ico"));
  assert(report.pageErrors.length === 0, `Page errors: ${report.pageErrors.join(" | ")}`);
  assert(actionableConsoleErrors.length === 0, `Console errors: ${actionableConsoleErrors.join(" | ")}`);
  assert(report.visitorTextLeaks.length === 0, `Visitor text leaks: ${report.visitorTextLeaks.join(" | ")}`);
  report.status = "passed";
} catch (error) {
  report.status = "failed";
  report.failure = error instanceof Error ? error.stack : String(error);
  throw error;
} finally {
  await writeFile(path.join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  await browser.close();
}

  console.log(standaloneOnly
    ? "standalone UI smoke check passed"
    : "novel browser check passed: 4 desktop routes + 1 mobile reduced-motion rerun");
console.log(`screenshots: ${report.screenshots.length} in ${outputDir}`);
