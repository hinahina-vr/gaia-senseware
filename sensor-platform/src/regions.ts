import { ApiError, json } from "./http";
import { JAPAN_MUNICIPALITY_RECORDS, REGION_DATA_VERSION, SUBDIVISION_RECORDS } from "./region-code-data";

export type RegionOption = { code: string; name: string };

const JAPAN_PREFECTURE_CENTRES = new Map<string, readonly [latitude: number, longitude: number]>([
  ["JP-01", [43.1, 141.4]], ["JP-02", [40.8, 140.7]], ["JP-03", [39.7, 141.2]], ["JP-04", [38.3, 140.9]],
  ["JP-05", [39.7, 140.1]], ["JP-06", [38.2, 140.4]], ["JP-07", [37.8, 140.5]], ["JP-08", [36.3, 140.4]],
  ["JP-09", [36.6, 139.9]], ["JP-10", [36.4, 139.1]], ["JP-11", [35.9, 139.6]], ["JP-12", [35.6, 140.1]],
  ["JP-13", [35.7, 139.7]], ["JP-14", [35.4, 139.6]], ["JP-15", [37.9, 139.0]], ["JP-16", [36.7, 137.2]],
  ["JP-17", [36.6, 136.6]], ["JP-18", [36.1, 136.2]], ["JP-19", [35.7, 138.6]], ["JP-20", [36.7, 138.2]],
  ["JP-21", [35.4, 136.7]], ["JP-22", [35.0, 138.4]], ["JP-23", [35.2, 136.9]], ["JP-24", [34.7, 136.5]],
  ["JP-25", [35.0, 135.9]], ["JP-26", [35.0, 135.8]], ["JP-27", [34.7, 135.5]], ["JP-28", [34.7, 135.2]],
  ["JP-29", [34.7, 135.8]], ["JP-30", [34.2, 135.2]], ["JP-31", [35.5, 134.2]], ["JP-32", [35.5, 133.1]],
  ["JP-33", [34.7, 133.9]], ["JP-34", [34.4, 132.5]], ["JP-35", [34.2, 131.5]], ["JP-36", [34.1, 134.6]],
  ["JP-37", [34.3, 134.0]], ["JP-38", [33.8, 132.8]], ["JP-39", [33.6, 133.5]], ["JP-40", [33.6, 130.4]],
  ["JP-41", [33.3, 130.3]], ["JP-42", [32.8, 129.9]], ["JP-43", [32.8, 130.7]], ["JP-44", [33.2, 131.6]],
  ["JP-45", [31.9, 131.4]], ["JP-46", [31.6, 130.6]], ["JP-47", [26.2, 127.7]],
]);

const subdivisionsByCountry = new Map<string, RegionOption[]>();
const subdivisionsByCode = new Map<string, RegionOption>();
for (const [code, countryCode, name] of SUBDIVISION_RECORDS) {
  const option = { code, name };
  subdivisionsByCode.set(code, option);
  const countryOptions = subdivisionsByCountry.get(countryCode) ?? [];
  countryOptions.push(option);
  subdivisionsByCountry.set(countryCode, countryOptions);
}

const municipalitiesBySubdivision = new Map<string, RegionOption[]>();
const municipalitiesByCode = new Map<string, RegionOption & { subdivisionCode: string }>();
for (const [code, subdivisionCode, name] of JAPAN_MUNICIPALITY_RECORDS) {
  const option = { code, name };
  municipalitiesByCode.set(code, { ...option, subdivisionCode });
  const subdivisionOptions = municipalitiesBySubdivision.get(subdivisionCode) ?? [];
  subdivisionOptions.push(option);
  municipalitiesBySubdivision.set(subdivisionCode, subdivisionOptions);
}

export const listRegions = (url: URL): Response => {
  const countryCode = (url.searchParams.get("countryCode") ?? "").normalize("NFKC").toUpperCase();
  const subdivisionCode = (url.searchParams.get("subdivisionCode") ?? "").normalize("NFKC").toUpperCase();
  if (!/^[A-Z]{2}$/u.test(countryCode)) {
    throw new ApiError(400, "INVALID_COUNTRY", "countryCode must be ISO 3166-1 alpha-2.");
  }
  if (subdivisionCode && !/^[A-Z]{2}-[A-Z0-9]{1,3}$/u.test(subdivisionCode)) {
    throw new ApiError(400, "INVALID_SUBDIVISION", "subdivisionCode must be a complete ISO 3166-2 code.");
  }
  if (subdivisionCode && !subdivisionCode.startsWith(`${countryCode}-`)) {
    throw new ApiError(400, "REGION_FIELD_CONFLICT", "subdivisionCode does not belong to countryCode.");
  }
  const subdivisions = subdivisionsByCountry.get(countryCode) ?? [];
  const municipalities = countryCode === "JP" && subdivisionCode
    ? municipalitiesBySubdivision.get(subdivisionCode) ?? []
    : [];
  return json({ version: REGION_DATA_VERSION, subdivisions, municipalities });
};

