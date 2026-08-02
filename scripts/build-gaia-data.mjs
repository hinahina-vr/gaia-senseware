import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { inflateRawSync, inflateSync } from "node:zlib";
import { enrichSnapshotWithStatistics } from "./statistics.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = resolve(scriptDirectory, "..");
const outputPath = resolve(projectDirectory, "data", "gaia-signals.json");
const retrievedAt = new Date().toISOString();

const URLS = Object.freeze({
  noaaCo2: "https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_mm_mlo.csv",
  gistemp: "https://data.giss.nasa.gov/gistemp/tabledata_v4/GLB.Ts+dSST.csv",
  jmaCo2: "https://www.data.jma.go.jp/ghg/kanshi/obs/co2_yearave.csv",
  gosatGallery: "https://data2.gosat.nies.go.jp/gallery/fts_l3_swir_co2_gallery_en.html",
  gosatImagePage: "https://data2.gosat.nies.go.jp/gallery/fts_l3_swir_co2_gallery_en_image.html?image=1",
  gosatGalleryBase: "https://data2.gosat.nies.go.jp/gallery/",
  gosatScale: "https://data2.gosat.nies.go.jp/gallery/v0305_L3/L3_XCO2_Scale_370-435.png",
  oscar: "https://podaac.jpl.nasa.gov/dataset/oscar_l4_oc_nrt_v2.0",
  currents:
    "https://coastwatch.noaa.gov/erddap/griddap/noaacwBLENDEDNRTcurrentsDaily.csv?u_current%5B3345%5D%5B120:120:600%5D%5B0:240:1200%5D,v_current%5B3345%5D%5B120:120:600%5D%5B0:240:1200%5D",
  currentsJapan:
    "https://coastwatch.noaa.gov/erddap/griddap/noaacwBLENDEDNRTcurrentsDaily.csv?u_current%5B3345%5D%5B440:16:552%5D%5B1208:16:1336%5D,v_current%5B3345%5D%5B440:16:552%5D%5B1208:16:1336%5D",
  power: "https://power.larc.nasa.gov/api/temporal/climatology/point",
  jaxaFnf: "https://www.eorc.jaxa.jp/ALOS/en/dataset/fnf_e.htm",
  gpm: "https://gpm.nasa.gov/data/imerg",
  globi:
    "https://api.globalbioticinteractions.org/interaction.csv?sourceTaxon=Apis%20mellifera&interactionType=pollinates&limit=24",
  gbif: "https://api.gbif.org/v1/occurrence/search",
  unSdg: "https://unstats.un.org/SDGAPI/v1/sdg/Series/List",
  unSdgMunicipalRecycling: "https://unstats.un.org/SDGAPI/v1/sdg/Series/Data",
  moeWaste: "https://www.env.go.jp/press/press_03502.html",
  edgar: "https://edgar.jrc.ec.europa.eu/dataset_ghg2025",
  gibs: "https://gibs.earthdata.nasa.gov/layer-metadata/v1.0/VIIRS_Night_Lights.json",
  nies: "https://www.nies.go.jp/pr/news-and-updates/2026/Press20260414.html",
  jmaQuake: "https://www.data.jma.go.jp/eqdb/data/shindo/",
  usgs: "https://earthquake.usgs.gov/fdsnws/event/1/query",
  mlitDid: "https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-A16-2020.html",
  unesco: "https://whc.unesco.org/en/list/",
  worldBank: "https://api.worldbank.org/v2/country",
  gibsNightLights:
    "https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&LAYERS=VIIRS_Night_Lights&STYLES=&FORMAT=image%2Fpng&TRANSPARENT=TRUE&WIDTH=1024&HEIGHT=1024&SRS=EPSG%3A3857&BBOX=-20037508.34,-20037508.34,20037508.34,20037508.34&TIME=2016-01-01",
  gibsLandCover:
    "https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&LAYERS=MODIS_Combined_L3_IGBP_Land_Cover_Type_Annual&STYLES=&FORMAT=image%2Fpng&TRANSPARENT=TRUE&WIDTH=1024&HEIGHT=1024&SRS=EPSG%3A3857&BBOX=-20037508.34,-20037508.34,20037508.34,20037508.34&TIME=2023-01-01",
  repos: "https://repos.env.go.jp/",
  occto: "https://www.occto.or.jp/institution/keitoujouhou/",
});

const sleep = (milliseconds) => new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));
const mapInBatches = async (items, batchSize, mapper) => {
  const results = [];
  for (let index = 0; index < items.length; index += batchSize) {
    results.push(...await Promise.all(items.slice(index, index + batchSize).map(mapper)));
  }
  return results;
};

const fetchText = async (url, { attempts = 3, timeout = 45_000 } = {}) => {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { "user-agent": "GAIA-SENSEWARE data snapshot builder/1.0" },
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await sleep(attempt * 700);
    } finally {
      clearTimeout(timer);
    }
  }
  console.warn(`Snapshot fetch skipped: ${url}\n  ${lastError?.message || lastError}`);
  return "";
};

const fetchJson = async (url, options) => {
  const text = await fetchText(url, options);
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (error) {
    console.warn(`Snapshot JSON parse skipped: ${url}\n  ${error.message}`);
    return null;
  }
};

const fetchBuffer = async (url, { attempts = 3, timeout = 45_000 } = {}) => {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { "user-agent": "GAIA-SENSEWARE data snapshot builder/1.0" },
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await sleep(attempt * 700);
    } finally {
      clearTimeout(timer);
    }
  }
  console.warn(`Snapshot fetch skipped: ${url}\n  ${lastError?.message || lastError}`);
  return null;
};

const readZipEntries = (buffer) => {
  if (!buffer) return new Map();
  let eocdOffset = -1;
  for (let offset = buffer.length - 22; offset >= Math.max(0, buffer.length - 65_557); offset -= 1) {
    if (buffer.readUInt32LE(offset) === 0x06054b50) {
      eocdOffset = offset;
      break;
    }
  }
  if (eocdOffset < 0) throw new Error("ZIP end-of-central-directory not found");
  const entryCount = buffer.readUInt16LE(eocdOffset + 10);
  let centralOffset = buffer.readUInt32LE(eocdOffset + 16);
  const entries = new Map();
  for (let entryIndex = 0; entryIndex < entryCount; entryIndex += 1) {
    if (buffer.readUInt32LE(centralOffset) !== 0x02014b50) break;
    const method = buffer.readUInt16LE(centralOffset + 10);
    const compressedSize = buffer.readUInt32LE(centralOffset + 20);
    const fileNameLength = buffer.readUInt16LE(centralOffset + 28);
    const extraLength = buffer.readUInt16LE(centralOffset + 30);
    const commentLength = buffer.readUInt16LE(centralOffset + 32);
    const localOffset = buffer.readUInt32LE(centralOffset + 42);
    const name = buffer.toString("utf8", centralOffset + 46, centralOffset + 46 + fileNameLength);
    const localNameLength = buffer.readUInt16LE(localOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localOffset + 28);
    const dataOffset = localOffset + 30 + localNameLength + localExtraLength;
    const compressed = buffer.subarray(dataOffset, dataOffset + compressedSize);
    const data = method === 8 ? inflateRawSync(compressed) : method === 0 ? compressed : null;
    if (data) entries.set(name, data);
    centralOffset += 46 + fileNameLength + extraLength + commentLength;
  }
  return entries;
};

