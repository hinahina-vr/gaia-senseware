(() => {
  "use strict";

  const layer = document.querySelector("#sound-layer");
  if (!layer) return;

  const closeButton = document.querySelector("#sound-close");
  const playButton = document.querySelector("#sound-play");
  const progress = document.querySelector("#sound-progress");
  const currentTime = document.querySelector("#sound-current-time");
  const duration = document.querySelector("#sound-duration");
  const volume = document.querySelector("#sound-volume");
  const volumeValue = document.querySelector("#sound-volume-value");
  const trackNumber = document.querySelector("#sound-track-number");
  const trackTitle = document.querySelector("#sound-track-title");
  const description = document.querySelector("#sound-mode-description");
  const visualizerCanvas = document.querySelector("#sound-visualizer");
  const trackButtons = Array.from(document.querySelectorAll("[data-sound-track]"));
  const openButtons = Array.from(document.querySelectorAll("[data-sound-gallery-open]"));

  const constellationPatterns = Object.freeze([
    { paths: [[[5, 40], [15, 12], [29, 23], [43, 8], [55, 29]], [[29, 23], [35, 43]]], faint: [[9, 21], [48, 39], [22, 6]] },
    { paths: [[[5, 17], [17, 7], [31, 18], [52, 11]], [[31, 18], [42, 41], [19, 35], [5, 17]]], faint: [[9, 31], [55, 26], [29, 42]] },
    { paths: [[[5, 35], [13, 11], [31, 6], [49, 18], [55, 39]], [[31, 6], [29, 31], [13, 39]]], faint: [[6, 8], [42, 34], [53, 6]] },
    { paths: [[[5, 11], [22, 7], [35, 20], [54, 13]], [[35, 20], [45, 43], [25, 36], [10, 42]]], faint: [[14, 22], [51, 31], [34, 4]] },
    { paths: [[[4, 25], [15, 8], [30, 15], [51, 7]], [[30, 15], [47, 32], [36, 44], [18, 36], [4, 25]]], faint: [[7, 41], [25, 29], [55, 20]] },
    { paths: [[[5, 18], [20, 7], [35, 13], [53, 31]], [[20, 7], [28, 31], [45, 42]], [[28, 31], [11, 39]]], faint: [[51, 12], [6, 29], [35, 42]] },
    { paths: [[[5, 39], [11, 13], [29, 6], [51, 19], [43, 41]], [[11, 13], [29, 29], [43, 41]]], faint: [[5, 7], [54, 37], [24, 43]] },
    { paths: [[[4, 23], [16, 7], [32, 14], [53, 9]], [[32, 14], [51, 34], [34, 43], [14, 35], [4, 23]]], faint: [[7, 40], [43, 24], [25, 4]] },
    { paths: [[[5, 39], [17, 8], [35, 13], [52, 6]], [[17, 8], [25, 27], [43, 41], [55, 25]]], faint: [[7, 18], [35, 32], [50, 43]] },
    { paths: [[[5, 14], [24, 6], [43, 13], [55, 30]], [[24, 6], [31, 27], [45, 43]], [[31, 27], [12, 38]]], faint: [[7, 28], [52, 6], [27, 42]] },
    { paths: [[[4, 35], [10, 11], [28, 6], [49, 17], [55, 36]], [[28, 6], [36, 29], [22, 42], [4, 35]]], faint: [[5, 6], [48, 41], [16, 25]] },
    { paths: [[[4, 19], [18, 7], [36, 11], [54, 27]], [[18, 7], [24, 31], [43, 42]], [[24, 31], [8, 41]]], faint: [[7, 29], [49, 8], [33, 35]] },
  ]);

  const setupSoundMorphPrototype = () => {
    const svgNamespace = "http://www.w3.org/2000/svg";
    layer.classList.add("sound-morph-prototype");

    const nowPlaying = layer.querySelector(".sound-now-playing");
    if (nowPlaying instanceof HTMLElement && !nowPlaying.querySelector(".sound-cover-art")) {
      const cover = document.createElement("span");
      cover.className = "sound-cover-art";
      cover.setAttribute("aria-hidden", "true");
      const coverImage = document.createElement("img");
      coverImage.src = "./assets/visuals-07/sound-archive-bg-v2.png?v=gaia-sound-linked-ink-1";
      coverImage.alt = "";
      cover.append(coverImage);
      nowPlaying.prepend(cover);
    }

    const trackPanel = layer.querySelector(".sound-track-panel");
    if (trackPanel instanceof HTMLElement && !trackPanel.querySelector(".sound-track-chapters")) {
      const chapters = document.createElement("div");
      chapters.className = "sound-track-chapters";
      chapters.setAttribute("aria-hidden", "true");
      ["OPENING", "STORY", "OBSERVATION", "NIGHT"].forEach((label) => {
        const chapter = document.createElement("span");
        chapter.textContent = label;
        chapters.append(chapter);
      });
      trackPanel.prepend(chapters);
    }

    const transport = layer.querySelector(".sound-transport");
    if (transport instanceof HTMLElement && !transport.querySelector(".sound-player-signal")) {
      const signalCanvas = document.createElement("canvas");
      signalCanvas.className = "sound-player-signal";
      signalCanvas.setAttribute("aria-hidden", "true");
      signalCanvas.dataset.renderer = "audio-waveform-ribbon";
      transport.append(signalCanvas);
    }

    trackButtons.forEach((button, index) => {
      const number = button.querySelector(":scope > span");
      const copy = button.querySelector(":scope > div");
      const title = copy?.querySelector("strong");
      const meta = copy?.querySelector("small");
      if (!(number instanceof HTMLElement) || !(copy instanceof HTMLElement) || !(title instanceof HTMLElement)) return;

      number.classList.add("sound-track-index");
      copy.classList.add("sound-track-copy");
      title.classList.add("sound-track-name");
      meta?.classList.add("sound-track-meta");
      button.setAttribute("aria-label", `${number.textContent?.trim() || ""} ${title.textContent?.trim() || ""}`.trim());
      const titleCharacters = Array.from(title.textContent?.trim() || "");
      const titleContainsJapanese = titleCharacters.some((character) => /[\u3040-\u30ff\u3400-\u9fff]/u.test(character));
      const focusWidth = Math.max(520, Math.min(850, (titleContainsJapanese ? titleCharacters.length * 76 : titleCharacters.length * 32) + 72));
      button.style.setProperty("--sound-focus-width", `${Math.round(focusWidth)}px`);

      const glyph = document.createElement("span");
      glyph.className = "sound-track-constellation";
      glyph.setAttribute("aria-hidden", "true");
      glyph.style.setProperty("--constellation-drift-duration", `${6.8 + (index % 5) * 0.73}s`);
      glyph.style.setProperty("--constellation-drift-delay", `${-0.61 * index}s`);
      glyph.style.setProperty("--constellation-twinkle-duration", `${4.35 + (index % 4) * 0.46}s`);
      glyph.style.setProperty("--constellation-twinkle-slow", `${5.8 + (index % 4) * 0.54}s`);
      glyph.style.setProperty("--constellation-twinkle-fast", `${3.55 + (index % 4) * 0.38}s`);
      glyph.style.setProperty("--constellation-line-duration", `${6.2 + (index % 5) * 0.61}s`);
      glyph.style.setProperty("--constellation-twinkle-delay", `${-0.29 * index}s`);
      const glyphSvg = document.createElementNS(svgNamespace, "svg");
      glyphSvg.setAttribute("viewBox", "0 0 60 48");
      const pattern = constellationPatterns[index % constellationPatterns.length];
      pattern.paths.forEach((path) => {
        const trace = document.createElementNS(svgNamespace, "polyline");
        trace.setAttribute("points", path.map(([x, y]) => `${x},${y}`).join(" "));
        glyphSvg.append(trace);
      });
      const points = pattern.paths.flat();
      points.forEach(([cx, cy], pointIndex) => {
        const star = document.createElementNS(svgNamespace, "circle");
        star.setAttribute("cx", String(cx));
        star.setAttribute("cy", String(cy));
        star.setAttribute("r", pointIndex % 5 === 0 ? "2.45" : "1.65");
        glyphSvg.append(star);
      });
      pattern.faint.forEach(([cx, cy]) => {
        const star = document.createElementNS(svgNamespace, "circle");
        star.classList.add("is-faint");
        star.setAttribute("cx", String(cx));
        star.setAttribute("cy", String(cy));
        star.setAttribute("r", "0.75");
        glyphSvg.append(star);
      });
      glyph.append(glyphSvg);

      const morphCanvas = document.createElement("canvas");
      morphCanvas.className = "sound-track-morph-canvas";
      morphCanvas.dataset.title = title.textContent?.trim() || "";
      morphCanvas.setAttribute("aria-hidden", "true");
      copy.prepend(morphCanvas);
      button.prepend(glyph);
    });

    const clamp = (value, minimum = 0, maximum = 1) => Math.max(minimum, Math.min(maximum, value));
    const easeOutCubic = (value) => 1 - Math.pow(1 - clamp(value), 3);
    const easeInOutCubic = (value) => {
      const t = clamp(value);
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };
    const morphGeometryCache = new WeakMap();

    const simplifyPath = (points, tolerance = 1.15) => {
      if (points.length < 3) return points;
      const first = points[0];
      const last = points[points.length - 1];
      const dx = last.x - first.x;
      const dy = last.y - first.y;
      const lengthSquared = dx * dx + dy * dy;
      let furthestDistance = 0;
      let furthestIndex = 0;
      for (let index = 1; index < points.length - 1; index += 1) {
        const point = points[index];
        const ratio = lengthSquared > 0
          ? clamp(((point.x - first.x) * dx + (point.y - first.y) * dy) / lengthSquared)
          : 0;
        const projectedX = first.x + ratio * dx;
        const projectedY = first.y + ratio * dy;
        const distance = Math.hypot(point.x - projectedX, point.y - projectedY);
        if (distance > furthestDistance) {
          furthestDistance = distance;
          furthestIndex = index;
        }
      }
      if (furthestDistance <= tolerance) return [first, last];
      return [
        ...simplifyPath(points.slice(0, furthestIndex + 1), tolerance).slice(0, -1),
        ...simplifyPath(points.slice(furthestIndex), tolerance),
      ];
    };

    const buildGlyphGeometry = (canvas, width, height, title) => {
      const cached = morphGeometryCache.get(canvas);
      const cacheKey = `${width}:${height}:${title}`;
      if (cached?.key === cacheKey) return cached;

      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = width;
      maskCanvas.height = height;
      const mask = maskCanvas.getContext("2d", { willReadFrequently: true });
      const maxWidth = Math.max(40, width - 34);
      const fontFamily = '"Yu Gothic UI", "Yu Gothic", "Hiragino Kaku Gothic ProN", "Noto Sans CJK JP", sans-serif';
      let fontSize = Math.min(82, Math.max(42, height * 0.68));
      mask.font = `300 ${fontSize}px ${fontFamily}`;
      const characters = Array.from(title);
      const measureCharacters = () => characters.reduce((total, character) => total + mask.measureText(character).width, 0);
      const initialWidth = Math.max(1, measureCharacters());
      if (initialWidth > maxWidth) fontSize *= maxWidth / initialWidth;
      mask.font = `300 ${fontSize}px ${fontFamily}`;
      mask.textAlign = "left";
      mask.textBaseline = "middle";
      mask.fillStyle = "#fff";
      const textLeft = 17;
      const textY = height * 0.46;
      const naturalWidth = measureCharacters();
      const containsJapanese = /[\u3040-\u30ff\u3400-\u9fff]/u.test(title);
      const trackingLimit = containsJapanese ? 18 : 3.5;
      const tracking = characters.length > 1
        ? clamp((maxWidth * 0.96 - naturalWidth) / (characters.length - 1), 0, trackingLimit)
        : 0;
      let textCursor = textLeft;
      const characterBoxes = [];
      characters.forEach((character) => {
        const characterWidth = mask.measureText(character).width;
        characterBoxes.push({ character, x: textCursor, width: characterWidth });
        mask.fillText(character, textCursor, textY);
        textCursor += characterWidth + tracking;
      });

      const alpha = mask.getImageData(0, 0, width, height).data;
      const pixels = new Uint8Array(width * height);
      for (let index = 0; index < pixels.length; index += 1) {
        pixels[index] = alpha[index * 4 + 3] > 32 ? 1 : 0;
      }

      const removals = new Uint32Array(width * height);
      let changed = true;
      let iterations = 0;
      while (changed && iterations < 48) {
        changed = false;
        for (let phase = 0; phase < 2; phase += 1) {
          let removalCount = 0;
          for (let y = 1; y < height - 1; y += 1) {
            for (let x = 1; x < width - 1; x += 1) {
              const index = y * width + x;
              if (!pixels[index]) continue;
              const p2 = pixels[index - width];
              const p3 = pixels[index - width + 1];
              const p4 = pixels[index + 1];
              const p5 = pixels[index + width + 1];
              const p6 = pixels[index + width];
              const p7 = pixels[index + width - 1];
              const p8 = pixels[index - 1];
              const p9 = pixels[index - width - 1];
              const neighbours = p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9;
              if (neighbours < 2 || neighbours > 6) continue;
              const transitions = Number(!p2 && p3) + Number(!p3 && p4) + Number(!p4 && p5)
                + Number(!p5 && p6) + Number(!p6 && p7) + Number(!p7 && p8)
                + Number(!p8 && p9) + Number(!p9 && p2);
              if (transitions !== 1) continue;
              const firstCondition = phase === 0 ? p2 * p4 * p6 === 0 : p2 * p4 * p8 === 0;
              const secondCondition = phase === 0 ? p4 * p6 * p8 === 0 : p2 * p6 * p8 === 0;
              if (firstCondition && secondCondition) removals[removalCount++] = index;
            }
          }
          if (removalCount) changed = true;
          for (let index = 0; index < removalCount; index += 1) pixels[removals[index]] = 0;
        }
        iterations += 1;
      }

      const plotLine = (from, to) => {
        let x = Math.round(from.x);
        let y = Math.round(from.y);
        const endX = Math.round(to.x);
        const endY = Math.round(to.y);
        const deltaX = Math.abs(endX - x);
        const stepX = x < endX ? 1 : -1;
        const deltaY = -Math.abs(endY - y);
        const stepY = y < endY ? 1 : -1;
        let error = deltaX + deltaY;
        while (true) {
          if (x >= 0 && x < width && y >= 0 && y < height) pixels[y * width + x] = 1;
          if (x === endX && y === endY) break;
          const doubledError = error * 2;
          if (doubledError >= deltaY) {
            error += deltaY;
            x += stepX;
          }
          if (doubledError <= deltaX) {
            error += deltaX;
            y += stepY;
          }
        }
      };

      const customKanaGuides = [];
      characterBoxes.filter(({ character }) => character === "の").forEach((box) => {
        const top = textY - fontSize * 0.52;
        const glyphHeight = fontSize * 0.95;
        const left = Math.max(0, Math.floor(box.x - 2));
        const right = Math.min(width - 1, Math.ceil(box.x + box.width + 2));
        const upper = Math.max(0, Math.floor(top - 2));
        const lower = Math.min(height - 1, Math.ceil(top + glyphHeight + 2));
        for (let y = upper; y <= lower; y += 1) {
          for (let x = left; x <= right; x += 1) pixels[y * width + x] = 0;
        }
        const guide = [
          [0.48, 0.45], [0.29, 0.37], [0.12, 0.46], [0.08, 0.62],
          [0.18, 0.79], [0.41, 0.88], [0.66, 0.82], [0.85, 0.66],
          [0.91, 0.46], [0.8, 0.27], [0.58, 0.16], [0.35, 0.22],
          [0.22, 0.39], [0.38, 0.52], [0.72, 0.6],
        ].map(([x, y]) => ({ x: box.x + x * box.width, y: top + y * glyphHeight }));
        for (let segment = 0; segment < guide.length - 1; segment += 1) {
          const point0 = guide[Math.max(0, segment - 1)];
          const point1 = guide[segment];
          const point2 = guide[segment + 1];
          const point3 = guide[Math.min(guide.length - 1, segment + 2)];
          let previous = point1;
          for (let step = 1; step <= 8; step += 1) {
            const t = step / 8;
            const t2 = t * t;
            const t3 = t2 * t;
            const point = {
              x: 0.5 * ((2 * point1.x) + (-point0.x + point2.x) * t + (2 * point0.x - 5 * point1.x + 4 * point2.x - point3.x) * t2 + (-point0.x + 3 * point1.x - 3 * point2.x + point3.x) * t3),
              y: 0.5 * ((2 * point1.y) + (-point0.y + point2.y) * t + (2 * point0.y - 5 * point1.y + 4 * point2.y - point3.y) * t2 + (-point0.y + 3 * point1.y - 3 * point2.y + point3.y) * t3),
            };
            plotLine(previous, point);
            previous = point;
          }
        }
        customKanaGuides.push({ box, guide, top, glyphHeight });
      });

      const neighboursOf = (index) => {
        const x = index % width;
        const y = Math.floor(index / width);
        const neighbours = [];
        for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
          for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
            if ((!offsetX && !offsetY) || x + offsetX < 0 || x + offsetX >= width || y + offsetY < 0 || y + offsetY >= height) continue;
            const neighbour = (y + offsetY) * width + x + offsetX;
            if (!pixels[neighbour]) continue;
            if (offsetX && offsetY && (pixels[y * width + x + offsetX] || pixels[(y + offsetY) * width + x])) continue;
            neighbours.push(neighbour);
          }
        }
        return neighbours;
      };

      const skeletonIndices = [];
      const special = new Set();
      for (let index = 0; index < pixels.length; index += 1) {
        if (!pixels[index]) continue;
        skeletonIndices.push(index);
        if (neighboursOf(index).length !== 2) special.add(index);
      }
      const edgeKey = (first, second) => first < second ? first * pixels.length + second : second * pixels.length + first;
      const visitedEdges = new Set();
      const tracedPaths = [];
      const tracePath = (start, next) => {
        const path = [start, next];
        visitedEdges.add(edgeKey(start, next));
        let previous = start;
        let current = next;
        let guard = 0;
        while (guard++ < pixels.length) {
          if (current !== start && special.has(current)) break;
          const candidates = neighboursOf(current).filter((candidate) => candidate !== previous && !visitedEdges.has(edgeKey(current, candidate)));
          if (!candidates.length) break;
          const candidate = candidates[0];
          visitedEdges.add(edgeKey(current, candidate));
          path.push(candidate);
          previous = current;
          current = candidate;
          if (current === start) break;
        }
        if (path.length > 1) tracedPaths.push(path);
      };
      special.forEach((start) => {
        neighboursOf(start).forEach((next) => {
          if (!visitedEdges.has(edgeKey(start, next))) tracePath(start, next);
        });
      });
      skeletonIndices.forEach((start) => {
        neighboursOf(start).forEach((next) => {
          if (!visitedEdges.has(edgeKey(start, next))) tracePath(start, next);
        });
      });

      const paths = tracedPaths
        .map((path) => simplifyPath(path.map((index) => ({ x: index % width, y: Math.floor(index / width) }))))
        .filter((path) => path.length > 1 && Math.hypot(path.at(-1).x - path[0].x, path.at(-1).y - path[0].y) > 1.8);

      const pathLengthOf = (path) => path.slice(1).reduce((length, point, pointIndex) => {
        const previous = path[pointIndex];
        return length + Math.hypot(point.x - previous.x, point.y - previous.y);
      }, 0);
      const sequencePaths = paths
        .map((sourcePath) => {
          const first = sourcePath[0];
          const last = sourcePath.at(-1);
          const points = first.x > last.x || (first.x === last.x && first.y > last.y)
            ? sourcePath.slice().reverse()
            : sourcePath;
          const offsets = [0];
          for (let index = 1; index < points.length; index += 1) {
            offsets.push(offsets.at(-1) + Math.hypot(points[index].x - points[index - 1].x, points[index].y - points[index - 1].y));
          }
          return {
            points,
            offsets,
            length: Math.max(2, offsets.at(-1)),
            minX: Math.min(...points.map((point) => point.x)),
            centerY: points.reduce((sum, point) => sum + point.y, 0) / points.length,
          };
        })
        .sort((first, second) => first.minX - second.minX || first.centerY - second.centerY);
      let sequenceLength = 0;
      sequencePaths.forEach((path) => {
        path.sequenceStart = sequenceLength;
        sequenceLength += path.length;
        path.sequenceEnd = sequenceLength;
      });

      const nodes = [];
      const addNode = (point, strength = 0.72) => {
        const nearby = nodes.find((node) => Math.hypot(node.x - point.x, node.y - point.y) < 6.5);
        if (nearby) {
          nearby.strength = Math.max(nearby.strength, strength);
          return;
        }
        if (nodes.length < 62) nodes.push({ x: point.x, y: point.y, strength, phase: nodes.length * 1.713 });
      };
      special.forEach((index) => {
        const degree = neighboursOf(index).length;
        if (degree === 1 || degree >= 3) addNode({ x: index % width, y: Math.floor(index / width) }, degree >= 3 ? 1 : 0.84);
      });
      paths.forEach((path) => {
        addNode(path[0], 0.84);
        addNode(path.at(-1), 0.84);
        for (let index = 1; index < path.length - 1; index += 1) {
          const before = path[index - 1];
          const point = path[index];
          const after = path[index + 1];
          const firstLength = Math.max(0.001, Math.hypot(point.x - before.x, point.y - before.y));
          const secondLength = Math.max(0.001, Math.hypot(after.x - point.x, after.y - point.y));
          const direction = ((point.x - before.x) * (after.x - point.x) + (point.y - before.y) * (after.y - point.y)) / (firstLength * secondLength);
          if (direction < 0.72) addNode(point, 0.62);
        }
      });
      customKanaGuides.forEach(({ box, guide, top, glyphHeight }) => {
        for (let index = nodes.length - 1; index >= 0; index -= 1) {
          const node = nodes[index];
          if (node.x >= box.x - 2 && node.x <= box.x + box.width + 2 && node.y >= top - 2 && node.y <= top + glyphHeight + 2) nodes.splice(index, 1);
        }
        addNode(guide[0], 0.82);
        addNode(guide[5], 0.72);
        addNode(guide.at(-1), 0.9);
      });

      const locateNodeInSequence = (node) => {
        let nearestDistance = Number.POSITIVE_INFINITY;
        let sequencePosition = 0;
        sequencePaths.forEach((path) => {
          for (let index = 1; index < path.points.length; index += 1) {
            const start = path.points[index - 1];
            const end = path.points[index];
            const deltaX = end.x - start.x;
            const deltaY = end.y - start.y;
            const segmentLengthSquared = deltaX * deltaX + deltaY * deltaY;
            const ratio = segmentLengthSquared > 0
              ? clamp(((node.x - start.x) * deltaX + (node.y - start.y) * deltaY) / segmentLengthSquared)
              : 0;
            const projectedX = start.x + deltaX * ratio;
            const projectedY = start.y + deltaY * ratio;
            const distance = Math.hypot(node.x - projectedX, node.y - projectedY);
            if (distance >= nearestDistance) continue;
            nearestDistance = distance;
            const segmentLength = Math.sqrt(segmentLengthSquared);
            sequencePosition = (path.sequenceStart + path.offsets[index - 1] + segmentLength * ratio) / Math.max(1, sequenceLength);
          }
        });
        return clamp(sequencePosition);
      };
      nodes.forEach((node) => {
        node.sequencePosition = locateNodeInSequence(node);
      });

      const skeletonCanvas = document.createElement("canvas");
      skeletonCanvas.width = width;
      skeletonCanvas.height = height;
      const skeletonContext = skeletonCanvas.getContext("2d");
      const skeletonImage = skeletonContext.createImageData(width, height);
      for (let index = 0; index < pixels.length; index += 1) {
        if (!pixels[index]) continue;
        const pixel = index * 4;
        skeletonImage.data[pixel] = 211;
        skeletonImage.data[pixel + 1] = 255;
        skeletonImage.data[pixel + 2] = 247;
        skeletonImage.data[pixel + 3] = 255;
      }
      skeletonContext.putImageData(skeletonImage, 0, 0);

      const measuredWidth = Math.min(maxWidth, naturalWidth + Math.max(0, characters.length - 1) * tracking);
      const geometry = { key: cacheKey, paths, sequencePaths, sequenceLength, nodes, textLeft, textWidth: measuredWidth, skeletonCanvas };
      morphGeometryCache.set(canvas, geometry);
      return geometry;
    };

    const renderMorphTitle = (button, reveal = 1, clock = 0) => {
      const canvas = button.querySelector(".sound-track-morph-canvas");
      if (!(canvas instanceof HTMLCanvasElement)) return;
      if (canvas.clientWidth < 1 || canvas.clientHeight < 1) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const width = Math.round(canvas.clientWidth);
      const height = Math.round(canvas.clientHeight);
      const pixelWidth = Math.max(1, Math.round(width * dpr));
      const pixelHeight = Math.max(1, Math.round(height * dpr));
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
        morphGeometryCache.delete(canvas);
      }

      const context = canvas.getContext("2d");
      if (!context) return;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      context.lineCap = "round";
      context.lineJoin = "round";
      const title = canvas.dataset.title || "";
      const geometry = buildGlyphGeometry(canvas, width, height, title);
      const linePhase = easeInOutCubic(clamp((reveal - 0.05) / 0.83));
      const starPhase = linePhase;
      const settlePhase = easeInOutCubic(clamp((reveal - 0.86) / 0.12));

      context.save();
      context.globalCompositeOperation = "lighter";
      context.setLineDash([1, 7]);
      context.lineWidth = 0.55;
      context.strokeStyle = "rgba(122, 232, 214, 0.12)";
      for (let x = 18; x < width; x += 48) {
        context.beginPath();
        context.moveTo(x, 3);
        context.lineTo(x, height - 3);
        context.stroke();
      }
      for (let y = 16; y < height; y += 24) {
        context.beginPath();
        context.moveTo(3, y);
        context.lineTo(width - 3, y);
        context.stroke();
      }
      context.setLineDash([]);
      context.strokeStyle = "rgba(153, 255, 235, 0.18)";
      context.lineWidth = 0.7;
      context.beginPath();
      context.moveTo(2, height * 0.77);
      context.lineTo(width - 2, height * 0.77);
      context.stroke();
      context.restore();

      const drawGlyphPaths = (strokeStyle, lineWidth, shadowBlur, progress) => {
        context.save();
        context.globalCompositeOperation = "lighter";
        context.strokeStyle = strokeStyle;
        context.lineWidth = lineWidth;
        context.shadowColor = "rgba(105, 255, 224, 0.96)";
        context.shadowBlur = shadowBlur;
        const drawnLength = geometry.sequenceLength * progress;
        geometry.sequencePaths.forEach((sequencePath) => {
          const localProgress = clamp((drawnLength - sequencePath.sequenceStart) / sequencePath.length);
          if (localProgress <= 0) return;
          context.setLineDash([sequencePath.length + 2, sequencePath.length + 2]);
          context.lineDashOffset = sequencePath.length * (1 - localProgress);
          context.beginPath();
          sequencePath.points.forEach((point, pointIndex) => {
            if (pointIndex) context.lineTo(point.x, point.y);
            else context.moveTo(point.x, point.y);
          });
          context.stroke();
        });
        context.setLineDash([]);
        context.restore();
      };

      if (linePhase > 0) {
        drawGlyphPaths(`rgba(70, 237, 207, ${0.12 + linePhase * 0.1})`, 3.1, 9, linePhase);
        drawGlyphPaths(`rgba(213, 255, 247, ${0.48 + linePhase * 0.18})`, 0.86, 3.4, linePhase);
      }

      if (settlePhase > 0) {
        context.save();
        context.globalCompositeOperation = "lighter";
        context.imageSmoothingEnabled = true;
        context.globalAlpha = 0.075 * settlePhase;
        context.filter = "blur(2.4px)";
        context.drawImage(geometry.skeletonCanvas, 0, 0);
        context.restore();
      }

      const scanX = geometry.textLeft + geometry.textWidth * linePhase;
      let strokeHead = null;
      if (linePhase > 0 && linePhase < 1) {
        const drawnLength = geometry.sequenceLength * linePhase;
        const activePath = geometry.sequencePaths.find((path) => drawnLength <= path.sequenceEnd) || geometry.sequencePaths.at(-1);
        if (activePath) {
          const localDistance = clamp(drawnLength - activePath.sequenceStart, 0, activePath.length);
          let segmentIndex = activePath.offsets.findIndex((offset) => offset >= localDistance);
          if (segmentIndex <= 0) segmentIndex = Math.min(1, activePath.points.length - 1);
          const segmentStart = activePath.points[segmentIndex - 1];
          const segmentEnd = activePath.points[segmentIndex];
          const segmentOffset = activePath.offsets[segmentIndex - 1];
          const segmentLength = Math.max(0.001, activePath.offsets[segmentIndex] - segmentOffset);
          const segmentProgress = clamp((localDistance - segmentOffset) / segmentLength);
          strokeHead = {
            x: segmentStart.x + (segmentEnd.x - segmentStart.x) * segmentProgress,
            y: segmentStart.y + (segmentEnd.y - segmentStart.y) * segmentProgress,
          };
        }

        context.save();
        context.globalCompositeOperation = "lighter";
        const scanGlow = context.createLinearGradient(scanX - 42, 0, scanX + 11, 0);
        scanGlow.addColorStop(0, "rgba(91, 242, 215, 0)");
        scanGlow.addColorStop(0.72, "rgba(111, 255, 229, 0.035)");
        scanGlow.addColorStop(0.94, "rgba(220, 255, 249, 0.22)");
        scanGlow.addColorStop(1, "rgba(255, 255, 255, 0)");
        context.fillStyle = scanGlow;
        context.fillRect(Math.max(0, scanX - 42), 8, 54, height - 20);
        context.strokeStyle = "rgba(218, 255, 248, 0.42)";
        context.lineWidth = 0.72;
        context.shadowColor = "rgba(105, 255, 224, 0.9)";
        context.shadowBlur = 8;
        context.beginPath();
        context.moveTo(scanX, 12);
        context.lineTo(scanX, height - 16);
        context.stroke();
        if (strokeHead) {
          const headPulse = 0.86 + Math.sin(clock * 18) * 0.14;
          const ray = 7 * headPulse;
          context.strokeStyle = "rgba(237, 255, 251, 0.9)";
          context.lineWidth = 0.7;
          context.shadowBlur = 12;
          context.beginPath();
          context.moveTo(strokeHead.x - ray, strokeHead.y);
          context.lineTo(strokeHead.x + ray, strokeHead.y);
          context.moveTo(strokeHead.x, strokeHead.y - ray);
          context.lineTo(strokeHead.x, strokeHead.y + ray);
          context.stroke();
          context.beginPath();
          context.arc(strokeHead.x, strokeHead.y, 2.1 * headPulse, 0, Math.PI * 2);
          context.fillStyle = "rgba(247, 255, 253, 0.98)";
          context.fill();
        }
        context.restore();
      }

      const analysis = window.GaiaOpeningAudio?.getAnalysisFrame?.();
      const waveform = analysis?.waveform;
      const waveformAt = (position, phaseOffset = 0) => {
        if (analysis?.active && waveform?.length) {
          const sample = Number(waveform[Math.min(waveform.length - 1, Math.floor(position * waveform.length))]) || 0;
          return Math.abs(sample) <= 1 ? sample : (sample - 128) / 128;
        }
        const carrier = Math.sin(position * 54 + clock * 4.7 + phaseOffset) * 0.52;
        const overtone = Math.sin(position * 127 - clock * 2.4 + phaseOffset * 0.7) * 0.21;
        const slowDrift = Math.sin(position * 21 + clock * 1.15) * 0.14;
        const pulse = Math.exp(-Math.pow(((position * 7.2 + clock * 0.44) % 1) - 0.5, 2) * 42) * Math.sin(position * 188 + clock * 5.1) * 0.34;
        return carrier + overtone + slowDrift + pulse;
      };
      const beamX = linePhase < 0.995 ? scanX : ((clock % 4.8) / 4.8) * width;
      context.beginPath();
      for (let x = 0; x <= width; x += 2.5) {
        const position = x / width;
        const envelope = 0.5 + 0.5 * Math.sin(position * Math.PI);
        const y = height * 0.77 + waveformAt(position) * (8 + 11 * envelope);
        if (x) context.lineTo(x, y);
        else context.moveTo(x, y);
      }
      context.strokeStyle = "rgba(76, 197, 177, 0.075)";
      context.lineWidth = 0.7;
      context.shadowBlur = 0;
      context.stroke();
      for (let trail = 4; trail >= 0; trail -= 1) {
        const trailOffset = trail * 0.06;
        const waveGradient = context.createLinearGradient(Math.max(0, beamX - 390), 0, Math.max(1, beamX), 0);
        waveGradient.addColorStop(0, `rgba(72, 221, 194, ${0.018 + (4 - trail) * 0.01})`);
        waveGradient.addColorStop(0.66, `rgba(81, 231, 204, ${0.08 + (4 - trail) * 0.025})`);
        waveGradient.addColorStop(0.94, `rgba(187, 255, 242, ${0.32 + (4 - trail) * 0.075})`);
        waveGradient.addColorStop(1, "rgba(239, 255, 251, 0.82)");
        context.save();
        context.beginPath();
        context.rect(0, 0, Math.max(0, beamX + 2), height);
        context.clip();
        context.beginPath();
        for (let x = 0; x <= width; x += 2.5) {
          const position = x / width;
          const envelope = 0.5 + 0.5 * Math.sin(position * Math.PI);
          const y = height * 0.77 + waveformAt(position, trailOffset) * (8 + 11 * envelope) + trail * 0.65;
          if (x) context.lineTo(x, y);
          else context.moveTo(x, y);
        }
        context.strokeStyle = waveGradient;
        context.lineWidth = trail ? 0.72 : 1.45;
        context.shadowColor = "rgba(108, 255, 224, 0.86)";
        context.shadowBlur = trail ? 2 : 7;
        context.stroke();
        context.restore();
      }

      const headPosition = clamp(beamX / Math.max(1, width));
      const headEnvelope = 0.5 + 0.5 * Math.sin(headPosition * Math.PI);
      const headY = height * 0.77 + waveformAt(headPosition) * (8 + 11 * headEnvelope);
      const headTail = context.createLinearGradient(Math.max(0, beamX - 34), 0, beamX + 1, 0);
      headTail.addColorStop(0, "rgba(123,255,228,0)");
      headTail.addColorStop(1, "rgba(225,255,249,0.72)");
      context.strokeStyle = headTail;
      context.lineWidth = 1.25;
      context.shadowColor = "rgba(119,255,229,0.9)";
      context.shadowBlur = 7;
      context.beginPath();
      context.moveTo(Math.max(0, beamX - 34), headY);
      context.lineTo(beamX, headY);
      context.stroke();
      context.beginPath();
      context.arc(beamX, headY, 1.8, 0, Math.PI * 2);
      context.fillStyle = "rgba(239,255,252,0.96)";
      context.shadowBlur = 10;
      context.fill();

      let litNodeCount = 0;
      let twinkleTotal = 0;
      if (starPhase > 0) {
        context.save();
        context.globalCompositeOperation = "lighter";
        geometry.nodes.forEach((node, nodeIndex) => {
          const birthPosition = node.sequencePosition * 0.985;
          const birth = easeOutCubic(clamp((linePhase - birthPosition) / 0.055));
          if (birth <= 0) return;
          litNodeCount += 1;
          const age = clamp((linePhase - birthPosition) / 0.055);
          const firstFlash = 1 + Math.sin(age * Math.PI) * (1.1 + node.strength * 0.9);
          const slowGlow = 0.5 + Math.sin(clock * (0.72 + (nodeIndex % 7) * 0.075) + node.phase) * 0.5;
          const quickSpark = Math.pow(Math.max(0, Math.sin(clock * (1.7 + (nodeIndex % 5) * 0.21) + node.phase * 1.91)), 12);
          const dimBeat = Math.pow(Math.max(0, Math.sin(clock * (0.41 + (nodeIndex % 3) * 0.045) + node.phase * 0.63)), 8);
          const twinkle = clamp(0.44 + slowGlow * 0.32 + quickSpark * 0.56 - dimBeat * 0.18, 0.28, 1.24);
          twinkleTotal += twinkle;
          const radius = (0.82 + node.strength * 0.94) * (0.72 + twinkle * 0.38) * firstFlash;
          const ray = (2.8 + node.strength * 5.8) * (0.58 + twinkle * 0.56) * firstFlash;
          context.globalAlpha = birth * (0.48 + twinkle * 0.52);
          context.strokeStyle = `rgba(225, 255, 249, ${0.24 + node.strength * 0.58})`;
          context.lineWidth = 0.55;
          context.shadowColor = "rgba(120, 255, 228, 0.98)";
          context.shadowBlur = (4 + node.strength * 8) * (0.64 + twinkle * 0.62) * firstFlash;
          context.beginPath();
          context.moveTo(node.x - ray, node.y);
          context.lineTo(node.x + ray, node.y);
          context.moveTo(node.x, node.y - ray);
          context.lineTo(node.x, node.y + ray);
          context.stroke();
          context.beginPath();
          context.arc(node.x, node.y, radius, 0, Math.PI * 2);
          context.fillStyle = node.strength > 0.82 ? "rgba(255,255,246,0.98)" : "rgba(205,255,246,0.9)";
          context.fill();
        });
        context.restore();
      }

      context.shadowBlur = 0;
      canvas.dataset.rendered = "true";
      canvas.dataset.reveal = reveal.toFixed(3);
      canvas.dataset.nodes = String(geometry.nodes.length);
      canvas.dataset.paths = String(geometry.paths.length);
      canvas.dataset.scope = "phosphor-waveform-trace";
      canvas.dataset.sequence = "left-to-right-single-stroke";
      canvas.dataset.starPhase = starPhase.toFixed(3);
      canvas.dataset.linePhase = linePhase.toFixed(3);
      canvas.dataset.settlePhase = settlePhase.toFixed(3);
      canvas.dataset.scanProgress = linePhase.toFixed(3);
      canvas.dataset.litNodes = String(litNodeCount);
      canvas.dataset.twinkle = (twinkleTotal / Math.max(1, litNodeCount)).toFixed(4);
      canvas.dataset.strokeHeadX = strokeHead ? strokeHead.x.toFixed(2) : "";
    };

    const morphAnimations = new WeakMap();
    const morphStartedAt = new WeakMap();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let activeMorphButton = null;
    const isMorphActive = (button) => button.classList.contains("is-morph-focus");
    const stopMorphTitle = (button) => {
      if (!(button instanceof HTMLElement)) return;
      button.classList.remove("is-morph-focus");
      cancelAnimationFrame(morphAnimations.get(button) || 0);
      morphAnimations.delete(button);
      morphStartedAt.delete(button);
      if (activeMorphButton === button) activeMorphButton = null;
    };
    const animateMorphTitle = (button) => {
      if (morphAnimations.has(button)) return;
      if (reducedMotion) {
        renderMorphTitle(button, 1, 0);
        return;
      }
      // Build the font skeleton before starting the clock. Otherwise the
      // first expensive geometry pass is counted as animation time and the
      // trace appears to jump forward by several frames.
      renderMorphTitle(button, 0, performance.now() / 1000);
      morphStartedAt.set(button, performance.now());
      const draw = (now) => {
        const progress = Math.min(1, (now - morphStartedAt.get(button)) / 2400);
        renderMorphTitle(button, progress, now / 1000);
        if (isMorphActive(button)) morphAnimations.set(button, requestAnimationFrame(draw));
        else morphAnimations.delete(button);
      };
      morphAnimations.set(button, requestAnimationFrame(draw));
    };
    const activateMorphTitle = (button) => {
      if (!(button instanceof HTMLElement)) return;
      if (activeMorphButton && activeMorphButton !== button) stopMorphTitle(activeMorphButton);
      trackButtons.forEach((candidate) => {
        if (candidate !== button && candidate.classList.contains("is-morph-focus")) stopMorphTitle(candidate);
      });
      activeMorphButton = button;
      button.classList.add("is-morph-focus");
      animateMorphTitle(button);
    };
    const restoreFocusedMorphTitle = () => {
      const focusedTrack = document.activeElement?.closest?.("[data-sound-track]");
      if (focusedTrack instanceof HTMLElement) activateMorphTitle(focusedTrack);
    };

    trackButtons.forEach((button) => {
      button.addEventListener("focus", () => activateMorphTitle(button));
      button.addEventListener("pointerenter", () => activateMorphTitle(button));
      button.addEventListener("pointerleave", () => {
        if (document.activeElement === button) return;
        stopMorphTitle(button);
        restoreFocusedMorphTitle();
      });
      button.addEventListener("blur", () => {
        if (button.matches(":hover")) return;
        stopMorphTitle(button);
      });
    });
    window.addEventListener("resize", () => {
      trackButtons.forEach((button) => {
        const canvas = button.querySelector(".sound-track-morph-canvas");
        if (canvas) morphGeometryCache.delete(canvas);
        if (isMorphActive(button)) animateMorphTitle(button);
      });
    });
    document.fonts?.ready?.then(() => {
      trackButtons.forEach((button) => {
        const canvas = button.querySelector(".sound-track-morph-canvas");
        if (canvas) morphGeometryCache.delete(canvas);
        if (isMorphActive(button)) animateMorphTitle(button);
      });
    });
  };

  setupSoundMorphPrototype();
  const signalRibbonCanvas = layer.querySelector(".sound-player-signal");

  const tracks = Object.freeze({
    opening: {
      number: "TRACK 01 / OPENING THEME",
      title: "Planet Forecast - Hope",
      description: "惑星の放課後のオープニングで、三人と地球の物語への入口をひらく音楽。",
      planet: "PLANET 01",
      signal: "FORECAST SIGNAL",
    },
    story: {
      number: "TRACK 02 / STORY THEME",
      title: "Planet Forecast — Windowlight",
      description: "三人の記録を読み、残された言葉へ近づいていく場面の音楽。",
      planet: "PLANET 02",
      signal: "STORY RESONANCE",
    },
    windowlight: {
      number: "TRACK 03 / OBSERVATION ROOM",
      title: "Planet Forecast — Calm",
      description: "制作室の窓へ午後の光が差し、三人の観測が静かに重なり始める場面の音楽。",
      planet: "PLANET 03",
      signal: "WINDOWLIGHT TRACE",
    },
    firstlight: {
      number: "TRACK 04 / DAWN THEME",
      title: "Planet Forecast — First Light",
      description: "夜明け前の海が黒から青へほどけ、未完の観測が次へ続いていく場面の音楽。",
      planet: "PLANET 04",
      signal: "FIRST LIGHT TRACE",
    },
    foldedwind: {
      number: "TRACK 05 / UNSENT RECORD",
      title: "折り目の向こうの風",
      description: "折り畳まれた記録が風にほどけ、次の読み手へ渡っていく情景の音楽。",
      planet: "PLANET 05",
      signal: "FOLDED WIND TRACE",
    },
    snowfire: {
      number: "TRACK 06 / UNKNOWN SIGNAL",
      title: "雪火の観測信号",
      description: "冷たい記録と消えない熱が、同じ信号の中で揺れる場面の音楽。",
      planet: "PLANET 06",
      signal: "SNOWFIRE SIGNAL",
    },
    snowafter: {
      number: "TRACK 07 / BRANCHING LIGHT",
      title: "雪火、軌道の外へ（未使用曲）",
      description: "既存の軌道から分かれた光が、まだ名のない外側へ開いていく場面の音楽。",
      planet: "PLANET 07",
      signal: "SNOWFIRE AFTERIMAGE",
    },
    moonbook: {
      number: "TRACK 08 / NIGHT NOTE",
      title: "月明かりの観測ノート",
      description: "SOURCEと解釈を分けながら、夜の机で記録を読み直す場面の音楽。",
      planet: "PLANET 08",
      signal: "MOONLIT NOTE",
    },
    senseware: {
      number: "TRACK 09 / SYSTEM THEME",
      title: "GAIA SENSEWARE",
      description: "ハープとフェルトピアノ、海と大気の低い呼吸が、地図に記録された地球の感覚を静かに包む音楽。",
      planet: "PLANET 09",
      signal: "SOURCE SAVE",
    },
    moonreopen: {
      number: "TRACK 10 / BLUE GLASS TIDE",
      title: "青硝子の潮汐",
      description: "青いガラスのような潮の揺らぎが、夜の観測記録を静かにひらく音楽。",
      planet: "PLANET 10",
      signal: "BLUE GLASS TIDE",
    },
    ending: {
      number: "TRACK 11 / ENDING THEME",
      title: "AfterSchool,AfterGlow",
      description: "スタッフロールとともに、物語の余韻を次の観測へつなぐエンディングテーマ。",
      planet: "PLANET 11",
      signal: "AFTERGLOW SIGNAL",
    },
    trueend: {
      number: "TRACK 12 / Beyond",
      title: "Sensory Horizon",
      description: "二百七十万年後、星々へ広がった感覚の系譜をたどるBeyond専用曲。",
      planet: "PLANET 12",
      signal: "SENSORY HORIZON",
    },
  });

  let isOpen = false;
  let isScrubbing = false;
  let animationFrame = 0;
  let lastFocused = null;
  let visualizerRuntime = null;
  let visualizerState = {
    playing: false,
    volume: 0.1,
    outputVolume: 0,
    currentTime: 0,
    duration: 0,
    track: "opening",
    bands: [0, 0, 0],
    spectrum: Array(32).fill(0),
    waveform: Array(64).fill(0),
    peak: 0,
    rms: 0,
    analysisActive: false,
    analysisSupported: false,
  };

  const getAudio = () => window.GaiaOpeningAudio;

  const createSoundVisualizer = (canvas) => {
    if (!(canvas instanceof HTMLCanvasElement)) return null;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const smoothedBands = new Float32Array(3);
    const smoothedTimbreBins = new Float32Array(8);
    const visualResponses = new Float32Array(3);
    const previousSpectrum = new Float32Array(32);
    let smoothedEnergy = 0;
    let smoothedPulse = 0;
    let smoothedFlux = 0;
    let smoothedWave = 0;
    let previousBass = 0;
    let automaticGain = 1;
    let lastDrawAt = -Infinity;
    let gl = null;
    let program = null;
    let pointBuffer = null;
    let pointCount = 0;
    let attributes = null;
    let uniforms = null;
    let fallback = null;
    let renderedFrames = 0;
    let visualStartedAt = performance.now();
    const viewRotation = new Float32Array(2);
    const targetViewRotation = new Float32Array(2);
    let dragPointerId = null;
    let dragX = 0;
    let dragY = 0;

    const vertexSource = `
      precision highp float;

      attribute vec3 position;
      attribute float seed;
      attribute float kind;
      attribute float pointSize;
      attribute float tone;
      attribute float temperature;

      uniform vec2 resolution;
      uniform float time;
      uniform float bass;
      uniform float mid;
      uniform float high;
      uniform float pulse;
      uniform float flux;
      uniform float wave;
      uniform float densityResponse;
      uniform float meanderResponse;
      uniform float causticResponse;
      uniform float playing;
      uniform float trackHue;
      uniform vec2 viewRotation;
      uniform vec4 timbreLow;
      uniform vec4 timbreHigh;

      varying vec3 lightColor;
      varying float lightAlpha;
      varying float lightKind;
      varying float sparkle;
      varying float bandActivity;

      vec3 stellarPalette(float phase) {
        float spectralClass = fract(phase) * 7.0;
        // Approximate visible colours of the O, B, A, F, G, K and M stellar
        // temperature classes. Most stars remain close to white; temperature
        // is expressed as a restrained warm/cool bias instead of neon colour.
        vec3 oStar = vec3(0.46, 0.58, 1.18);
        vec3 bStar = vec3(0.58, 0.69, 1.12);
        vec3 aStar = vec3(0.73, 0.81, 1.06);
        vec3 fStar = vec3(0.97, 0.97, 1.00);
        vec3 gStar = vec3(1.00, 0.92, 0.78);
        vec3 kStar = vec3(1.08, 0.68, 0.36);
        vec3 mStar = vec3(1.16, 0.36, 0.20);
        if (spectralClass < 1.0) return mix(oStar, bStar, spectralClass);
        if (spectralClass < 2.0) return mix(bStar, aStar, spectralClass - 1.0);
        if (spectralClass < 3.0) return mix(aStar, fStar, spectralClass - 2.0);
        if (spectralClass < 4.0) return mix(fStar, gStar, spectralClass - 3.0);
        if (spectralClass < 5.0) return mix(gStar, kStar, spectralClass - 4.0);
        if (spectralClass < 6.0) return mix(kStar, mStar, spectralClass - 5.0);
        return mStar;
      }

      vec3 nebulaPalette(float phase) {
        float emissionClass = fract(phase) * 4.0;
        vec3 hydrogenAlpha = vec3(0.68, 0.07, 0.14);
        vec3 oxygenThree = vec3(0.08, 0.58, 0.55);
        vec3 reflectionBlue = vec3(0.20, 0.36, 0.78);
        vec3 sulphurGold = vec3(0.82, 0.46, 0.14);
        if (emissionClass < 1.0) return mix(hydrogenAlpha, oxygenThree, emissionClass);
        if (emissionClass < 2.0) return mix(oxygenThree, reflectionBlue, emissionClass - 1.0);
        if (emissionClass < 3.0) return mix(reflectionBlue, sulphurGold, emissionClass - 2.0);
        return mix(sulphurGold, hydrogenAlpha, emissionClass - 3.0);
      }

      float sampleTimbre(float selector) {
        float cursor = fract(selector) * 8.0;
        float blend = fract(cursor);
        if (cursor < 1.0) return mix(timbreLow.x, timbreLow.y, blend);
        if (cursor < 2.0) return mix(timbreLow.y, timbreLow.z, blend);
        if (cursor < 3.0) return mix(timbreLow.z, timbreLow.w, blend);
        if (cursor < 4.0) return mix(timbreLow.w, timbreHigh.x, blend);
        if (cursor < 5.0) return mix(timbreHigh.x, timbreHigh.y, blend);
        if (cursor < 6.0) return mix(timbreHigh.y, timbreHigh.z, blend);
        if (cursor < 7.0) return mix(timbreHigh.z, timbreHigh.w, blend);
        return mix(timbreHigh.w, timbreLow.x, blend);
      }

      void main() {
        float travelSpeed = mix(0.035, 0.16, playing);
        float depth = mod(-position.z - time * travelSpeed, 66.0) + 2.8;
        vec3 world = vec3(position.xy, -depth);
        float yawCos = cos(viewRotation.x);
        float yawSin = sin(viewRotation.x);
        world = vec3(
          yawCos * world.x + yawSin * world.z,
          world.y,
          -yawSin * world.x + yawCos * world.z
        );
        float pitchCos = cos(viewRotation.y);
        float pitchSin = sin(viewRotation.y);
        world = vec3(
          world.x,
          pitchCos * world.y - pitchSin * world.z,
          pitchSin * world.y + pitchCos * world.z
        );
        float cameraDepth = -world.z;
        float visible = step(0.9, cameraDepth);
        float focalLength = 1.34;
        vec2 projected = world.xy * focalLength / max(0.9, cameraDepth);
        float aspect = resolution.x / max(1.0, resolution.y);
        projected.x /= aspect;
        gl_Position = visible > 0.5 ? vec4(projected, 0.0, 1.0) : vec4(3.0, 3.0, 0.0, 1.0);

        float depthPulse = exp(-pow(fract(depth * 0.048 - time * 0.035) - 0.5, 2.0) * 48.0);
        float twinkle = 0.58 + 0.42 * sin(time * (0.42 + seed * 0.82) + seed * 47.0 + depth * 0.11);
        twinkle = max(0.0, twinkle);
        float fieldClass = 1.0 - step(0.5, kind);
        float armClass = step(0.5, kind) * (1.0 - step(1.5, kind));
        float nebulaClass = step(1.5, kind) * (1.0 - step(2.5, kind));
        float nurseryClass = step(2.5, kind) * (1.0 - step(3.5, kind));
        float dustClass = step(3.5, kind);
        // The FFT is split into eight timbre bins. Each arm segment, cloud and
        // nursery owns a different bin, so equal-coloured objects do not flash
        // together just because one broad bass/mid/high value moved.
        float localTimbre = sampleTimbre(tone);
        float neighbourTimbre = sampleTimbre(tone + 0.137);
        float spectralEdge = max(0.0, localTimbre - neighbourTimbre * 0.62);
        float spatialPhase = 0.5 + 0.5 * sin(tone * 51.0 + seed * 19.0 + depth * 0.083 + wave * tone * 1.2);
        float localGate = mix(0.28, 1.0, smoothstep(0.18, 0.88, spatialPhase));
        float localActivity = clamp((localTimbre * (1.02 + pulse * 0.14) + spectralEdge * 0.74) * localGate, 0.0, 1.58);
        float materialAffinity = fieldClass * 0.56
          + armClass * (0.62 + mid * 0.10 + meanderResponse * 0.08)
          + nebulaClass * (0.64 + bass * 0.10 + densityResponse * 0.08)
          + nurseryClass * (0.72 + high * 0.20)
          + dustClass * (0.52 + causticResponse * 0.18);
        bandActivity = 0.035 + localActivity * materialAffinity;

        float perspectiveSize = pointSize * (112.0 / max(2.2, cameraDepth));
        float pixelScale = clamp(resolution.y / 900.0, 0.82, 1.55);
        float audioSize = 1.0
          + localActivity * (
            nebulaClass * (0.08 + bass * 0.08)
            + armClass * (0.04 + mid * 0.05)
            + nurseryClass * (0.12 + high * 0.16)
            + dustClass * (0.04 + high * 0.07)
          );
        float classScale = dustClass > 0.5
          ? 0.48
          : (nebulaClass > 0.5 ? 1.62 : (nurseryClass > 0.5 ? 0.72 : 1.0));
        float pointSizeLimit = nebulaClass > 0.5 ? 190.0 : (nurseryClass > 0.5 ? 22.0 : 42.0);
        gl_PointSize = clamp(perspectiveSize * pixelScale * audioSize * classScale, 1.05, pointSizeLimit);

        float nearFade = smoothstep(1.9, 4.5, depth);
        float farFade = 1.0 - smoothstep(52.0, 68.0, depth);
        float classLift = fieldClass * 0.52
          + armClass * 0.72
          + nebulaClass * 0.15
          + nurseryClass * 0.68
          + dustClass * 0.20;
        float dustReveal = dustClass > 0.5
          ? smoothstep(0.78 - localActivity * 0.32, 0.98, seed)
          : 1.0;
        lightAlpha = visible * nearFade * farFade * classLift * dustReveal
          * (0.30 + bandActivity * 0.86);
        lightAlpha *= 0.42 + playing * 0.58;
        sparkle = twinkle * (
          fieldClass * (0.08 + localActivity * 0.16)
          + armClass * (0.06 + localActivity * 0.11)
          + nebulaClass * (0.035 + localActivity * 0.05)
          + nurseryClass * (0.08 + localActivity * 0.38)
          + dustClass * (0.05 + localActivity * 0.38)
        ) + depthPulse * flux * localGate * (nurseryClass + dustClass * 0.45);
        lightKind = kind;
        // Temperature colour and audio-bin ownership are intentionally
        // independent. Two stars with the same colour can therefore listen to
        // different spectral components and never have to flash in unison.
        float localHue = fract(temperature * 0.88 + trackHue * 0.08 + seed * 0.02);
        vec3 starRestingColor = stellarPalette(localHue);
        vec3 starActiveColor = pow(stellarPalette(localHue + spectralEdge * 0.018), vec3(1.42));
        vec3 gasColor = nebulaPalette(fract(temperature * 0.73 + seed * 0.05));
        vec3 restingColor = mix(starRestingColor * 0.68, gasColor * 0.34, nebulaClass);
        vec3 activeColor = mix(starActiveColor, gasColor * 0.88, nebulaClass);
        lightColor = mix(restingColor, activeColor, clamp(0.24 + localActivity * 0.48, 0.0, 0.92));
        lightColor *= 0.76 + bandActivity * 0.42;
      }
    `;

    const fragmentSource = `
      precision highp float;

      varying vec3 lightColor;
      varying float lightAlpha;
      varying float lightKind;
      varying float sparkle;
      varying float bandActivity;

      void main() {
        vec2 point = gl_PointCoord - 0.5;
        float radius = length(point) * 2.0;
        if (radius > 1.0) discard;
        float angle = atan(point.y, point.x);
        float halo = exp(-radius * radius * 2.45) * (1.0 - smoothstep(0.76, 1.0, radius));
        float pearl = 1.0 - smoothstep(0.045, 0.19, radius);
        float cross = (
          exp(-abs(point.x) * 34.0) + exp(-abs(point.y) * 34.0)
        ) * exp(-radius * 2.6) * (0.045 + sparkle * 0.075);
        float faceted = 0.93 + 0.07 * cos(atan(point.y, point.x) * (4.0 + mod(lightKind, 3.0)));
        float nebulaClass = step(1.5, lightKind) * (1.0 - step(2.5, lightKind));
        float cloudGrain = 0.72 + 0.28 * sin(angle * 5.0 + radius * 16.0 + sparkle * 2.0);
        float nebulaAlpha = halo * halo * cloudGrain * (0.38 + bandActivity * 0.18);
        float starAlpha = halo * (0.45 + sparkle * 0.24) + pearl * 0.92 + cross;
        float alpha = mix(starAlpha, nebulaAlpha, nebulaClass) * lightAlpha * faceted;
        vec3 color = lightColor * mix(0.84 + halo * 1.02 + sparkle * 0.34, 0.54 + halo * 1.18, nebulaClass);
        color += lightColor * pearl * (0.38 + sparkle * 0.12) * (1.0 - nebulaClass);
        color = min(color, vec3(2.4));
        gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
      }
    `;

    const compile = (context, type, source) => {
      const shader = context.createShader(type);
      context.shaderSource(shader, source);
      context.compileShader(shader);
      if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
        canvas.dataset.shaderError = (context.getShaderInfoLog(shader) || "compile-failed").slice(0, 180);
        context.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const createPointGeometry = () => {
      const points = [];
      let randomState = 0x6d2b79f5;
      const random = () => {
        randomState = Math.imul(randomState ^ (randomState >>> 15), randomState | 1);
        randomState ^= randomState + Math.imul(randomState ^ (randomState >>> 7), randomState | 61);
        return ((randomState ^ (randomState >>> 14)) >>> 0) / 4294967296;
      };
      const push = (x, y, z, kind, size = 1, tone = random(), temperature = random()) => {
        points.push(
          x,
          y,
          z,
          random(),
          kind,
          size,
          Math.max(0, Math.min(0.999, tone)),
          Math.max(0, Math.min(0.999, temperature)),
        );
      };
      // A broad 3D star volume keeps the frame populated while the camera
      // rotates. The distribution widens with depth, like looking through a
      // real galactic field rather than at a flat particle curtain.
      for (let index = 0; index < 7800; index += 1) {
        const z = -2.8 - random() * 65.8;
        const depthSpread = 8 + (-z / 66) * 21;
        const angle = random() * Math.PI * 2;
        const radius = Math.sqrt(random()) * depthSpread;
        push(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius * 0.62,
          z,
          random() > 0.94 ? 3 : 0,
          0.34 + Math.pow(random(), 2.4) * 1.46,
        );
      }

      // Four loose logarithmic arms. Every arm has a different depth and
      // thickness, so a left-drag exposes genuine parallax between layers.
      const armCount = 4;
      for (let arm = 0; arm < armCount; arm += 1) {
        for (let index = 0; index < 1450; index += 1) {
          const radius = 1.1 + Math.pow(random(), 0.72) * 17.5;
          const angle = arm / armCount * Math.PI * 2 + radius * 0.52 + (random() - 0.5) * (0.34 + radius * 0.018);
          const thickness = 0.24 + radius * 0.045;
          const x = Math.cos(angle) * radius + (random() - 0.5) * thickness;
          const y = Math.sin(angle) * radius * 0.54 + (random() - 0.5) * thickness * 0.72;
          const z = -3.2 - random() * 65.0 + Math.sin(angle * 1.7) * 1.8;
          const tone = (arm * 0.19 + radius * 0.041) % 1;
          const temperature = (arm * 0.27 + radius * 0.073 + 0.31) % 1;
          push(x, y, z, 1, 0.52 + random() * 1.26, tone, temperature);
        }
      }

      // Coloured gaseous knots sit inside the arms. Large, soft point sprites
      // overlap into painterly nebulae without introducing a costly texture.
      for (let index = 0; index < 1500; index += 1) {
        const arm = index % armCount;
        const radius = 2.4 + Math.pow(random(), 0.78) * 15.5;
        const angle = arm / armCount * Math.PI * 2 + radius * 0.52 + (random() - 0.5) * 0.52;
        const cloud = 0.5 + radius * 0.07;
        push(
          Math.cos(angle) * radius + (random() - 0.5) * cloud,
          Math.sin(angle) * radius * 0.54 + (random() - 0.5) * cloud * 0.72,
          -4.0 - random() * 63.0,
          2,
          7.0 + random() * 11.0,
          (arm * 0.23 + radius * 0.037) % 1,
          (arm * 0.31 + radius * 0.089 + 0.17) % 1,
        );
      }

      // Loose stellar associations add regional structure without collapsing
      // into bright round clumps. Their long axis, depth and brightness vary,
      // leaving visible gaps inside every group.
      for (let cluster = 0; cluster < 12; cluster += 1) {
        const centerAngle = random() * Math.PI * 2;
        const centerRadius = 3 + random() * 16;
        const centerX = Math.cos(centerAngle) * centerRadius;
        const centerY = Math.sin(centerAngle) * centerRadius * 0.55;
        const centerZ = -5 - random() * 60;
        const associationAngle = random() * Math.PI * 2;
        const clusterTone = 0.02 + random() * 0.96;
        const clusterTemperature = 0.02 + random() * 0.96;
        for (let index = 0; index < 30; index += 1) {
          const along = (random() - 0.5) * 4.8;
          const across = (random() - 0.5) * (0.38 + random() * 0.92);
          const size = 0.48 + Math.pow(random(), 3.2) * 1.34;
          push(
            centerX + Math.cos(associationAngle) * along - Math.sin(associationAngle) * across,
            centerY + (Math.sin(associationAngle) * along + Math.cos(associationAngle) * across) * 0.72,
            centerZ + (random() - 0.5) * 7.5,
            3,
            size,
            clusterTone + (random() - 0.5) * 0.06,
            clusterTemperature + (random() - 0.5) * 0.045,
          );
        }
      }

      // Fine dust is the only population whose visible density follows audio.
      for (let index = 0; index < 3600; index += 1) {
        const z = -2.8 - random() * 65.5;
        const spread = 9 + (-z / 66) * 18;
        push(
          (random() * 2 - 1) * spread,
          (random() * 2 - 1) * spread * 0.58,
          z,
          4,
          0.34 + random() * 0.72,
        );
      }
      return new Float32Array(points);
    };

    const initWebGL = () => {
      gl = canvas.getContext("webgl", {
        alpha: true,
        antialias: false,
        depth: false,
        premultipliedAlpha: false,
        powerPreference: "high-performance",
      });
      if (!gl) return false;
      const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource);
      const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
      if (!vertex || !fragment) return false;
      program = gl.createProgram();
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        canvas.dataset.shaderError = (gl.getProgramInfoLog(program) || "link-failed").slice(0, 180);
        return false;
      }

      const geometry = createPointGeometry();
      pointCount = geometry.length / 8;
      pointBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, geometry, gl.STATIC_DRAW);
      attributes = {
        position: gl.getAttribLocation(program, "position"),
        seed: gl.getAttribLocation(program, "seed"),
        kind: gl.getAttribLocation(program, "kind"),
        pointSize: gl.getAttribLocation(program, "pointSize"),
        tone: gl.getAttribLocation(program, "tone"),
        temperature: gl.getAttribLocation(program, "temperature"),
      };
      canvas.dataset.attributeLocations = Object.values(attributes).join(",");
      uniforms = {
        resolution: gl.getUniformLocation(program, "resolution"),
        time: gl.getUniformLocation(program, "time"),
        bass: gl.getUniformLocation(program, "bass"),
        mid: gl.getUniformLocation(program, "mid"),
        high: gl.getUniformLocation(program, "high"),
        pulse: gl.getUniformLocation(program, "pulse"),
        flux: gl.getUniformLocation(program, "flux"),
        wave: gl.getUniformLocation(program, "wave"),
        densityResponse: gl.getUniformLocation(program, "densityResponse"),
        meanderResponse: gl.getUniformLocation(program, "meanderResponse"),
        causticResponse: gl.getUniformLocation(program, "causticResponse"),
        playing: gl.getUniformLocation(program, "playing"),
        trackHue: gl.getUniformLocation(program, "trackHue"),
        viewRotation: gl.getUniformLocation(program, "viewRotation"),
        timbreLow: gl.getUniformLocation(program, "timbreLow"),
        timbreHigh: gl.getUniformLocation(program, "timbreHigh"),
      };
      gl.enable(gl.BLEND);
      gl.blendEquation(gl.FUNC_ADD);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.disable(gl.DEPTH_TEST);
      canvas.dataset.renderer = "webgl";
      canvas.dataset.visualizer = "audio-reactive-deep-galaxy";
      canvas.dataset.presentation = "full-screen-webgl";
      canvas.dataset.audioAnalysis = "fft-spectrum-flux-waveform";
      canvas.dataset.reactivity = "fft8-local-timbre-regions";
      canvas.dataset.motionProfile = "fourfold-single-direction-galactic-drift";
      canvas.dataset.formLanguage = "spiral-nebula-starfield";
      canvas.dataset.palette = "stellar-obafgkm-and-emission-nebulae";
      canvas.dataset.illumination = "per-cluster-spectral-bin";
      canvas.dataset.timbreBins = "8";
      canvas.dataset.motionRate = "4x";
      canvas.dataset.dragControl = "left-pointer-orbit-3d";
      canvas.dataset.geometryPoints = String(pointCount);
      return true;
    };

    const initFallback = () => {
      fallback = canvas.getContext("2d");
      canvas.dataset.renderer = fallback ? "canvas2d" : "unavailable";
      canvas.dataset.visualizer = "audio-reactive-deep-galaxy";
      canvas.dataset.presentation = "full-screen-webgl";
      canvas.dataset.audioAnalysis = "fft-spectrum-flux-waveform";
      canvas.dataset.reactivity = "fft8-local-timbre-regions";
      canvas.dataset.motionProfile = "fourfold-single-direction-galactic-drift";
      canvas.dataset.formLanguage = "spiral-nebula-starfield";
      canvas.dataset.palette = "stellar-obafgkm-and-emission-nebulae";
      canvas.dataset.illumination = "per-cluster-spectral-bin";
      canvas.dataset.timbreBins = "8";
      canvas.dataset.motionRate = "4x";
      canvas.dataset.dragControl = "left-pointer-orbit-3d";
      return Boolean(fallback);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(reduced ? 1 : 1.15, window.devicePixelRatio || 1);
      const width = Math.max(1, Math.round(rect.width * ratio));
      const height = Math.max(1, Math.round(rect.height * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    const easeBand = (current, target, attack, release) => (
      current + (target - current) * (target > current ? attack : release)
    );

    const updateAudioState = (state) => {
      const active = Boolean(state.analysisActive);
      const strongestBand = active ? Math.max(0, ...(state.bands || [0, 0, 0])) : 0;
      const targetGain = active
        ? Math.max(1, Math.min(3.2, 0.48 / Math.max(0.08, strongestBand)))
        : 1;
      const gainEase = targetGain < automaticGain ? 0.12 : (active ? 0.04 : 0.018);
      automaticGain += (targetGain - automaticGain) * gainEase;
      for (let index = 0; index < 3; index += 1) {
        const boosted = active ? Math.max(0, (state.bands?.[index] || 0) * automaticGain) : 0;
        const compressed = boosted / (0.52 + boosted);
        const shaped = Math.pow(Math.min(0.96, compressed), 0.78);
        smoothedBands[index] = easeBand(smoothedBands[index], shaped, reduced ? 0.16 : 0.34, reduced ? 0.055 : 0.12);
      }
      const activeEnergy = active
        ? Math.min(1, (state.rms || 0) * automaticGain * 2.7 + smoothedBands[0] * 0.32 + smoothedBands[1] * 0.20)
        : 0;
      smoothedEnergy = easeBand(smoothedEnergy, activeEnergy, reduced ? 0.11 : 0.20, reduced ? 0.040 : 0.065);

      const spectrum = active && Array.isArray(state.spectrum) ? state.spectrum : [];
      for (let bin = 0; bin < smoothedTimbreBins.length; bin += 1) {
        let squaredEnergy = 0;
        for (let offset = 0; offset < 4; offset += 1) {
          const sample = Math.max(0, Math.min(1, spectrum[bin * 4 + offset] || 0));
          squaredEnergy += sample * sample;
        }
        const rootMeanSquare = Math.sqrt(squaredEnergy / 4);
        const boosted = active ? rootMeanSquare * automaticGain * 1.45 : 0;
        const compressed = boosted / (0.34 + boosted);
        const shaped = Math.pow(Math.min(0.98, compressed), 0.82);
        smoothedTimbreBins[bin] = easeBand(
          smoothedTimbreBins[bin],
          shaped,
          reduced ? 0.14 : 0.38,
          reduced ? 0.035 : 0.085,
        );
      }
      let spectralFlux = 0;
      for (let index = 0; index < previousSpectrum.length; index += 1) {
        const sample = Math.max(0, Math.min(1, spectrum[index] || 0));
        spectralFlux += Math.max(0, sample - previousSpectrum[index]);
        previousSpectrum[index] += (sample - previousSpectrum[index]) * (sample > previousSpectrum[index] ? 0.38 : 0.08);
      }
      spectralFlux = Math.min(1, spectralFlux * automaticGain * 0.32);
      smoothedFlux = easeBand(smoothedFlux, spectralFlux, reduced ? 0.16 : 0.32, reduced ? 0.045 : 0.09);

      const waveform = active && Array.isArray(state.waveform) ? state.waveform : [];
      let waveProjection = 0;
      for (let index = 0; index < waveform.length; index += 1) {
        waveProjection += (waveform[index] || 0) * Math.sin(index * 0.71 + 0.4);
      }
      const projectedWave = waveform.length > 0
        ? Math.max(-1, Math.min(1, waveProjection / Math.sqrt(waveform.length) * 0.72))
        : 0;
      smoothedWave += (projectedWave - smoothedWave) * (reduced ? 0.05 : 0.085);

      const bassAttack = Math.max(0, smoothedBands[0] - previousBass);
      previousBass = smoothedBands[0];
      const pulseTarget = active
        ? Math.min(1, bassAttack * 2.2 + smoothedFlux * 0.55 + (state.peak || 0) * automaticGain * 0.16)
        : 0;
      smoothedPulse = easeBand(smoothedPulse, pulseTarget, reduced ? 0.16 : 0.34, reduced ? 0.035 : 0.065);
      visualResponses[0] = Math.min(1, smoothedBands[0] * 0.62 + smoothedEnergy * 0.42 + smoothedPulse * 0.92);
      visualResponses[1] = Math.min(1, smoothedBands[1] * 0.94 + smoothedFlux * 0.82 + Math.abs(smoothedWave) * 0.34);
      visualResponses[2] = Math.min(1, smoothedBands[2] * 1.18 + smoothedFlux * 1.32);
      canvas.dataset.analysisActive = String(active);
      canvas.dataset.bass = smoothedBands[0].toFixed(3);
      canvas.dataset.mid = smoothedBands[1].toFixed(3);
      canvas.dataset.high = smoothedBands[2].toFixed(3);
      canvas.dataset.energy = smoothedEnergy.toFixed(3);
      canvas.dataset.pulse = smoothedPulse.toFixed(3);
      canvas.dataset.flux = smoothedFlux.toFixed(3);
      canvas.dataset.wave = smoothedWave.toFixed(3);
      canvas.dataset.densityResponse = visualResponses[0].toFixed(3);
      canvas.dataset.meanderResponse = visualResponses[1].toFixed(3);
      canvas.dataset.causticResponse = visualResponses[2].toFixed(3);
      canvas.dataset.timbreProfile = Array.from(smoothedTimbreBins, (value) => value.toFixed(3)).join(",");
      let dominantTimbre = 0;
      for (let index = 1; index < smoothedTimbreBins.length; index += 1) {
        if (smoothedTimbreBins[index] > smoothedTimbreBins[dominantTimbre]) dominantTimbre = index;
      }
      canvas.dataset.dominantTimbre = String(dominantTimbre);
    };

    const drawFallback = (state, now) => {
      if (!fallback) return;
      updateAudioState(state);
      const width = canvas.width;
      const height = canvas.height;
      const t = (now - visualStartedAt) * 0.001 * (reduced ? 0.16 : 2.08);
      const centerX = width * (0.5 + Math.sin(t * 0.12) * 0.012);
      const centerY = height * (0.5 + Math.cos(t * 0.10) * 0.01);
      const background = fallback.createRadialGradient(centerX, centerY, 0, centerX, centerY, width * 0.72);
      background.addColorStop(0, "rgba(10, 74, 122, .18)");
      background.addColorStop(0.35, "rgba(3, 17, 48, .2)");
      background.addColorStop(1, "rgba(0, 2, 16, .05)");
      fallback.globalCompositeOperation = "source-over";
      fallback.fillStyle = background;
      fallback.fillRect(0, 0, width, height);

      fallback.save();
      fallback.globalCompositeOperation = "screen";
      const zoneColors = ["#9bb0ff", "#aabfff", "#cad7ff", "#f8f7ff", "#fff4ea", "#ffd2a1", "#ff8c52", "#9adbd7"];
      for (let depth = 0; depth < 15; depth += 1) {
        const travel = (depth / 15 + t * (0.018 + smoothedBands[1] * 0.025)) % 1;
        const zone = depth % smoothedTimbreBins.length;
        const zoneResponse = smoothedTimbreBins[zone];
        const scale = 0.04 + travel * travel * 1.05;
        const halfW = width * scale;
        const halfH = height * scale * 0.58;
        fallback.strokeStyle = zoneColors[zone];
        fallback.globalAlpha = 0.025 + travel * 0.09 + zoneResponse * 0.12;
        fallback.lineWidth = 0.6 + travel * 1.1;
        fallback.strokeRect(centerX - halfW, centerY - halfH, halfW * 2, halfH * 2);
        const columns = 12;
        const rows = 7;
        for (let column = 0; column <= columns; column += 1) {
          for (let row = 0; row <= rows; row += 1) {
            const x = centerX - halfW + (column / columns) * halfW * 2;
            const y = centerY - halfH + (row / rows) * halfH * 2;
            const shimmer = 0.42 + 0.58 * Math.sin(t * 1.7 + depth * 1.9 + column * 2.3 + row);
            const size = 0.45 + travel * 2.2 + zoneResponse * (zone >= 5 ? 1.5 : 1.15);
            fallback.globalAlpha = 0.06 + travel * 0.20 + zoneResponse * 0.30 * Math.max(0.24, shimmer);
            fallback.fillStyle = zoneColors[zone];
            fallback.shadowColor = fallback.fillStyle;
            fallback.shadowBlur = 5 + size * 4;
            fallback.beginPath();
            fallback.arc(x, y, size, 0, Math.PI * 2);
            fallback.fill();
          }
        }
      }
      fallback.restore();
      fallback.globalAlpha = 1;
    };

    const draw = (state, now = performance.now()) => {
      const frameInterval = reduced ? 84 : (innerWidth <= 720 ? 22 : 16);
      if (now - lastDrawAt < frameInterval) return;
      lastDrawAt = now;
      resize();
      if (!gl || !program || gl.isContextLost()) {
        drawFallback(state, now);
        return;
      }

      updateAudioState(state);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
      const stride = 8 * Float32Array.BYTES_PER_ELEMENT;
      gl.enableVertexAttribArray(attributes.position);
      gl.vertexAttribPointer(attributes.position, 3, gl.FLOAT, false, stride, 0);
      gl.enableVertexAttribArray(attributes.seed);
      gl.vertexAttribPointer(attributes.seed, 1, gl.FLOAT, false, stride, 3 * Float32Array.BYTES_PER_ELEMENT);
      gl.enableVertexAttribArray(attributes.kind);
      gl.vertexAttribPointer(attributes.kind, 1, gl.FLOAT, false, stride, 4 * Float32Array.BYTES_PER_ELEMENT);
      gl.enableVertexAttribArray(attributes.pointSize);
      gl.vertexAttribPointer(attributes.pointSize, 1, gl.FLOAT, false, stride, 5 * Float32Array.BYTES_PER_ELEMENT);
      gl.enableVertexAttribArray(attributes.tone);
      gl.vertexAttribPointer(attributes.tone, 1, gl.FLOAT, false, stride, 6 * Float32Array.BYTES_PER_ELEMENT);
      gl.enableVertexAttribArray(attributes.temperature);
      gl.vertexAttribPointer(attributes.temperature, 1, gl.FLOAT, false, stride, 7 * Float32Array.BYTES_PER_ELEMENT);
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.time, (now - visualStartedAt) * 0.001 * (reduced ? 0.16 : 2.08));
      gl.uniform1f(uniforms.bass, smoothedBands[0]);
      gl.uniform1f(uniforms.mid, smoothedBands[1]);
      gl.uniform1f(uniforms.high, smoothedBands[2]);
      gl.uniform1f(uniforms.pulse, smoothedPulse);
      gl.uniform1f(uniforms.flux, smoothedFlux);
      gl.uniform1f(uniforms.wave, smoothedWave);
      gl.uniform1f(uniforms.densityResponse, visualResponses[0]);
      gl.uniform1f(uniforms.meanderResponse, visualResponses[1]);
      gl.uniform1f(uniforms.causticResponse, visualResponses[2]);
      gl.uniform1f(uniforms.playing, state.playing ? 1 : 0);
      const trackIndex = Math.max(0, Object.keys(tracks).indexOf(state.track));
      gl.uniform1f(uniforms.trackHue, trackIndex / Math.max(1, Object.keys(tracks).length - 1));
      gl.uniform4f(uniforms.timbreLow, smoothedTimbreBins[0], smoothedTimbreBins[1], smoothedTimbreBins[2], smoothedTimbreBins[3]);
      gl.uniform4f(uniforms.timbreHigh, smoothedTimbreBins[4], smoothedTimbreBins[5], smoothedTimbreBins[6], smoothedTimbreBins[7]);
      viewRotation[0] += (targetViewRotation[0] - viewRotation[0]) * 0.13;
      viewRotation[1] += (targetViewRotation[1] - viewRotation[1]) * 0.13;
      gl.uniform2f(uniforms.viewRotation, viewRotation[0], viewRotation[1]);
      gl.drawArrays(gl.POINTS, 0, pointCount);
      if (renderedFrames === 0) {
        canvas.dataset.webglError = String(gl.getError());
      }
      renderedFrames += 1;
      canvas.dataset.webglFrame = String(renderedFrames);
      canvas.dataset.viewYaw = viewRotation[0].toFixed(4);
      canvas.dataset.viewPitch = viewRotation[1].toFixed(4);
    };

    const finishDrag = (event) => {
      if (event.pointerId !== dragPointerId) return;
      if (layer.hasPointerCapture?.(event.pointerId)) layer.releasePointerCapture(event.pointerId);
      dragPointerId = null;
      layer.classList.remove("is-dragging-visualizer");
      canvas.dataset.dragging = "false";
    };

    layer.addEventListener("pointerdown", (event) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      if (event.target.closest("button, input, label, a, select, textarea")) return;
      dragPointerId = event.pointerId;
      dragX = event.clientX;
      dragY = event.clientY;
      layer.setPointerCapture?.(event.pointerId);
      layer.classList.add("is-dragging-visualizer");
      canvas.dataset.dragging = "true";
      event.preventDefault();
    });
    layer.addEventListener("pointermove", (event) => {
      if (event.pointerId !== dragPointerId) return;
      const deltaX = event.clientX - dragX;
      const deltaY = event.clientY - dragY;
      dragX = event.clientX;
      dragY = event.clientY;
      targetViewRotation[0] = Math.max(-0.42, Math.min(0.42, targetViewRotation[0] + deltaX / Math.max(480, innerWidth) * 1.22));
      targetViewRotation[1] = Math.max(-0.30, Math.min(0.30, targetViewRotation[1] - deltaY / Math.max(360, innerHeight) * 0.94));
      event.preventDefault();
    });
    layer.addEventListener("pointerup", finishDrag);
    layer.addEventListener("pointercancel", finishDrag);

    canvas.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      canvas.dataset.renderer = "context-lost";
    });
    canvas.addEventListener("webglcontextrestored", () => {
      program = null;
      pointBuffer = null;
      pointCount = 0;
      attributes = null;
      uniforms = null;
      visualStartedAt = performance.now();
      initWebGL();
    });
    if (!initWebGL()) initFallback();
    return { draw };
  };

  const drawSignalRibbon = (state, now = performance.now()) => {
    if (!(signalRibbonCanvas instanceof HTMLCanvasElement)) return;
    const rect = signalRibbonCanvas.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);
    const pixelWidth = Math.max(1, Math.round(width * dpr));
    const pixelHeight = Math.max(1, Math.round(height * dpr));
    if (signalRibbonCanvas.width !== pixelWidth || signalRibbonCanvas.height !== pixelHeight) {
      signalRibbonCanvas.width = pixelWidth;
      signalRibbonCanvas.height = pixelHeight;
    }
    const context = signalRibbonCanvas.getContext("2d");
    if (!context) return;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.globalCompositeOperation = "lighter";

    const clock = now * 0.001;
    const waveform = state?.waveform;
    const active = Boolean(state?.analysisActive && waveform?.length);
    const energy = Math.max(0, Math.min(1, state?.rms ? state.rms * 3.4 : 0));
    const bandLift = Math.max(0, Math.min(1, Math.max(...(state?.bands || [0, 0, 0])) * 1.8));
    const sampleAt = (position, phase = 0) => {
      if (active) {
        const sampleIndex = Math.min(waveform.length - 1, Math.floor(position * waveform.length));
        const raw = Number(waveform[sampleIndex]) || 0;
        return Math.abs(raw) <= 1 ? raw : (raw - 128) / 128;
      }
      return Math.sin(position * 13.6 + clock * 0.52 + phase) * 0.32
        + Math.sin(position * 31.0 - clock * 0.34 + phase * 0.7) * 0.12;
    };
    const drawWave = ({ baseline, amplitude, alpha, width: strokeWidth, phase = 0, frequency = 1 }) => {
      const gradient = context.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, `rgba(110, 236, 215, ${alpha * 0.12})`);
      gradient.addColorStop(0.16, `rgba(172, 255, 239, ${alpha})`);
      gradient.addColorStop(0.58, `rgba(121, 229, 209, ${alpha * 0.72})`);
      gradient.addColorStop(1, `rgba(91, 194, 182, ${alpha * 0.08})`);
      context.beginPath();
      for (let x = -8; x <= width + 8; x += 2) {
        const position = Math.max(0, Math.min(1, x / Math.max(1, width)));
        const envelope = Math.sin(position * Math.PI);
        const drift = Math.sin(position * Math.PI * 4.4 * frequency + clock * 0.46 + phase) * amplitude * 0.34;
        const signal = sampleAt(position, phase) * amplitude * (0.34 + energy * 0.56 + bandLift * 0.24) * envelope;
        const y = baseline + drift + signal;
        if (x > -8) context.lineTo(x, y);
        else context.moveTo(x, y);
      }
      context.strokeStyle = gradient;
      context.lineWidth = strokeWidth;
      context.shadowColor = "rgba(123, 255, 231, 0.58)";
      context.shadowBlur = strokeWidth > 1 ? 8 : 3;
      context.stroke();
    };

    drawWave({ baseline: height * 0.43, amplitude: 13, alpha: 0.58, width: 1.25 });
    drawWave({ baseline: height * 0.43, amplitude: 18, alpha: 0.16, width: 0.7, phase: 1.7, frequency: 0.78 });
    drawWave({ baseline: height * 0.72, amplitude: 9, alpha: 0.13, width: 0.65, phase: 3.2, frequency: 0.62 });

    signalRibbonCanvas.dataset.active = String(active);
    signalRibbonCanvas.dataset.frame = String((Number(signalRibbonCanvas.dataset.frame) || 0) + 1);
    signalRibbonCanvas.dataset.waveform = "live-signal-ribbon";
  };

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainder = Math.floor(seconds % 60);
    return `${minutes}:${String(remainder).padStart(2, "0")}`;
  };

  const render = (state = getAudio()?.getPlaybackState?.()) => {
    const activeTrack = tracks[state?.track] ? state.track : "opening";
    const metadata = tracks[activeTrack];
    const volumePercent = Math.round(Math.max(0, Math.min(1, state?.volume ?? 0.1)) * 100);
    const trackDuration = state?.duration || 0;
    const elapsed = state?.currentTime || 0;
    const isPlaying = Boolean(state?.playing && !state?.muted);
    const analysis = getAudio()?.getAnalysisFrame?.();

    visualizerState = {
      playing: isPlaying,
      volume: state?.volume ?? 0.1,
      outputVolume: state?.outputVolume ?? 0,
      currentTime: elapsed,
      duration: trackDuration,
      track: activeTrack,
      bands: analysis?.bands || [0, 0, 0],
      spectrum: analysis?.spectrum || Array(32).fill(0),
      waveform: analysis?.waveform || Array(64).fill(0),
      peak: analysis?.peak || 0,
      rms: analysis?.rms || 0,
      analysisActive: Boolean(analysis?.active),
      analysisSupported: Boolean(analysis?.supported),
    };

    layer.dataset.playing = String(isPlaying);
    layer.dataset.analysis = analysis?.active ? "live" : (analysis?.supported ? "ready" : "unavailable");
    layer.dataset.track = activeTrack;
    playButton?.setAttribute("aria-pressed", String(isPlaying));
    playButton?.setAttribute("aria-label", isPlaying ? "一時停止する" : "再生する");
    if (trackNumber) trackNumber.textContent = metadata.number;
    if (trackTitle) trackTitle.textContent = metadata.title;
    if (description) description.textContent = metadata.description;
    if (currentTime) currentTime.textContent = formatTime(elapsed);
    if (duration) duration.textContent = formatTime(trackDuration);
    if (volume instanceof HTMLInputElement) volume.value = String(volumePercent);
    if (volumeValue) volumeValue.textContent = `${volumePercent}%`;

    if (!isScrubbing && progress instanceof HTMLInputElement) {
      progress.value = trackDuration > 0 ? String(Math.round((elapsed / trackDuration) * 1000)) : "0";
      progress.disabled = trackDuration <= 0;
    }

    trackButtons.forEach((button) => {
      button.setAttribute("aria-current", String(button.dataset.soundTrack === activeTrack));
    });
  };

  const tick = () => {
    render();
    visualizerRuntime?.draw?.(visualizerState);
    drawSignalRibbon(visualizerState);
    if (isOpen) animationFrame = requestAnimationFrame(tick);
  };

  const open = () => {
    if (isOpen) return;
    if (window.location.hash !== "#sound") {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#sound`);
    }
    isOpen = true;
    lastFocused = document.activeElement;
    layer.hidden = false;
    layer.setAttribute("aria-hidden", "false");
    document.body.classList.add("sound-mode-open");
    visualizerRuntime ||= createSoundVisualizer(visualizerCanvas);
    render();
    requestAnimationFrame(() => {
      layer.classList.add("is-open");
      closeButton?.focus({ preventScroll: true });
    });
    cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(tick);
  };

  const close = ({ updateHash = true } = {}) => {
    if (!isOpen) return;
    isOpen = false;
    layer.classList.remove("is-open");
    layer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("sound-mode-open");
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    window.setTimeout(() => {
      if (!isOpen) layer.hidden = true;
    }, 260);
    if (updateHash && window.location.hash === "#sound") {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#top`);
    }
    if (lastFocused instanceof HTMLElement) lastFocused.focus({ preventScroll: true });
  };

  const togglePlayback = async () => {
    const api = getAudio();
    if (!api) return;
    const analysisReady = api.enableAnalysis?.();
    const state = api.getState();
    if (state.playing && !state.muted) {
      await api.setMuted(true);
    } else {
      await api.start(state.volume);
    }
    await analysisReady;
    render();
  };

  openButtons.forEach((button) => button.addEventListener("click", open));
  closeButton?.addEventListener("click", close);
  window.addEventListener("hashchange", () => {
    if (window.location.hash === "#sound") open();
    else if (isOpen) close({ updateHash: false });
  });
  playButton?.addEventListener("click", togglePlayback);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    } else if (isOpen && animationFrame === 0) {
      animationFrame = requestAnimationFrame(tick);
    }
  });

  trackButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const track = button.dataset.soundTrack;
      if (!tracks[track]) return;
      const api = getAudio();
      const analysisReady = api?.enableAnalysis?.();
      await api?.switchTrack?.(track, 0.35);
      const state = api?.getState?.();
      if (state?.muted || !state?.playing) await api?.start?.(state?.volume);
      await analysisReady;
      render();
    });
  });

  progress?.addEventListener("pointerdown", () => { isScrubbing = true; });
  progress?.addEventListener("input", () => {
    if (!(progress instanceof HTMLInputElement)) return;
    const state = getAudio()?.getPlaybackState?.();
    const previewTime = (Number(progress.value) / 1000) * (state?.duration || 0);
    if (currentTime) currentTime.textContent = formatTime(previewTime);
  });
  progress?.addEventListener("change", () => {
    if (!(progress instanceof HTMLInputElement)) return;
    const state = getAudio()?.getPlaybackState?.();
    getAudio()?.seek?.((Number(progress.value) / 1000) * (state?.duration || 0));
    isScrubbing = false;
    render();
  });
  progress?.addEventListener("pointerup", () => { isScrubbing = false; });

  volume?.addEventListener("input", () => {
    if (!(volume instanceof HTMLInputElement)) return;
    getAudio()?.setVolume?.(Number(volume.value) / 100, 0.08);
    render();
  });

  window.addEventListener("gaia:audio-state", (event) => render(event.detail));
  document.addEventListener("keydown", (event) => {
    if (!isOpen) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.code === "Space" && !event.target.closest("button, input, a")) {
      event.preventDefault();
      void togglePlayback();
    }
  });

  render();
  if (window.location.hash === "#sound") {
    open();
  }
})();
