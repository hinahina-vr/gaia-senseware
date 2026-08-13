import { ApiError, isRecord, optionalString, requireExactKeys, requireString } from "./http";

export type PairRequest = { pairingCode: string };
export type DeviceDraft = {
  name: string;
  countryCode: string;
  admin1Code: string | null;
  localityName: string | null;
};
export type TelemetryInput = {
  seq: number;
  observedAt: string | null;
  data: Record<string, number>;
};

export const validatePairRequest = (value: unknown): PairRequest => {
  if (!isRecord(value)) throw new ApiError(400, "INVALID_BODY", "Request body must be an object.");
  requireExactKeys(value, ["pairingCode"]);
  const pairingCode = requireString(value.pairingCode, "pairingCode", 9, 9).toUpperCase();
  if (!/^[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}$/u.test(pairingCode)) {
    throw new ApiError(400, "INVALID_PAIRING_CODE", "Pairing code format is invalid.");
  }
  return { pairingCode };
};

export const validateDeviceDraft = (value: unknown): DeviceDraft => {
  if (!isRecord(value)) throw new ApiError(400, "INVALID_BODY", "Request body must be an object.");
  requireExactKeys(value, ["name", "countryCode", "admin1Code", "localityName"]);
  const name = requireString(value.name, "name", 1, 80);
  const countryCode = requireString(value.countryCode, "countryCode", 2, 2).toUpperCase();
  if (!/^[A-Z]{2}$/u.test(countryCode)) throw new ApiError(400, "INVALID_COUNTRY", "countryCode must be ISO 3166-1 alpha-2.");
  return {
    name,
    countryCode,
    admin1Code: optionalString(value.admin1Code, "admin1Code", 32),
    localityName: optionalString(value.localityName, "localityName", 80),
  };
};

export const validateTelemetry = (value: unknown): TelemetryInput => {
  if (!isRecord(value)) throw new ApiError(400, "INVALID_BODY", "Request body must be an object.");
  requireExactKeys(value, ["seq", "observedAt", "data"]);
  if (!Number.isSafeInteger(value.seq) || (value.seq as number) < 0) {
    throw new ApiError(400, "INVALID_SEQUENCE", "seq must be a non-negative safe integer.");
  }
  let observedAt: string | null = null;
  if (value.observedAt !== undefined && value.observedAt !== null) {
    observedAt = requireString(value.observedAt, "observedAt", 20, 35);
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/u.test(observedAt)) {
      throw new ApiError(400, "INVALID_TIMESTAMP", "observedAt must be an RFC 3339 UTC timestamp.");
    }
    const timestamp = Date.parse(observedAt);
    if (!Number.isFinite(timestamp)) {
      throw new ApiError(400, "INVALID_TIMESTAMP", "observedAt must be an RFC 3339 UTC timestamp.");
    }
    const skew = Math.abs(Date.now() - timestamp);
    if (skew > 31 * 24 * 60 * 60 * 1000) {
      throw new ApiError(400, "INVALID_TIMESTAMP", "observedAt must be within 31 days of receipt.");
    }
  }
  if (!isRecord(value.data)) throw new ApiError(400, "INVALID_SENSOR_DATA", "data must be an object.");
  const entries = Object.entries(value.data);
  if (entries.length < 1 || entries.length > 16) {
    throw new ApiError(400, "INVALID_SENSOR_DATA", "data must contain between 1 and 16 measurements.");
  }
  const data: Record<string, number> = {};
  for (const [key, measurement] of entries) {
    if (!/^[a-z][a-z0-9_]{0,31}$/u.test(key)) throw new ApiError(400, "INVALID_SENSOR_KEY", `Invalid sensor key: ${key}.`);
    if (typeof measurement !== "number" || !Number.isFinite(measurement)) {
      throw new ApiError(400, "INVALID_SENSOR_VALUE", `${key} must be a finite number.`);
    }
    const range = SENSOR_RANGES[key];
    if (range && (measurement < range[0] || measurement > range[1])) {
      throw new ApiError(400, "SENSOR_VALUE_OUT_OF_RANGE", `${key} is outside the accepted demo range.`);
    }
    if (!range && Math.abs(measurement) > 1_000_000) {
      throw new ApiError(400, "SENSOR_VALUE_OUT_OF_RANGE", `${key} is outside the accepted numeric range.`);
    }
    data[key] = measurement;
  }
  return { seq: value.seq as number, observedAt: observedAt === null ? null : new Date(observedAt).toISOString(), data };
};

const SENSOR_RANGES: Readonly<Record<string, readonly [number, number]>> = {
  temperature: [-80, 100],
  humidity: [0, 100],
  pm25: [0, 5000],
  pm10: [0, 5000],
  voc: [0, 100000],
  nox: [0, 100000],
};