const paeth = (left, above, upperLeft) => {
  const prediction = left + above - upperLeft;
  const leftDistance = Math.abs(prediction - left);
  const aboveDistance = Math.abs(prediction - above);
  const upperLeftDistance = Math.abs(prediction - upperLeft);
  if (leftDistance <= aboveDistance && leftDistance <= upperLeftDistance) return left;
  return aboveDistance <= upperLeftDistance ? above : upperLeft;
};

const decodePng = (buffer) => {
  if (!buffer || buffer.toString("hex", 0, 8) !== "89504e470d0a1a0a") {
    throw new Error("Unsupported PNG signature");
  }
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  let interlace = 0;
  const idat = [];
  for (let offset = 8; offset < buffer.length;) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString("ascii", offset + 4, offset + 8);
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      interlace = data[12];
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") {
      break;
    }
    offset += length + 12;
  }
  if (bitDepth !== 8 || ![2, 6].includes(colorType) || interlace !== 0) {
    throw new Error(`Unsupported PNG format: depth=${bitDepth} color=${colorType} interlace=${interlace}`);
  }
  const channels = colorType === 6 ? 4 : 3;
  const stride = width * channels;
  const inflated = inflateSync(Buffer.concat(idat));
  const pixels = Buffer.alloc(width * height * channels);
  let sourceOffset = 0;
  for (let row = 0; row < height; row += 1) {
    const filter = inflated[sourceOffset];
    sourceOffset += 1;
    const rowOffset = row * stride;
    for (let columnByte = 0; columnByte < stride; columnByte += 1) {
      const raw = inflated[sourceOffset + columnByte];
      const left = columnByte >= channels ? pixels[rowOffset + columnByte - channels] : 0;
      const above = row > 0 ? pixels[rowOffset + columnByte - stride] : 0;
      const upperLeft = row > 0 && columnByte >= channels
        ? pixels[rowOffset + columnByte - stride - channels]
        : 0;
      let value = raw;
      if (filter === 1) value = (raw + left) & 255;
      else if (filter === 2) value = (raw + above) & 255;
      else if (filter === 3) value = (raw + Math.floor((left + above) / 2)) & 255;
      else if (filter === 4) value = (raw + paeth(left, above, upperLeft)) & 255;
      else if (filter !== 0) throw new Error(`Unsupported PNG filter: ${filter}`);
      pixels[rowOffset + columnByte] = value;
    }
    sourceOffset += stride;
  }
  return {
    width,
    height,
    channels,
    rgbAt(x, y) {
      const offset = (Math.round(y) * width + Math.round(x)) * channels;
      return [pixels[offset], pixels[offset + 1], pixels[offset + 2]];
    },
  };
};

const parseCsv = (text) => {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '"') {
      if (quoted && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      row.push(field.trim());
      field = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      row.push(field.trim());
      field = "";
      if (row.some(Boolean)) rows.push(row);
      row = [];
    } else {
      field += character;
    }
  }
  if (field || row.length) {
    row.push(field.trim());
    rows.push(row);
  }
  return rows;
};

const numeric = (value) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const takeEvenly = (rows, limit) => {
  if (rows.length <= limit) return rows;
  return Array.from({ length: limit }, (_, index) => rows[Math.round((index / (limit - 1)) * (rows.length - 1))]);
};

const source = ({ id, kind = "SOURCE", organisation, title, url, period, unit, resolution, transformation, caveat, rows = [] }) => ({
  id,
  kind,
  organisation,
  title,
  url,
  retrievedAt,
  period,
  unit,
  resolution,
  transformation,
  caveat,
  preview: rows.slice(0, 10),
});

const noaaRows = parseCsv(await fetchText(URLS.noaaCo2))
  .filter((row) => row.length >= 6 && /^\d{4}$/.test(row[0]))
  .map((row) => ({
    year: Number(row[0]),
    month: Number(row[1]),
    averagePpm: numeric(row[3]),
    deseasonalizedPpm: numeric(row[4]),
  }))
  .filter((row) => row.averagePpm !== null);

const gistempRows = parseCsv(await fetchText(URLS.gistemp))
  .filter((row) => /^\d{4}$/.test(row[0]) && numeric(row[13]) !== null)
  .map((row) => ({ year: Number(row[0]), anomalyC: numeric(row[13]) }));

const jmaBuffer = await fetch(URLS.jmaCo2).then((response) => (response.ok ? response.arrayBuffer() : null)).catch(() => null);
const jmaText = jmaBuffer ? new TextDecoder("shift_jis").decode(jmaBuffer) : "";
const jmaCo2Rows = parseCsv(jmaText)
  .filter((row) => /^\d{4}$/.test(row[0]))
  .map((row) => ({
    year: Number(row[0]),
    ryoriPpm: numeric(row[1]),
    ryoriFlag: row[2]?.trim() || null,
    minamitorishimaPpm: numeric(row[3]),
    minamitorishimaFlag: row[4]?.trim() || null,
    yonagunijimaPpm: numeric(row[5]),
    yonagunijimaFlag: row[6]?.trim() || null,
  }))
  .filter((row) => [row.ryoriPpm, row.minamitorishimaPpm, row.yonagunijimaPpm].some((value) => value !== null));

const gosatSnapshotKeys = [2010, 2015, 2020, 2025]
  .flatMap((year) => [3, 6, 9, 12].map((month) => `${year}${String(month).padStart(2, "0")}`));
const gosatGalleryHtml = await fetchText(URLS.gosatImagePage);
const gosatFramePaths = new Map();
for (const match of gosatGalleryHtml.matchAll(/img\[\d+\]\s*=\s*"\.\/(v0305_L3\/XCO2_L3_(\d{6})\d+_v03\.05\.png)"/g)) {
  gosatFramePaths.set(match[2], match[1]);
}

const gosatScaleBuffer = await fetchBuffer(URLS.gosatScale, { attempts: 2, timeout: 60_000 });
const gosatScaleImage = gosatScaleBuffer ? decodePng(gosatScaleBuffer) : null;
const gosatColorValues = new Map();
if (gosatScaleImage) {
  const scaleLeft = Math.round(gosatScaleImage.width * (77 / 1590));
  const scaleRight = Math.round(gosatScaleImage.width * (1542 / 1590));
  const scaleY = Math.round(gosatScaleImage.height * (48 / 253));
  for (let x = scaleLeft; x <= scaleRight; x += 1) {
    const [red, green, blue] = gosatScaleImage.rgbAt(x, scaleY);
    const chroma = Math.max(red, green, blue) - Math.min(red, green, blue);
    if (chroma < 24 || Math.max(red, green, blue) < 40) continue;
    const value = 370 + ((x - scaleLeft) / Math.max(1, scaleRight - scaleLeft)) * 65;
    gosatColorValues.set(`${red},${green},${blue}`, Math.round(value * 10) / 10);
  }
}

