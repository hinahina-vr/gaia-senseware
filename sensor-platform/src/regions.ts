import { ApiError, json } from "./http";
import { JAPAN_MUNICIPALITY_RECORDS, REGION_DATA_VERSION, SUBDIVISION_RECORDS } from "./region-code-data";

export type RegionOption = { code: string; name: string };

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

export const getSubdivision = (code: string): RegionOption | null => subdivisionsByCode.get(code) ?? null;

export const getMunicipality = (code: string): (RegionOption & { subdivisionCode: string }) | null =>
  municipalitiesByCode.get(code) ?? null;

export const hasValidMunicipalityCheckDigit = (code: string): boolean => {
  if (!/^\d{6}$/u.test(code)) return false;
  const digits = [...code].map(Number);
  const weighted = digits.slice(0, 5).reduce((sum, digit, index) => sum + digit * (6 - index), 0);
  return digits[5] === (11 - (weighted % 11)) % 10;
};
