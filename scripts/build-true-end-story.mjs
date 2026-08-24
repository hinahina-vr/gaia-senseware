import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readApprovedStoryScript } from "./approved-story-script.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(projectRoot, "true-end-data.js");
const checkOnly = process.argv.includes("--check");
const speakerForLabel = Object.freeze({
  AIVA: "system",
  ルウ: "lou",
  あめ: "amane",
  みず: "mizuha",
  saku: "sakuya",
  プレイヤー: "visitor",
  "—": null,
});

const approved = readApprovedStoryScript();
const scenes = approved.trueEndScenes.map((scene) => ({
  id: scene.id,
  number: scene.number,
  title: scene.title,
  backdrop: scene.backdrop,
  steps: scene.entries.map((entry) => {
    const speaker = speakerForLabel[entry.speakerLabel];
    if (speaker === undefined) throw new Error(`${entry.id}: 未対応のNOVACENE話者です（${entry.speakerLabel}）`);
    const pages = entry.metadata?.pages;
    if (pages !== undefined && (
      !Array.isArray(pages)
      || pages.length < 2
      || pages.some((page) => typeof page !== "string" || !page)
      || pages.join("") !== entry.text
    )) {
      throw new Error(`${entry.id}: pagesは本文を欠落なく分けた2ページ以上の文字列配列にしてください`);
    }
    return {
      ...(speaker ? { speaker } : {}),
      text: entry.text,
      ...(entry.readout ? { readout: entry.readout } : {}),
      ...(entry.metadata || {}),
    };
  }),
}));

const story = {
  storyVersion: "true-end-approved-script-v5",
  approvedSourceSha256: approved.sha256,
  title: "NOVACENE",
  subtitle: "惑星の放課後 / GAIA SENSATION — NOVACENE",
  language: {
    id: "saeliva",
    name: "SÆLIVA",
    nativeName: "SÆL·IVA",
    japaneseName: "セイリヴァ",
    htmlLang: "art-x-saeliva",
  },
  elapsed: "2,704,118 HARA",
  scenes,
  finale: {
    label: "星々の放課後",
    title: "NOVACENE",
    readout: [
      "DÆM UL: ESHA·GEMA",
      "IVARA KERA: K 2.700",
      "SÆL·ORAI: 2,641,903 NETH",
      "ESHA SÆL·TIR: KAR·EN",
      "NÆI MIR: REA·AI",
    ],
  },
};

const serialized = JSON.stringify(story, null, 2);
const output = `// Generated from story/APPROVED_SCRIPT_2026-08-24.md by scripts/build-true-end-story.mjs. Do not edit by hand.\n(() => {\n  "use strict";\n\n  const freezeScene = (scene) => Object.freeze({\n    ...scene,\n    steps: Object.freeze(scene.steps.map((step, index) => Object.freeze({\n      ...step,\n      id: \`beyond_\${scene.number}_\${String(index + 1).padStart(3, "0")}\`,\n      sceneId: scene.id,\n      sceneTitle: scene.title,\n      type: "beyond",\n      recordType: "BEYOND",\n      ...(step.speaker === "system" ? { speakerLabel: "AIVA" } : {}),\n    }))),\n  });\n\n  const source = ${serialized};\n  globalThis.GAIA_TRUE_END_STORY = Object.freeze({\n    ...source,\n    language: Object.freeze(source.language),\n    scenes: Object.freeze(source.scenes.map(freezeScene)),\n    finale: Object.freeze({\n      ...source.finale,\n      readout: Object.freeze(source.finale.readout),\n    }),\n  });\n})();\n`;

if (checkOnly) {
  if (!fs.existsSync(outputPath) || fs.readFileSync(outputPath, "utf8") !== output) {
    throw new Error("true-end-data.jsが承認済み台本と一致しません。npm run data:novelを実行してください");
  }
  console.log(`approved true-end story ok: ${scenes.length} scenes / ${scenes.flatMap((scene) => scene.steps).length} messages`);
} else {
  fs.writeFileSync(outputPath, output, "utf8");
  console.log(`wrote ${path.relative(projectRoot, outputPath)} (${scenes.length} scenes, ${scenes.flatMap((scene) => scene.steps).length} messages)`);
}