const gosatFrames = [];
const gosatSampleOffsets = [
  [0, 0], [-6, 0], [6, 0], [0, -6], [0, 6],
  [-6, -6], [6, -6], [-6, 6], [6, 6],
];
for (const key of gosatSnapshotKeys) {
  const relativePath = gosatFramePaths.get(key);
  if (!relativePath || gosatColorValues.size === 0) continue;
  const sourceUrl = new URL(relativePath, URLS.gosatGalleryBase).href;
  const imageBuffer = await fetchBuffer(sourceUrl, { attempts: 2, timeout: 60_000 });
  if (!imageBuffer) continue;
  const image = decodePng(imageBuffer);
  const plot = {
    left: image.width * (365 / 4528),
    right: image.width * (4316 / 4528),
    top: image.height * (95 / 2362),
    bottom: image.height * (2073 / 2362),
  };
  const embeddedAnnotationMasks = [
    {
      left: image.width * (2380 / 4528),
      right: image.width * (3980 / 4528),
      top: image.height * (1710 / 2362),
      bottom: image.height * (1840 / 2362),
    },
    {
      left: image.width * (2100 / 4528),
      right: image.width * (2820 / 4528),
      top: image.height * (1620 / 2362),
      bottom: image.height * (1735 / 2362),
    },
  ];
  const values = [];
  for (let latitudeIndex = 0; latitudeIndex < 72; latitudeIndex += 1) {
    const y = plot.top + ((latitudeIndex + 0.5) / 72) * (plot.bottom - plot.top);
    for (let longitudeIndex = 0; longitudeIndex < 144; longitudeIndex += 1) {
      const x = plot.left + ((longitudeIndex + 0.5) / 144) * (plot.right - plot.left);
      let value = null;
      for (const [offsetX, offsetY] of gosatSampleOffsets) {
        const sampleX = x + offsetX;
        const sampleY = y + offsetY;
        const isEmbeddedAnnotation = embeddedAnnotationMasks.some(
          (mask) =>
            sampleX >= mask.left &&
            sampleX <= mask.right &&
            sampleY >= mask.top &&
            sampleY <= mask.bottom,
        );
        if (isEmbeddedAnnotation) continue;
        const [red, green, blue] = image.rgbAt(sampleX, sampleY);
        const decoded = gosatColorValues.get(`${red},${green},${blue}`);
        if (Number.isFinite(decoded)) {
          value = decoded;
          break;
        }
      }
      values.push(value);
    }
  }
  const available = values.filter(Number.isFinite);
  gosatFrames.push({
    date: `${key.slice(0, 4)}-${key.slice(4, 6)}`,
    sourceUrl,
    availableCells: available.length,
    minimumPpm: available.length ? Math.min(...available) : null,
    maximumPpm: available.length ? Math.max(...available) : null,
    values,
  });
  console.log(`GOSAT ${key}: ${available.length}/10368 cells decoded`);
}

const gosatPreviewRows = [];
const gosatPreviewFrame = gosatFrames.at(-1);
if (gosatPreviewFrame) {
  for (let latitudeIndex = 0; latitudeIndex < 72 && gosatPreviewRows.length < 10; latitudeIndex += 1) {
    const latitude = 88.75 - latitudeIndex * 2.5;
    if (latitude < 20 || latitude > 50) continue;
    for (let longitudeIndex = 0; longitudeIndex < 144 && gosatPreviewRows.length < 10; longitudeIndex += 1) {
      const longitude = -178.75 + longitudeIndex * 2.5;
      if (longitude < 120 || longitude > 155) continue;
      const xco2Ppm = gosatPreviewFrame.values[latitudeIndex * 144 + longitudeIndex];
      if (Number.isFinite(xco2Ppm)) {
        gosatPreviewRows.push({ date: gosatPreviewFrame.date, latitude, longitude, xco2Ppm });
      }
    }
  }
}

const meanFinite = (values) => {
  const finite = (values || []).filter(Number.isFinite);
  return finite.length ? finite.reduce((sum, value) => sum + value, 0) / finite.length : null;
};
const closestNoaaRow = (year) => noaaRows.reduce(
  (closest, row) =>
    !closest || Math.abs(row.year + (row.month - 1) / 12 - year) < Math.abs(closest.year + (closest.month - 1) / 12 - year)
      ? row
      : closest,
  null,
);
const firstGosatMean = meanFinite(gosatFrames[0]?.values);
const timelineReconstructionRows = [1958, 1965, 1975, 1985, 1995, 2005, 2009].map((year) => {
  const noaa = closestNoaaRow(year);
  const baselinePpm = noaa?.deseasonalizedPpm ?? noaa?.averagePpm ?? null;
  return {
    year,
    type: "DERIVED_RECONSTRUCTION",
    noaaMaunaLoaBaselinePpm: baselinePpm,
    spatialTemplate: gosatFrames[0]?.date || "2010-03",
    gridOffsetPpm: Number.isFinite(baselinePpm) && Number.isFinite(firstGosatMean)
      ? Number((baselinePpm - firstGosatMean).toFixed(3))
      : null,
  };
});
const parseCurrentRows = (text) => parseCsv(text)
  .filter((row) => /^\d{4}-/.test(row[0]) && numeric(row[1]) !== null)
  .map((row) => ({
    time: row[0],
    lat: numeric(row[1]),
    lon: numeric(row[2]),
    uMs: numeric(row[3]),
    vMs: numeric(row[4]),
  }))
  .filter((row) => row.uMs !== null && row.vMs !== null);

const currentRows = [
  ...parseCurrentRows(await fetchText(URLS.currents, { attempts: 2 })),
  ...parseCurrentRows(await fetchText(URLS.currentsJapan, { attempts: 2 })),
];
const currentTransportRows = currentRows.slice(0, 24).map((row) => {
  const speedMs = Math.hypot(row.uMs, row.vMs);
  return {
    time: row.time,
    lat: row.lat,
    lon: row.lon,
    speedMs: Number(speedMs.toFixed(3)),
    distanceAt14DaysKm: Number((speedMs * 14 * 24 * 3.6).toFixed(1)),
    assumption: "u/v held constant; local advection; not forecast",
  };
});