export const locateRegion = async (url: URL): Promise<Response> => {
  const countryCode = (url.searchParams.get("countryCode") ?? "").normalize("NFKC").toUpperCase();
  const subdivisionCode = (url.searchParams.get("subdivisionCode") ?? "").normalize("NFKC").toUpperCase();
  const municipalityCode = (url.searchParams.get("municipalityCode") ?? "").normalize("NFKC");
  if (countryCode !== "JP") throw new ApiError(400, "UNSUPPORTED_REGION_LOCATION", "Region plotting currently supports Japan.");
  const subdivision = subdivisionsByCode.get(subdivisionCode);
  const prefectureCentre = JAPAN_PREFECTURE_CENTRES.get(subdivisionCode);
  if (!subdivision || !subdivisionCode.startsWith("JP-") || !prefectureCentre) {
    throw new ApiError(400, "INVALID_SUBDIVISION", "A current Japanese subdivisionCode is required.");
  }
  if (!municipalityCode) {
    return json({
      location: { latitude: prefectureCentre[0], longitude: prefectureCentre[1], precision: "PREFECTURE_CENTRE" },
    });
  }
  const municipality = municipalitiesByCode.get(municipalityCode);
  if (!municipality || municipality.subdivisionCode !== subdivisionCode) {
    throw new ApiError(400, "INVALID_MUNICIPALITY", "municipalityCode must belong to subdivisionCode.");
  }
  const query = `${subdivision.name}${municipality.name}`;
  const upstream = new URL("https://msearch.gsi.go.jp/address-search/AddressSearch");
  upstream.searchParams.set("q", query);
  let response: Response;
  try {
    response = await fetch(upstream, { headers: { Accept: "application/json" } });
  } catch {
    throw new ApiError(502, "REGION_LOCATION_UNAVAILABLE", "The municipality location could not be resolved.");
  }
  if (!response.ok) throw new ApiError(502, "REGION_LOCATION_UNAVAILABLE", "The municipality location could not be resolved.");
  const declaredLength = Number(response.headers.get("Content-Length") ?? 0);
  if (declaredLength > 64 * 1024) throw new ApiError(502, "REGION_LOCATION_UNAVAILABLE", "The municipality location response was too large.");
  const payload: unknown = await response.json().catch(() => null);
  const coordinates = readCoordinates(payload);
  if (!coordinates) throw new ApiError(502, "REGION_LOCATION_UNAVAILABLE", "The municipality location was not found.");
  return json({
    location: {
      latitude: roundPublicCoordinate(coordinates.latitude),
      longitude: roundPublicCoordinate(coordinates.longitude),
      precision: "APPROXIMATE_0_1_DEGREE",
    },
  });
};

const readCoordinates = (payload: unknown): { latitude: number; longitude: number } | null => {
  if (!Array.isArray(payload)) return null;
  for (const feature of payload) {
    if (typeof feature !== "object" || feature === null) continue;
    const geometry = (feature as { geometry?: unknown }).geometry;
    if (typeof geometry !== "object" || geometry === null) continue;
    const coordinates = (geometry as { coordinates?: unknown }).coordinates;
    if (!Array.isArray(coordinates) || coordinates.length < 2) continue;
    const longitude = Number(coordinates[0]);
    const latitude = Number(coordinates[1]);
    if (Number.isFinite(latitude) && Number.isFinite(longitude) && latitude >= 20 && latitude <= 48 && longitude >= 122 && longitude <= 154) {
      return { latitude, longitude };
    }
  }
  return null;
};

const roundPublicCoordinate = (value: number): number => Math.round(value * 10) / 10;

export const getSubdivision = (code: string): RegionOption | null => subdivisionsByCode.get(code) ?? null;

export const getMunicipality = (code: string): (RegionOption & { subdivisionCode: string }) | null =>
  municipalitiesByCode.get(code) ?? null;

export const hasValidMunicipalityCheckDigit = (code: string): boolean => {
  if (!/^\d{6}$/u.test(code)) return false;
  const digits = [...code].map(Number);
  const weighted = digits.slice(0, 5).reduce((sum, digit, index) => sum + digit * (6 - index), 0);
  return digits[5] === (11 - (weighted % 11)) % 10;
};