// These are deliberately distributed reference coordinates, not a claim that a
// point represents a whole country. Country statistics are attached separately
// and labelled COUNTRY VALUE in the work.
const climateSites = [
  { id: "canada", name: "Canada", iso2: "CA", iso3: "CAN", m49: "124", lat: 55, lon: -110 },
  { id: "usa", name: "United States", iso2: "US", iso3: "USA", m49: "840", lat: 39, lon: -98 },
  { id: "mexico", name: "Mexico", iso2: "MX", iso3: "MEX", m49: "484", lat: 23, lon: -102 },
  { id: "cuba", name: "Cuba", iso2: "CU", iso3: "CUB", m49: "192", lat: 21.5, lon: -79.5 },
  { id: "brazil", name: "Brazil", iso2: "BR", iso3: "BRA", m49: "076", lat: -10, lon: -55 },
  { id: "peru", name: "Peru", iso2: "PE", iso3: "PER", m49: "604", lat: -9, lon: -75 },
  { id: "chile", name: "Chile", iso2: "CL", iso3: "CHL", m49: "152", lat: -33, lon: -71 },
  { id: "argentina", name: "Argentina", iso2: "AR", iso3: "ARG", m49: "032", lat: -34, lon: -64 },
  { id: "iceland", name: "Iceland", iso2: "IS", iso3: "ISL", m49: "352", lat: 65, lon: -19 },
  { id: "uk", name: "United Kingdom", iso2: "GB", iso3: "GBR", m49: "826", lat: 54, lon: -2 },
  { id: "spain", name: "Spain", iso2: "ES", iso3: "ESP", m49: "724", lat: 40, lon: -4 },
  { id: "sweden", name: "Sweden", iso2: "SE", iso3: "SWE", m49: "752", lat: 62, lon: 15 },
  { id: "morocco", name: "Morocco", iso2: "MA", iso3: "MAR", m49: "504", lat: 32, lon: -6 },
  { id: "senegal", name: "Senegal", iso2: "SN", iso3: "SEN", m49: "686", lat: 14.5, lon: -14.5 },
  { id: "nigeria", name: "Nigeria", iso2: "NG", iso3: "NGA", m49: "566", lat: 9, lon: 8 },
  { id: "kenya", name: "Kenya", iso2: "KE", iso3: "KEN", m49: "404", lat: 0.5, lon: 37.5 },
  { id: "drc", name: "DR Congo", iso2: "CD", iso3: "COD", m49: "180", lat: -3, lon: 23 },
  { id: "south-africa", name: "South Africa", iso2: "ZA", iso3: "ZAF", m49: "710", lat: -30, lon: 25 },
  { id: "egypt", name: "Egypt", iso2: "EG", iso3: "EGY", m49: "818", lat: 27, lon: 30 },
  { id: "turkiye", name: "Türkiye", iso2: "TR", iso3: "TUR", m49: "792", lat: 39, lon: 35 },
  { id: "saudi-arabia", name: "Saudi Arabia", iso2: "SA", iso3: "SAU", m49: "682", lat: 24, lon: 45 },
  { id: "india", name: "India", iso2: "IN", iso3: "IND", m49: "356", lat: 22, lon: 79 },
  { id: "china", name: "China", iso2: "CN", iso3: "CHN", m49: "156", lat: 35, lon: 103 },
  { id: "mongolia", name: "Mongolia", iso2: "MN", iso3: "MNG", m49: "496", lat: 47, lon: 104 },
  { id: "bangladesh", name: "Bangladesh", iso2: "BD", iso3: "BGD", m49: "050", lat: 24, lon: 90 },
  { id: "thailand", name: "Thailand", iso2: "TH", iso3: "THA", m49: "764", lat: 15, lon: 101 },
  { id: "indonesia", name: "Indonesia", iso2: "ID", iso3: "IDN", m49: "360", lat: -2, lon: 118 },
  { id: "japan", name: "Japan", iso2: "JP", iso3: "JPN", m49: "392", lat: 36, lon: 138 },
  { id: "philippines", name: "Philippines", iso2: "PH", iso3: "PHL", m49: "608", lat: 13, lon: 122 },
  { id: "australia", name: "Australia", iso2: "AU", iso3: "AUS", m49: "036", lat: -25, lon: 134 },
  { id: "new-zealand", name: "New Zealand", iso2: "NZ", iso3: "NZL", m49: "554", lat: -41, lon: 174 },
];

const powerRows = await mapInBatches(climateSites, 4, async (site) => {
  const query = new URLSearchParams({
    parameters: "WS10M,WD10M,T2M,ALLSKY_SFC_SW_DWN,PRECTOTCORR",
    community: "RE",
    longitude: String(site.lon),
    latitude: String(site.lat),
    format: "JSON",
  });
  const payload = await fetchJson(`${URLS.power}?${query}`, { attempts: 2 });
  const parameters = payload?.properties?.parameter || {};
  const annual = (key) => numeric(parameters[key]?.ANN);
  return {
    ...site,
    windSpeedMs: annual("WS10M"),
    windDirectionDeg: annual("WD10M"),
    temperatureC: annual("T2M"),
    solarKwhM2Day: annual("ALLSKY_SFC_SW_DWN"),
    precipitationMmDay: annual("PRECTOTCORR"),
  };
});

const globiRows = parseCsv(await fetchText(URLS.globi))
  .slice(1)
  .filter((row) => row[0] && row[9] && row[11])
  .map((row) => ({
    sourceTaxon: row[1],
    interaction: row[9],
    targetTaxon: row[11],
    latitude: numeric(row[19]),
    longitude: numeric(row[20]),
    study: row[21] || null,
  }));

const gbifRows = (await mapInBatches(climateSites, 4, async (site) => {
  const query = new URLSearchParams({
    scientificName: "Apis mellifera",
    hasCoordinate: "true",
    hasGeospatialIssue: "false",
    country: site.iso2,
    limit: "2",
  });
  const payload = await fetchJson(`${URLS.gbif}?${query}`, { attempts: 2 });
  const rows = [];
  for (const record of payload?.results || []) {
    if (!Number.isFinite(record.decimalLatitude) || !Number.isFinite(record.decimalLongitude)) continue;
    rows.push({
      key: record.key,
      species: record.species || record.scientificName,
      eventDate: record.eventDate || null,
      lat: record.decimalLatitude,
      lon: record.decimalLongitude,
      country: record.country || site.name,
      countryCode: site.iso2,
      basisOfRecord: record.basisOfRecord || null,
      sampling: "two latest coordinate records per selected country",
    });
  }
  return rows;
})).flat();

const fetchWorldBankLatest = async (indicator, valueKey) => {
  const url = `${URLS.worldBank.replace(/\/country$/, "")}/en/indicator/${indicator}?downloadformat=csv`;
  const archive = await fetchBuffer(url, { attempts: 2, timeout: 60_000 });
  if (!archive) return [];
  const entries = readZipEntries(archive);
  const dataEntry = [...entries.entries()].find(([name]) => /^API_.+\.csv$/i.test(name) && !/Metadata_/i.test(name));
  if (!dataEntry) return [];
  const table = parseCsv(dataEntry[1].toString("utf8"));
  const headerIndex = table.findIndex((row) => row[0] === "Country Name" && row[1] === "Country Code");
  if (headerIndex < 0) return [];
  const header = table[headerIndex];
  return table.slice(headerIndex + 1).map((row) => {
    const site = climateSites.find((candidate) => candidate.iso3 === row[1]);
    if (!site) return null;
    for (let column = row.length - 1; column >= 4; column -= 1) {
      const value = numeric(row[column]);
      if (value === null) continue;
      return {
        ...site,
        country: row[0] || site.name,
        year: Number(header[column]),
        [valueKey]: value,
      };
    }
    return null;
  }).filter(Boolean);
};

// Bulk CSV is faster and more stable than long multi-country Indicators API URLs.
const [renewableRows, urbanRows, globalEmissionsRows] = await Promise.all([
  fetchWorldBankLatest("EG.ELC.RNEW.ZS", "renewablePercent"),
  fetchWorldBankLatest("SP.URB.TOTL.IN.ZS", "urbanPercent"),
  fetchWorldBankLatest("EN.GHG.ALL.MT.CE.AR5", "emissionsMtCo2e"),
]);

const recyclingAreaQuery = climateSites.map((site) => `areaCode=${site.m49}`).join("&");
const unRecyclingPayload = await fetchJson(
  `${URLS.unSdgMunicipalRecycling}?seriesCode=EN_MWT_RCYR&${recyclingAreaQuery}&pageSize=2000`,
);
const latestRecyclingByArea = new Map();
for (const row of unRecyclingPayload?.data || []) {
  const value = numeric(row.value);
  if (value === null) continue;
  const key = String(row.geoAreaCode).padStart(3, "0");
  const previous = latestRecyclingByArea.get(key);
  if (!previous || Number(row.timePeriodStart) > previous.year) {
    latestRecyclingByArea.set(key, {
      year: Number(row.timePeriodStart),
      recyclePercent: value,
      source: row.source || null,
      nature: row.attributes?.Nature || null,
      reportingType: row.dimensions?.["Reporting Type"] || null,
    });
  }
}
const globalWasteRows = climateSites
  .map((site) => {
    const row = latestRecyclingByArea.get(site.m49);
    return row ? { ...site, country: site.name, ...row } : null;
  })
  .filter(Boolean);

const usgsPayload = await fetchJson(
  `${URLS.usgs}?format=geojson&starttime=2000-01-01&minmagnitude=7.5&orderby=time-asc&limit=500`,
);
const globalEarthquakeRows = (usgsPayload?.features || []).map((feature) => ({
  id: feature.id,
  occurredAt: new Date(feature.properties.time).toISOString(),
  name: feature.properties.place,
  magnitude: numeric(feature.properties.mag),
  longitude: numeric(feature.geometry?.coordinates?.[0]),
  latitude: numeric(feature.geometry?.coordinates?.[1]),
  depthKm: numeric(feature.geometry?.coordinates?.[2]),
  url: feature.properties.url,
})).filter((row) => row.magnitude !== null && row.longitude !== null && row.latitude !== null);
const featuredEarthquakeCount = Math.min(24, globalEarthquakeRows.length);
const featuredEarthquakeRows = Array.from({ length: featuredEarthquakeCount }, (_, index) => {
  if (featuredEarthquakeCount <= 1) return globalEarthquakeRows[0];
  return globalEarthquakeRows[Math.round((index / (featuredEarthquakeCount - 1)) * (globalEarthquakeRows.length - 1))];
}).filter(Boolean);

const nightLightsAssetPath = resolve(projectDirectory, "assets", "data", "viirs-night-lights-2016.png");
const landCoverAssetPath = resolve(projectDirectory, "assets", "data", "modis-land-cover-2023.png");
const [nightLightsBuffer, landCoverBuffer] = await Promise.all([
  fetchBuffer(URLS.gibsNightLights, { attempts: 2 }),
  fetchBuffer(URLS.gibsLandCover, { attempts: 2 }),
]);
if (nightLightsBuffer) {
  await mkdir(dirname(nightLightsAssetPath), { recursive: true });
  await writeFile(nightLightsAssetPath, nightLightsBuffer);
}
if (landCoverBuffer) {
  await mkdir(dirname(landCoverAssetPath), { recursive: true });
  await writeFile(landCoverAssetPath, landCoverBuffer);
}

const jmaHistory = await readFile(resolve(projectDirectory, "data", "jma-intensity-history.json"), "utf8")
  .then(JSON.parse)
  .catch(() => ({ events: [] }));

const wasteRows = [
  { fiscalYear: 2024, route: "recycling", value: 19.3, unit: "%", type: "SOURCE" },
  { fiscalYear: 2024, route: "final_disposal", value: 3.06, unit: "million tonnes", type: "SOURCE" },
  { fiscalYear: 2024, route: "total_processed", value: 36.861, unit: "million tonnes", type: "SOURCE" },
  { fiscalYear: 2024, route: "final_disposal_share", value: 8.3, unit: "%", type: "DERIVED" },
  { fiscalYear: 2024, route: "incineration_and_other_reduction", value: 72.4, unit: "%", type: "DERIVED" },
];

const emissionsRows = [
  { fiscalYear: 2013, japanNetMtCo2e: 1393.5, type: "DERIVED from 2024 value and stated reduction" },
  { fiscalYear: 2023, japanNetMtCo2e: 1012.8, type: "DERIVED from 2024 value and stated reduction" },
  { fiscalYear: 2024, japanNetMtCo2e: 994, type: "SOURCE" },
];

const didNodes = [
  { name: "札幌DID", lon: 141.35, lat: 43.06 },
  { name: "仙台DID", lon: 140.87, lat: 38.27 },
  { name: "首都圏DID", lon: 139.69, lat: 35.68 },
  { name: "中京DID", lon: 136.91, lat: 35.18 },
  { name: "京阪神DID", lon: 135.5, lat: 34.69 },
  { name: "福岡DID", lon: 130.4, lat: 33.59 },
];

const heritageNodes = [
  { name: "L'Anse aux Meadows", lon: -55.62, lat: 51.6, category: "Cultural", region: "North America" },
  { name: "Yellowstone", lon: -110.5, lat: 44.6, category: "Natural", region: "North America" },
  { name: "Teotihuacan", lon: -98.84, lat: 19.69, category: "Cultural", region: "Central America" },
  { name: "Tikal", lon: -89.62, lat: 17.22, category: "Mixed", region: "Central America" },
  { name: "Galápagos Islands", lon: -90.5, lat: -0.7, category: "Natural", region: "South America" },
  { name: "Machu Picchu", lon: -72.55, lat: -13.16, category: "Mixed", region: "South America" },
  { name: "Los Glaciares", lon: -73.0, lat: -50.0, category: "Natural", region: "South America" },
  { name: "Stonehenge", lon: -1.83, lat: 51.18, category: "Cultural", region: "Europe" },
  { name: "Historic Centre of Rome", lon: 12.49, lat: 41.89, category: "Cultural", region: "Europe" },
  { name: "Thingvellir", lon: -21.13, lat: 64.26, category: "Cultural", region: "Europe" },
  { name: "Memphis and its Necropolis", lon: 31.13, lat: 29.98, category: "Cultural", region: "North Africa" },
  { name: "Timbuktu", lon: -3.0, lat: 16.77, category: "Cultural", region: "West Africa" },
  { name: "Serengeti", lon: 34.57, lat: -2.33, category: "Natural", region: "East Africa" },
  { name: "Robben Island", lon: 18.37, lat: -33.81, category: "Cultural", region: "Southern Africa" },
  { name: "Petra", lon: 35.44, lat: 30.33, category: "Cultural", region: "West Asia" },
  { name: "Persepolis", lon: 52.89, lat: 29.94, category: "Cultural", region: "West Asia" },
  { name: "Taj Mahal", lon: 78.04, lat: 27.17, category: "Cultural", region: "South Asia" },
  { name: "Sagarmatha", lon: 86.91, lat: 27.96, category: "Natural", region: "South Asia" },
  { name: "Angkor", lon: 103.87, lat: 13.43, category: "Cultural", region: "Southeast Asia" },
  { name: "Borobudur", lon: 110.2, lat: -7.61, category: "Cultural", region: "Southeast Asia" },
  { name: "Great Wall", lon: 116.08, lat: 40.43, category: "Cultural", region: "East Asia" },
  { name: "Shirakami-Sanchi", lon: 140.13, lat: 40.47, category: "Natural", region: "East Asia" },
  { name: "Great Barrier Reef", lon: 145.0, lat: -18.0, category: "Natural", region: "Oceania" },
  { name: "Tongariro", lon: 175.57, lat: -39.29, category: "Mixed", region: "Oceania" },
];

const mode = (id, act, question, datasets, signals) => ({ id, act, question, datasets, signals });

const modes = [
  mode(
    "breathing-earth",
    { number: 1, title: "循環を知る", en: "READ THE CYCLES" },
    "増え続ける濃度の中で、一年ごとの呼吸を私たちはどう聴くだろう？",
    [
      source({ id: "gosat-l3-xco2", organisation: "JAXA / NIES / MOE", title: "GOSAT FTS SWIR Level 3 XCO₂ monthly maps V03.05", url: URLS.gosatGallery, period: `${gosatFrames[0]?.date || "2010-03"}–${gosatFrames.at(-1)?.date || "2025-12"}（同梱16時点）`, unit: "ppm XCO₂", resolution: "月次・2.5°格子・クリギング推定", transformation: "公式Level 3閲覧画像の格子色を公式370–435 ppmスケールへ照合", caveat: "Level 3自体がLevel 2観測の空間統計推定。着色域に実観測点があるとは限らない。", rows: gosatFrames.map(({ date, sourceUrl, availableCells, minimumPpm, maximumPpm }) => ({ date, sourceUrl, availableCells, minimumPpm, maximumPpm })) }),
      source({ id: "gosat-gallery-decoded", kind: "DERIVED", organisation: "GAIA SENSEWARE", title: "GOSAT公式閲覧画像から復元したXCO₂色階級", url: "./data/gaia-signals.json", period: `${gosatFrames[0]?.date || "2010-03"}–${gosatFrames.at(-1)?.date || "2025-12"}`, unit: "approx. ppm XCO₂", resolution: "2.5°格子・0.1 ppm表示", transformation: "各格子中心の色を公式スケールへ照合。読めないセルは観測値を上書きせず、別DERIVED層で8近傍IDW補完する。", caveat: "HDF5数値本体ではなく公式閲覧画像から復元した近似値。補完前の観測セル数と補完セル数は統計監査データに保存する。", rows: gosatPreviewRows }),
      source({ id: "co2-past-reconstruction", kind: "DERIVED", organisation: "GAIA SENSEWARE", title: "1958–2009 CO₂空間再構成", url: URLS.noaaCo2, period: "1958–2009", unit: "approx. ppm", resolution: "年次表示・2.5°空間テンプレート", transformation: "NOAA Mauna Loaの非季節調整値に合わせ、最古GOSATグリッド全セルへ同じ差分を加減", caveat: "当時の全球空間観測ではない。2010年の空間模様を過去へ固定した作品内再構成で、地域差の史実を示さない。", rows: timelineReconstructionRows }),
      source({ id: "noaa-co2", organisation: "NOAA Global Monitoring Laboratory", title: "Mauna Loa CO₂ monthly mean", url: URLS.noaaCo2, period: `${noaaRows[0]?.year || 1958}–${noaaRows.at(-1)?.year || 2026}`, unit: "ppm", resolution: "月次・単一観測地点", transformation: "球体版では呼吸と長期増加へ使用。地図版では1958–2009の濃度水準と、直近120か月OLSトレンド投影の学習データに使用", caveat: "火山活動などの影響を品質管理した単一観測地点の月平均で、全球平均や過去の空間分布ではない。", rows: noaaRows }),
      source({ id: "nasa-gistemp", organisation: "NASA GISS", title: "GISTEMP v4 global temperature anomaly", url: URLS.gistemp, period: `${gistempRows[0]?.year || 1880}–${gistempRows.at(-1)?.year || 2025}`, unit: "℃ anomaly", resolution: "年次・全球平均", transformation: "球体版のみ：基準期間1951–1980からの偏差を色の応答へ変換。地図色には不使用", caveat: "気温偏差は絶対気温ではない。", rows: gistempRows }),
      source({ id: "jma-co2", organisation: "気象庁", title: "国内3地点の年平均CO₂濃度", url: URLS.jmaCo2, period: `${jmaCo2Rows[0]?.year || 1987}–${jmaCo2Rows.at(-1)?.year || 2025}`, unit: "ppm", resolution: "年次・綾里／南鳥島／与那国島", transformation: "GOSATとの観測量の違いを確認する比較資料として台帳に収録。観測開始前・終了後は構造的欠測として補完しない", caveat: "衛星XCO₂は大気柱平均、JMAは地上付近の背景大気で同じ観測量ではない。地点ごとに観測期間が異なる。与那国島の観測は2024年3月末で終了。「*」は月平均11個以下、「)」は速報値。", rows: jmaCo2Rows }),
    ],
    {
      gosat: {
        level: "L3",
        version: "03.05",
        type: "DERIVED_FROM_OFFICIAL_BROWSE_RASTER",
        width: 144,
        height: 72,
        resolutionDegrees: 2.5,
        bounds: { west: -180, east: 180, south: -90, north: 90 },
        scale: { minimumPpm: 370, maximumPpm: 435 },
        frames: gosatFrames,
      },
      co2: noaaRows,
      temperature: gistempRows,
      japanCo2: jmaCo2Rows,
    },
  ),
  mode(
    "blue-circulation",
    { number: 1, title: "循環を知る", en: "READ THE CYCLES" },
    "国境を越えて流れる海と風を、誰の資源としてではなく誰との関係として読むか？",
    [
      source({ id: "oscar", organisation: "NASA/JPL PO.DAAC", title: "OSCAR near-surface ocean currents", url: URLS.oscar, period: "1993–present", unit: "m/s", resolution: "約1/3°・5日平均", transformation: "取得安定性のため表示スナップショットはNOAA Blended NRTへ代替し、速度ベクトルを間引く", caveat: "現在の同梱値はOSCARそのものではなくNOAA CoastWatch代替値。台帳で明示する。", rows: [{ status: "catalogued", runtimeSnapshot: "NOAA Blended NRT currents", reason: "OSCAR ERDDAP timeout at build" }] }),
      source({ id: "noaa-current-fallback", organisation: "NOAA CoastWatch", title: "Blended NRT surface currents", url: URLS.currents, period: currentRows[0]?.time || "2026-07-30", unit: "m/s", resolution: "0.25°原データを全球30°×60°、日本周辺4°へ間引き", transformation: "u/vから合成流速を計算し、観測点周辺の固定色尺度と方向矢印へ変換", caveat: "陸上・欠測セルを除外し、観測点間を海流値で塗りつぶさない。OSCAR取得不能時の明示的代替。", rows: currentRows }),
      source({ id: "current-local-advection", kind: "DERIVED", organisation: "GAIA SENSEWARE", title: "0–14 day constant-vector local transport", url: "./scripts/build-gaia-data.mjs", period: `${currentRows[0]?.time || "snapshot"} + 0–14 days`, unit: "km", resolution: "3-hour display steps / source-vector locations", transformation: "各地点のu/vを一定とし、経過秒を掛けて緯度・経度差と移動距離へ変換。地図上は実距離スケールで描画", caveat: "時間変化する海流場を用いた予測ではなく、単一スナップショットによる局所移流の思考実験。航行・漂流判断には使用不可。", rows: currentTransportRows }),
      source({ id: "nasa-power-wind", organisation: "NASA POWER", title: "10 m wind climatology", url: URLS.power, period: "Climatology", unit: "m/s, degree", resolution: `選択${powerRows.length}地点・年平均`, transformation: "風向・風速を海流と別色のベクトルへ変換", caveat: "GLOBAL SAMPLEの気候値であり、現在時刻の風でも全球グリッドでもない。", rows: powerRows }),
    ],
    { currents: currentRows, climate: powerRows },
  ),
  mode(
    "forest-cloud-engine",
    { number: 1, title: "循環を知る", en: "READ THE CYCLES" },
    "森と雨の重なりを、単純な因果ではなく相互作用の入口としてどう読むか？",
    [
      source({ id: "nasa-modis-land-cover", organisation: "NASA GIBS / MODIS", title: "MCD12Q1 IGBP Land Cover Type", url: "https://gibs.earthdata.nasa.gov/layer-metadata/v1.0/MODIS_Combined_L3_IGBP_Land_Cover_Type_Annual.json", period: "2023 annual", unit: "IGBP land-cover class", resolution: "500 m source / 1024×1024 Web Mercator display snapshot", transformation: "公式GIBS WMSの全球分類画像を同梱し、森林5分類を含む土地被覆の背景層として表示", caveat: "表示PNGは解析用画素値ではなく、公式カラーマップでレンダリングされた分類画像。森林以外の土地被覆も含む。", rows: [{ layer: "MODIS_Combined_L3_IGBP_Land_Cover_Type_Annual", date: "2023-01-01", localAsset: "assets/data/modis-land-cover-2023.png", displayed: true }] }),
      source({ id: "nasa-power-precip", organisation: "NASA POWER", title: "Precipitation climatology / global stratified sample", url: URLS.power, period: "Climatology", unit: "mm/day", resolution: `選択${powerRows.length}地点・年平均`, transformation: "全球に層化した地点を48秒で順に選択し、降水値を円の大きさと上昇粒子密度へ正規化", caveat: "GLOBAL SAMPLEであり全球グリッドではない。森林率との重なりから因果を主張しない。", rows: powerRows.map(({ name, iso3, lat, lon, precipitationMmDay }) => ({ name, iso3, lat, lon, precipitationMmDay })) }),
    ],
    { forestRaster: "./assets/data/modis-land-cover-2023.png", precipitation: powerRows },
  ),
  mode(
    "pollination-protocol",
    { number: 1, title: "循環を知る", en: "READ THE CYCLES" },
    "生命の関係を、数ではなく記録された出会いの網として見たら何が変わるか？",
    [
      source({ id: "globi", organisation: "Global Biotic Interactions", title: "Documented pollination interactions", url: URLS.globi, period: "literature aggregation", unit: "interaction records", resolution: "文献・標本単位", transformation: "pollinates関係を非地理的な文献関係件数として表示。GBIF地点へ線で結ばない", caveat: "関係記録は存在証明であり、頻度・因果強度・GBIF観察地点での直接記録ではない。", rows: globiRows }),
      source({ id: "gbif", organisation: "GBIF", title: "Apis mellifera occurrences / global stratified sample", url: URLS.gbif, period: "latest API snapshot", unit: "occurrence records", resolution: `最大2記録 × ${climateSites.length}選択国`, transformation: "各選択国から座標品質フラグのない最新2記録を抽出し、全球の偏りを抑えた展示用サンプルにする", caveat: "GLOBAL SAMPLE。国の選定と各国2件への縮約はDERIVEDで、分布密度や不在を意味しない。GloBI植物関係の位置として扱わない。", rows: gbifRows }),
    ],
    { interactions: globiRows, occurrences: gbifRows },
  ),
  mode(
    "nothing-is-waste",
    { number: 2, title: "人間の影響を見る", en: "SEE HUMAN IMPACT" },
    "自然界の受け渡しに比べ、人間の廃棄物の出口はどこで途切れているか？",
    [
      source({ id: "un-sdg", organisation: "United Nations Statistics Division", title: "SDG 12.5.1 / municipal waste recycled", url: `${URLS.unSdgMunicipalRecycling}?seriesCode=EN_MWT_RCYR`, period: `${Math.min(...globalWasteRows.map((row) => row.year))}–${Math.max(...globalWasteRows.map((row) => row.year))}`, unit: "% municipal waste recycled", resolution: `${globalWasteRows.length} country values / latest available year`, transformation: "選択31か国から最新の非欠測値を取り、国代表点へ配置。円の大きさを再資源化率へ対応", caveat: "COUNTRY VALUE。国ごとに報告年・制度・廃棄物定義が異なるため、厳密な順位表には使わない。", rows: globalWasteRows }),
      source({ id: "waste-route-scenario", kind: "SCENARIO", organisation: "Audience / local browser", title: "再資源化率の仮想経路", url: "about:local", period: "current session", unit: "%", resolution: "slider input / selected country", transformation: "観客のスライダーを選択国のSOURCE値へ加算し、破線だけを動かす", caveat: "公式統計でも将来予測でもない。SOURCE値を上書きせず、処理方式も推定しない。", rows: [{ base: "selected country SOURCE", audienceDeltaRange: "-20 to +20", transmitted: false }] }),
    ],
    { routes: wasteRows, countryWaste: globalWasteRows, scenario: { recycleDelta: 0, type: "SCENARIO" } },
  ),
  mode(
    "anthropocene-scar",
    { number: 2, title: "人間の影響を見る", en: "SEE HUMAN IMPACT" },
    "繁栄を示す光の下にある負荷を剥がしたとき、都市の別の輪郭は見えるか？",
    [
      source({ id: "edgar", organisation: "World Bank / European Commission JRC EDGAR", title: "Total GHG excluding LULUCF (AR5)", url: "https://data.worldbank.org/indicator/EN.GHG.ALL.MT.CE.AR5", period: `${Math.min(...globalEmissionsRows.map((row) => row.year))}–${Math.max(...globalEmissionsRows.map((row) => row.year))}`, unit: "Mt CO₂e", resolution: `${globalEmissionsRows.length} country values at representative coordinates`, transformation: "EDGAR由来の国別排出量を対数半径の赤い環へ変換", caveat: "COUNTRY VALUE。代表座標は排出源の位置ではなく、LULUCFを除く国全体の値。", rows: globalEmissionsRows }),
      source({ id: "nasa-gibs-night", organisation: "NASA GIBS", title: "VIIRS Night Lights / Black Marble", url: URLS.gibs, period: "2016 annual", unit: "rendered radiance", resolution: "1024×1024 Web Mercator snapshot", transformation: "公式GIBS WMSの全球画像を白い可視面として同梱表示。長押し時だけ透明化", caveat: "夜間光は排出量そのものではない。画像は観測放射輝度の表示用レンダリングで数値解析には使わない。", rows: [{ layer: "VIIRS_Night_Lights", date: "2016-01-01", localAsset: "assets/data/viirs-night-lights-2016.png", displayed: true }] }),
    ],
    { emissions: globalEmissionsRows, nightLightsRaster: "./assets/data/viirs-night-lights-2016.png", japanEmissions: emissionsRows, nightLights: urbanRows },
  ),
  mode(
    "rhythm-of-disaster",
    { number: 2, title: "人間の影響を見る", en: "SEE HUMAN IMPACT" },
    "地球の変動を止めるのでなく、到達時間と地域の記憶に文明をどう同期させるか？",
    [
      source({ id: "jma-shindo", organisation: "気象庁", title: "震度データベース検索", url: URLS.jmaQuake, period: "2011–2024 representative events", unit: "JMA seismic intensity", resolution: "観測点", transformation: "震度6弱以上を抽出。S波の近似到達後に実測震度を表示", caveat: "P=7 km/s、S=4 km/sの均質地殻近似。防災情報ではない。", rows: jmaHistory.events || [] }),
      source({ id: "usgs-earthquakes", organisation: "USGS", title: "FDSN Event Web Service / global M7.5+", url: URLS.usgs, period: "2000–snapshot date", unit: "magnitude, km", resolution: `${globalEarthquakeRows.length} events`, transformation: `M7.5以上の全${globalEarthquakeRows.length}震源を全球表示し、年代から均等抽出した${featuredEarthquakeRows.length}件だけを48秒で案内`, caveat: "Mと震度は別の尺度。USGSイベントに日本の震度を割り当てない。P=7 km/s、S=4 km/sはJMA詳細記録側の均質地殻モデル。", rows: globalEarthquakeRows }),
    ],
    { events: jmaHistory.events || [], globalEvents: globalEarthquakeRows, featuredEvents: featuredEarthquakeRows, pWaveKmS: 7, sWaveKmS: 4 },
  ),
  mode(
    "three-ecologies",
    { number: 3, title: "関係を編み直す", en: "REWEAVE RELATIONSHIPS" },
    "生態・社会・文化のどれか一つを最適化せず、大切な場所をどう残せるか？",
    [
      source({ id: "nasa-modis-ecological-layer", organisation: "NASA GIBS / MODIS", title: "MCD12Q1 IGBP Land Cover Type", url: "https://gibs.earthdata.nasa.gov/layer-metadata/v1.0/MODIS_Combined_L3_IGBP_Land_Cover_Type_Annual.json", period: "2023 annual", unit: "IGBP land-cover class", resolution: "500 m source / 1024×1024 display snapshot", transformation: "全球の土地被覆分類を生態レイヤーとして表示", caveat: "土地被覆は生物多様性や生態系の健全性そのものではなく、精神生態の代理指標にも使わない。", rows: [{ layer: "ECOLOGICAL", localAsset: "assets/data/modis-land-cover-2023.png", displayed: true }] }),
      source({ id: "worldbank-urban", organisation: "World Bank / UN Population Division", title: "Urban population (% of total)", url: "https://data.worldbank.org/indicator/SP.URB.TOTL.IN.ZS", period: "latest available by country", unit: "%", resolution: `${urbanRows.length} country values`, transformation: "社会レイヤーとして青い環へ変換", caveat: "COUNTRY VALUE。社会の豊かさや幸福度を表さない。", rows: urbanRows }),
      source({ id: "unesco-whc", organisation: "UNESCO World Heritage Centre", title: "World Heritage List / global curated sample", url: URLS.unesco, period: "current catalogue reference", unit: "site", resolution: `${heritageNodes.length} curated sites across world regions`, transformation: "地域の広がりが見えるよう各大地域から既登録物件を選び、文化・記憶レイヤーへ配置", caveat: "GLOBAL SAMPLEで全件ではない。件数を精神性の数値にせず、選定は展示上のキュレーション。", rows: heritageNodes }),
    ],
    { ecologicalRaster: "./assets/data/modis-land-cover-2023.png", social: urbanRows, culture: heritageNodes, memories: [] },
  ),
  mode(
    "earth-organ",
    { number: 3, title: "関係を編み直す", en: "REWEAVE RELATIONSHIPS" },
    "潜在量と現在の供給を分けて見たとき、二つの地域を結ぶ共生網はどう変わるか？",
    [
      source({ id: "nasa-power-renewable", organisation: "NASA POWER", title: "Solar and wind climatology / global stratified sample", url: URLS.power, period: "climatology", unit: "kWh/m²/day, m/s", resolution: `選択${powerRows.length}地点`, transformation: "自然エネルギー条件として円環の外側へ表示", caveat: "GLOBAL SAMPLE。設備制約・系統制約を含まない気候ポテンシャル。", rows: powerRows }),
      source({ id: "worldbank-renewable", organisation: "World Bank", title: "Renewable electricity output (% of total)", url: "https://data.worldbank.org/indicator/EG.ELC.RNEW.ZS", period: "latest available by country", unit: "%", resolution: `${renewableRows.length} country values`, transformation: "各NASA POWER地点と同じ国の現在供給比率を内側へ表示", caveat: "COUNTRY VALUE。潜在量とは定義が異なり、直接比較しない。", rows: renewableRows }),
      source({ id: "distributed-link-scenario", kind: "SCENARIO", organisation: "Audience / local browser", title: "二地域の分散型接続", url: "about:local", period: "current session", unit: "two selected points", resolution: "audience selection", transformation: "選択した二地域を破線で結ぶ", caveat: "実在の送電線、系統計画、事業可能性評価ではない。", rows: [{ selectedRegions: [], transmitted: false }] }),
    ],
    { potential: powerRows, current: renewableRows, scenarioLinks: [] },
  ),
  mode(
    "senseware-2050",
    { number: 3, title: "関係を編み直す", en: "REWEAVE RELATIONSHIPS" },
    "矛盾する九つの信号を一つの点数に潰さず、どんな未来の関係を編めるか？",
    [
      source({ id: "nine-signals", kind: "DERIVED", organisation: "GAIA SENSEWARE", title: "01–09 signal identity sequence", url: "./data/gaia-signals.json", period: "same snapshot / 48-second loop", unit: "mode identity; no numeric score", resolution: "one branch per sense organ", transformation: "01〜09を一本ずつ選択して枝を強調し、各モードで蓄積した接触記憶を別の明るさとして重ねる", caveat: "異なる単位の実数値を再集計・平均しない。地球健康度の架空スコアを作らない。", rows: [{ signal: "01 CO2/temp" }, { signal: "02 current/wind" }, { signal: "03 forest/rain" }, { signal: "04 interactions" }, { signal: "05 waste routes" }, { signal: "06 emissions/DID reference" }, { signal: "07 earthquakes" }, { signal: "08 three layers" }, { signal: "09 energy potential/current" }] }),
      source({ id: "audience-traces", kind: "SCENARIO", organisation: "Audience / local browser", title: "Touch traces and choices", url: "about:local", period: "current session", unit: "non-evaluative traces", resolution: "pointer samples", transformation: "軌跡を神経網の新しい枝へ変換", caveat: "外部送信・保存を行わない。正解点へ換算しない。", rows: [{ storage: "memory only", transmitted: false }] }),
    ],
    { reuse: ["breathing-earth", "blue-circulation", "forest-cloud-engine", "pollination-protocol", "nothing-is-waste", "anthropocene-scar", "rhythm-of-disaster", "three-ecologies", "earth-organ"] },
  ),
];

const output = enrichSnapshotWithStatistics({
  title: "GAIA SENSEWARE",
  subtitle: "地球の声を聴く、10の感覚器",
  generatedAt: retrievedAt,
  snapshotPolicy: "Runtime visualization uses this bundled JSON. External links are provenance, not live dependencies.",
  legend: {
    SOURCE: "公開データそのもの",
    DERIVED: "正規化・補間・集計した値",
    SCENARIO: "観客入力または明示した仮定による仮想状態",
  },
  modes,
});

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(`Wrote ${modes.length} modes to ${outputPath}`);
console.log(`GOSAT ${gosatFrames.length} frames, CO2 ${noaaRows.length}, GISTEMP ${gistempRows.length}, current ${currentRows.length}, POWER ${powerRows.length}, GloBI ${globiRows.length}, GBIF ${gbifRows.length}`);
console.log(`UN waste ${globalWasteRows.length}, WB renewable ${renewableRows.length}, urban ${urbanRows.length}, GHG ${globalEmissionsRows.length}, USGS M7.5+ ${globalEarthquakeRows.length}`);
