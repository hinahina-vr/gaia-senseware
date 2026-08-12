var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/crypto.ts
var encoder = new TextEncoder();
var decoder = new TextDecoder();
var sha256Hex = /* @__PURE__ */ __name(async (value) => {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return bytesToHex(new Uint8Array(digest));
}, "sha256Hex");
var hmacHex = /* @__PURE__ */ __name(async (secret, value) => {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return bytesToHex(new Uint8Array(signature));
}, "hmacHex");
var timingSafeHexEqual = /* @__PURE__ */ __name(async (left, right) => {
  const leftBytes = hexToBytes(left.padEnd(64, "0").slice(0, 64));
  const rightBytes = hexToBytes(right.padEnd(64, "0").slice(0, 64));
  const comparisonKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode("gaia-senseware-fixed-length-comparison-v1"),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  const signature = await crypto.subtle.sign("HMAC", comparisonKey, leftBytes);
  const equal = await crypto.subtle.verify("HMAC", comparisonKey, signature, rightBytes);
  return equal && left.length === 64 && right.length === 64;
}, "timingSafeHexEqual");
var randomToken = /* @__PURE__ */ __name((prefix = "") => {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return `${prefix}${base64UrlEncode(bytes)}`;
}, "randomToken");
var PAIRING_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
var randomPairingCode = /* @__PURE__ */ __name(() => {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  const characters = Array.from(bytes, (byte) => PAIRING_ALPHABET[byte % PAIRING_ALPHABET.length]);
  return `${characters.slice(0, 4).join("")}-${characters.slice(4).join("")}`;
}, "randomPairingCode");
var pkceChallenge = /* @__PURE__ */ __name(async (verifier) => {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(verifier));
  return base64UrlEncode(new Uint8Array(digest));
}, "pkceChallenge");
var encryptFlowValue = /* @__PURE__ */ __name(async (value, secret) => {
  const key = await deriveAesKey(secret);
  const iv = new Uint8Array(12);
  crypto.getRandomValues(iv);
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(value));
  return `${base64UrlEncode(iv)}.${base64UrlEncode(new Uint8Array(ciphertext))}`;
}, "encryptFlowValue");
var decryptFlowValue = /* @__PURE__ */ __name(async (packed, secret) => {
  const [ivPart, ciphertextPart] = packed.split(".");
  if (!ivPart || !ciphertextPart) return null;
  try {
    const key = await deriveAesKey(secret);
    const plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: base64UrlDecode(ivPart) },
      key,
      base64UrlDecode(ciphertextPart)
    );
    return decoder.decode(plaintext);
  } catch {
    return null;
  }
}, "decryptFlowValue");
var base64UrlEncode = /* @__PURE__ */ __name((bytes) => {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
}, "base64UrlEncode");
var base64UrlDecode = /* @__PURE__ */ __name((value) => {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}, "base64UrlDecode");
var deriveAesKey = /* @__PURE__ */ __name(async (secret) => {
  const keyMaterial = await crypto.subtle.digest("SHA-256", encoder.encode(`gaia-oidc-flow:${secret}`));
  return crypto.subtle.importKey("raw", keyMaterial, "AES-GCM", false, ["encrypt", "decrypt"]);
}, "deriveAesKey");
var bytesToHex = /* @__PURE__ */ __name((bytes) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(""), "bytesToHex");
var hexToBytes = /* @__PURE__ */ __name((hex) => {
  const pairs = hex.match(/.{2}/gu) ?? [];
  const bytes = new Uint8Array(pairs.length);
  pairs.forEach((pair, index) => {
    bytes[index] = Number.parseInt(pair, 16);
  });
  return bytes;
}, "hexToBytes");

// src/http.ts
var ApiError = class extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
  status;
  code;
  static {
    __name(this, "ApiError");
  }
};
var json = /* @__PURE__ */ __name((body, status = 200, headers = {}) => {
  const responseHeaders = new Headers(headers);
  responseHeaders.set("Content-Type", "application/json; charset=utf-8");
  responseHeaders.set("Cache-Control", "no-store");
  responseHeaders.set("X-Content-Type-Options", "nosniff");
  responseHeaders.set("Referrer-Policy", "no-referrer");
  return new Response(JSON.stringify(body), { status, headers: responseHeaders });
}, "json");
var errorResponse = /* @__PURE__ */ __name((error, headers = {}) => json({ error: { code: error.code, message: error.message } }, error.status, headers), "errorResponse");
var readJson = /* @__PURE__ */ __name(async (request, maximumBytes) => {
  const type = request.headers.get("Content-Type")?.split(";", 1)[0]?.trim().toLowerCase();
  if (type !== "application/json") throw new ApiError(415, "UNSUPPORTED_MEDIA_TYPE", "Content-Type must be application/json.");
  const declaredLength = request.headers.get("Content-Length");
  if (declaredLength !== null) {
    const length = Number(declaredLength);
    if (!Number.isFinite(length) || length < 0 || length > maximumBytes) {
      throw new ApiError(413, "PAYLOAD_TOO_LARGE", `Request body must not exceed ${maximumBytes} bytes.`);
    }
  }
  if (!request.body) throw new ApiError(400, "INVALID_JSON", "A JSON request body is required.");
  const reader = request.body.getReader();
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maximumBytes) {
        await reader.cancel();
        throw new ApiError(413, "PAYLOAD_TOO_LARGE", `Request body must not exceed ${maximumBytes} bytes.`);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return JSON.parse(new TextDecoder().decode(body));
  } catch {
    throw new ApiError(400, "INVALID_JSON", "Request body is not valid JSON.");
  }
}, "readJson");
var isRecord = /* @__PURE__ */ __name((value) => typeof value === "object" && value !== null && !Array.isArray(value), "isRecord");
var requireExactKeys = /* @__PURE__ */ __name((value, allowed) => {
  const unknown = Object.keys(value).find((key) => !allowed.includes(key));
  if (unknown) throw new ApiError(400, "UNKNOWN_FIELD", `Unknown field: ${unknown}.`);
}, "requireExactKeys");
var requireString = /* @__PURE__ */ __name((value, field, minimum, maximum) => {
  if (typeof value !== "string") throw new ApiError(400, "INVALID_FIELD", `${field} must be a string.`);
  const normalized = value.trim();
  if (normalized.length < minimum || normalized.length > maximum) {
    throw new ApiError(400, "INVALID_FIELD", `${field} must be between ${minimum} and ${maximum} characters.`);
  }
  return normalized;
}, "requireString");
var optionalString = /* @__PURE__ */ __name((value, field, maximum) => {
  if (value === void 0 || value === null || value === "") return null;
  return requireString(value, field, 1, maximum);
}, "optionalString");
var parseCookies = /* @__PURE__ */ __name((request) => {
  const result = /* @__PURE__ */ new Map();
  for (const part of (request.headers.get("Cookie") ?? "").split(";")) {
    const separator = part.indexOf("=");
    if (separator <= 0) continue;
    const key = part.slice(0, separator).trim();
    const raw = part.slice(separator + 1).trim();
    try {
      result.set(key, decodeURIComponent(raw));
    } catch {
    }
  }
  return result;
}, "parseCookies");
var sessionCookie = /* @__PURE__ */ __name((value, maximumAge) => [
  `__Host-gaia_sensor_session=${encodeURIComponent(value)}`,
  "Path=/",
  "HttpOnly",
  "Secure",
  "SameSite=Lax",
  `Max-Age=${maximumAge}`
].filter(Boolean).join("; "), "sessionCookie");
var csrfCookie = /* @__PURE__ */ __name((value, maximumAge) => [
  `__Host-gaia_sensor_csrf=${encodeURIComponent(value)}`,
  "Path=/",
  "Secure",
  "SameSite=Strict",
  `Max-Age=${maximumAge}`
].filter(Boolean).join("; "), "csrfCookie");
var flowCookie = /* @__PURE__ */ __name((value, maximumAge) => [
  `__Host-gaia_sensor_oidc=${encodeURIComponent(value)}`,
  "Path=/",
  "HttpOnly",
  "Secure",
  "SameSite=Lax",
  `Max-Age=${maximumAge}`
].join("; "), "flowCookie");
var clearCookie = /* @__PURE__ */ __name((name, httpOnly) => [
  `${name}=`,
  "Path=/",
  httpOnly ? "HttpOnly" : "",
  "Secure",
  "SameSite=Lax",
  "Max-Age=0"
].filter(Boolean).join("; "), "clearCookie");

// src/auth.ts
var SESSION_COOKIE = "__Host-gaia_sensor_session";
var CSRF_COOKIE = "__Host-gaia_sensor_csrf";
var OIDC_FLOW_COOKIE = "__Host-gaia_sensor_oidc";
var GOOGLE_AUTHORIZATION_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
var GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
var GOOGLE_JWKS_ENDPOINT = "https://www.googleapis.com/oauth2/v3/certs";
var FLOW_TTL_SECONDS = 600;
var startGoogleLogin = /* @__PURE__ */ __name(async (request, env) => {
  requireAuthConfiguration(env);
  const requestUrl = new URL(request.url);
  const returnPath = normalizeReturnPath(requestUrl.searchParams.get("returnTo"));
  const state = randomToken("st_");
  const nonce = randomToken("no_");
  const verifier = randomToken("pkce_");
  const browserBinding = randomToken("oidc_");
  const now = /* @__PURE__ */ new Date();
  const expiresAt = new Date(now.getTime() + FLOW_TTL_SECONDS * 1e3).toISOString();
  await env.DB.prepare(
    `INSERT INTO oauth_flows
      (id, state_hash, nonce_hash, browser_binding_hash, verifier_ciphertext, return_path, expires_at, created_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)`
  ).bind(
    crypto.randomUUID(),
    await sha256Hex(state),
    await sha256Hex(nonce),
    await sha256Hex(browserBinding),
    await encryptFlowValue(verifier, env.SESSION_SECRET),
    returnPath,
    expiresAt,
    now.toISOString()
  ).run();
  const authorize = new URL(GOOGLE_AUTHORIZATION_ENDPOINT);
  authorize.search = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri(env),
    response_type: "code",
    scope: "openid email profile",
    state,
    nonce,
    code_challenge: await pkceChallenge(verifier),
    code_challenge_method: "S256",
    access_type: "online",
    prompt: "select_account"
  }).toString();
  return new Response(null, {
    status: 302,
    headers: { Location: authorize.toString(), "Set-Cookie": flowCookie(browserBinding, FLOW_TTL_SECONDS) }
  });
}, "startGoogleLogin");
var finishGoogleLogin = /* @__PURE__ */ __name(async (request, env) => {
  requireAuthConfiguration(env);
  const url = new URL(request.url);
  const state = url.searchParams.get("state") ?? "";
  const code = url.searchParams.get("code") ?? "";
  if (!state || !code || state.length > 512 || code.length > 4096) {
    throw new ApiError(400, "INVALID_OIDC_CALLBACK", "Google login callback is incomplete.");
  }
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const stateHash = await sha256Hex(state);
  const candidate = await env.DB.prepare(
    `SELECT id, nonce_hash, browser_binding_hash, verifier_ciphertext, return_path
     FROM oauth_flows WHERE state_hash = ?1 AND consumed_at IS NULL AND expires_at > ?2`
  ).bind(stateHash, now).first();
  const browserBinding = parseCookies(request).get(OIDC_FLOW_COOKIE) ?? "";
  const browserBindingHash = await sha256Hex(browserBinding);
  if (!candidate || !browserBinding || !await timingSafeHexEqual(browserBindingHash, candidate.browser_binding_hash)) {
    throw new ApiError(400, "INVALID_OIDC_STATE", "Google login state is invalid, expired, or belongs to another browser.");
  }
  const flow = await env.DB.prepare(
    `UPDATE oauth_flows SET consumed_at = ?1
     WHERE id = ?2 AND state_hash = ?3 AND browser_binding_hash = ?4
       AND consumed_at IS NULL AND expires_at > ?1
     RETURNING id, nonce_hash, browser_binding_hash, verifier_ciphertext, return_path`
  ).bind(now, candidate.id, stateHash, browserBindingHash).first();
  if (!flow) throw new ApiError(400, "INVALID_OIDC_STATE", "Google login state has already been used.");
  const verifier = await decryptFlowValue(flow.verifier_ciphertext, env.SESSION_SECRET);
  if (!verifier) throw new ApiError(400, "INVALID_OIDC_FLOW", "Google login flow could not be verified.");
  const tokenResponse = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri(env),
      grant_type: "authorization_code",
      code_verifier: verifier
    })
  });
  if (!tokenResponse.ok) throw new ApiError(401, "OIDC_TOKEN_EXCHANGE_FAILED", "Google login could not be completed.");
  const tokenBody = await tokenResponse.json();
  const idToken = isGoogleTokenResponse(tokenBody) ? tokenBody.id_token : void 0;
  if (typeof idToken !== "string" || idToken.length > 16384) {
    throw new ApiError(401, "INVALID_ID_TOKEN", "Google did not return a valid ID token.");
  }
  const identity = await verifyGoogleIdToken(idToken, env.GOOGLE_CLIENT_ID, flow.nonce_hash);
  const userId = await upsertGoogleUser(env.DB, identity, now);
  const session = await createSession(env, userId, now);
  const headers = new Headers({ Location: new URL(flow.return_path, env.PUBLIC_ORIGIN).toString() });
  headers.append("Set-Cookie", sessionCookie(session.token, session.ttl));
  headers.append("Set-Cookie", csrfCookie(session.csrfToken, session.ttl));
  headers.append("Set-Cookie", clearCookie(OIDC_FLOW_COOKIE, true));
  return new Response(null, { status: 302, headers });
}, "finishGoogleLogin");
var getAuthenticatedUser = /* @__PURE__ */ __name(async (request, env) => {
  const token = parseCookies(request).get(SESSION_COOKIE);
  if (!token || token.length > 256) throw new ApiError(401, "AUTHENTICATION_REQUIRED", "Google login is required.");
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const row = await env.DB.prepare(
    `SELECT s.id AS session_id, s.user_id, u.display_name, s.csrf_hash, s.expires_at
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = ?1 AND s.revoked_at IS NULL AND s.expires_at > ?2`
  ).bind(await sha256Hex(token), now).first();
  if (!row) throw new ApiError(401, "SESSION_EXPIRED", "Your session has expired. Please log in again.");
  return {
    id: row.user_id,
    displayName: row.display_name,
    sessionId: row.session_id,
    csrfHash: row.csrf_hash,
    expiresAt: row.expires_at
  };
}, "getAuthenticatedUser");
var requireCsrf = /* @__PURE__ */ __name(async (request, user) => {
  const cookieToken = parseCookies(request).get(CSRF_COOKIE) ?? "";
  const headerToken = request.headers.get("X-CSRF-Token") ?? "";
  if (!cookieToken || !headerToken || cookieToken.length > 256 || headerToken.length > 256) {
    throw new ApiError(403, "CSRF_VALIDATION_FAILED", "CSRF validation failed.");
  }
  const [cookieHash, headerHash] = await Promise.all([sha256Hex(cookieToken), sha256Hex(headerToken)]);
  if (!await timingSafeHexEqual(cookieHash, headerHash) || !await timingSafeHexEqual(cookieHash, user.csrfHash)) {
    throw new ApiError(403, "CSRF_VALIDATION_FAILED", "CSRF validation failed.");
  }
}, "requireCsrf");
var sessionResponse = /* @__PURE__ */ __name(async (request, env) => {
  const user = await getAuthenticatedUser(request, env);
  const rotatedToken = randomToken("gs_");
  const now = /* @__PURE__ */ new Date();
  const rotated = await env.DB.prepare(
    `UPDATE sessions SET token_hash = ?1, last_seen_at = ?2
     WHERE id = ?3 AND user_id = ?4 AND revoked_at IS NULL AND expires_at > ?2`
  ).bind(await sha256Hex(rotatedToken), now.toISOString(), user.sessionId, user.id).run();
  if (rotated.meta.changes !== 1) throw new ApiError(401, "AUTHENTICATION_REQUIRED", "Session is no longer active.");
  const remainingSeconds = Math.max(1, Math.floor((Date.parse(user.expiresAt) - now.getTime()) / 1e3));
  const headers = new Headers({ "Set-Cookie": sessionCookie(rotatedToken, remainingSeconds) });
  return json({ user: { id: user.id, displayName: user.displayName }, expiresAt: user.expiresAt }, 200, headers);
}, "sessionResponse");
var logout = /* @__PURE__ */ __name(async (request, env) => {
  const user = await getAuthenticatedUser(request, env);
  await requireCsrf(request, user);
  await env.DB.prepare("UPDATE sessions SET revoked_at = ?1 WHERE id = ?2 AND user_id = ?3").bind((/* @__PURE__ */ new Date()).toISOString(), user.sessionId, user.id).run();
  const headers = new Headers();
  headers.append("Set-Cookie", clearCookie(SESSION_COOKIE, true));
  headers.append("Set-Cookie", clearCookie(CSRF_COOKIE, false));
  return json({ ok: true }, 200, headers);
}, "logout");
var createSession = /* @__PURE__ */ __name(async (env, userId, now) => {
  const ttl = boundedInteger(env.SESSION_TTL_SECONDS, 900, 86400, 28800);
  const token = randomToken("gs_");
  const csrfToken = randomToken("csrf_");
  await env.DB.prepare(
    `INSERT INTO sessions (id, token_hash, user_id, csrf_hash, expires_at, created_at, last_seen_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?6)`
  ).bind(
    crypto.randomUUID(),
    await sha256Hex(token),
    userId,
    await sha256Hex(csrfToken),
    new Date(Date.parse(now) + ttl * 1e3).toISOString(),
    now
  ).run();
  return { token, csrfToken, ttl };
}, "createSession");
var upsertGoogleUser = /* @__PURE__ */ __name(async (db, identity, now) => {
  const existing = await db.prepare(
    "SELECT user_id FROM user_identities WHERE provider = 'google' AND provider_subject = ?1"
  ).bind(identity.sub).first();
  if (existing) {
    await db.batch([
      db.prepare("UPDATE users SET display_name = ?1, updated_at = ?2 WHERE id = ?3").bind(identity.name, now, existing.user_id),
      db.prepare(
        "UPDATE user_identities SET email = ?1, email_verified = ?2, updated_at = ?3 WHERE provider = 'google' AND provider_subject = ?4"
      ).bind(identity.email, identity.emailVerified ? 1 : 0, now, identity.sub)
    ]);
    return existing.user_id;
  }
  const userId = crypto.randomUUID();
  try {
    await db.batch([
      db.prepare("INSERT INTO users (id, display_name, created_at, updated_at) VALUES (?1, ?2, ?3, ?3)").bind(userId, identity.name, now),
      db.prepare(
        `INSERT INTO user_identities
          (id, user_id, provider, provider_subject, email, email_verified, created_at, updated_at)
         VALUES (?1, ?2, 'google', ?3, ?4, ?5, ?6, ?6)`
      ).bind(crypto.randomUUID(), userId, identity.sub, identity.email, identity.emailVerified ? 1 : 0, now)
    ]);
    return userId;
  } catch {
    const winner = await db.prepare(
      "SELECT user_id FROM user_identities WHERE provider = 'google' AND provider_subject = ?1"
    ).bind(identity.sub).first();
    if (winner) return winner.user_id;
    throw new ApiError(500, "IDENTITY_SAVE_FAILED", "Google identity could not be saved.");
  }
}, "upsertGoogleUser");
var verifyGoogleIdToken = /* @__PURE__ */ __name(async (token, audience, nonceHash) => {
  const parts = token.split(".");
  if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) throw new ApiError(401, "INVALID_ID_TOKEN", "ID token is malformed.");
  const header = decodeJwtPart(parts[0]);
  const claims = decodeJwtPart(parts[1]);
  if (!isObject(header) || header.alg !== "RS256" || typeof header.kid !== "string") {
    throw new ApiError(401, "INVALID_ID_TOKEN", "ID token header is invalid.");
  }
  const keysResponse = await fetch(GOOGLE_JWKS_ENDPOINT, { headers: { Accept: "application/json" } });
  if (!keysResponse.ok) throw new ApiError(503, "OIDC_KEYS_UNAVAILABLE", "Google signing keys are unavailable.");
  const keysBody = await keysResponse.json();
  const keys = isObject(keysBody) && Array.isArray(keysBody.keys) ? keysBody.keys : [];
  const jwk = keys.find(
    (candidate) => isObject(candidate) && candidate.kid === header.kid && candidate.alg === "RS256" && candidate.use === "sig"
  );
  if (!jwk) throw new ApiError(401, "INVALID_ID_TOKEN", "ID token signing key was not found.");
  const publicKey = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const signed = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
  const verified = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", publicKey, base64UrlDecode(parts[2]), signed);
  if (!verified || !isObject(claims)) throw new ApiError(401, "INVALID_ID_TOKEN", "ID token signature is invalid.");
  const nowSeconds = Math.floor(Date.now() / 1e3);
  if (claims.iss !== "https://accounts.google.com" && claims.iss !== "accounts.google.com") throw new ApiError(401, "INVALID_ID_TOKEN_ISSUER", "ID token issuer is invalid.");
  if (claims.aud !== audience) throw new ApiError(401, "INVALID_ID_TOKEN_AUDIENCE", "ID token audience is invalid.");
  if (typeof claims.exp !== "number" || claims.exp <= nowSeconds) throw new ApiError(401, "EXPIRED_ID_TOKEN", "ID token has expired.");
  if (typeof claims.iat !== "number" || claims.iat > nowSeconds + 120) throw new ApiError(401, "INVALID_ID_TOKEN_TIME", "ID token issue time is invalid.");
  if (typeof claims.nonce !== "string" || !await timingSafeHexEqual(await sha256Hex(claims.nonce), nonceHash)) {
    throw new ApiError(401, "INVALID_ID_TOKEN_NONCE", "ID token nonce is invalid.");
  }
  if (typeof claims.sub !== "string" || claims.sub.length < 1 || claims.sub.length > 255) throw new ApiError(401, "INVALID_ID_TOKEN_SUBJECT", "ID token subject is invalid.");
  const name = typeof claims.name === "string" && claims.name.trim() ? claims.name.trim().slice(0, 120) : "GAIA participant";
  const email = typeof claims.email === "string" ? claims.email.slice(0, 320) : null;
  return { sub: claims.sub, name, email, emailVerified: claims.email_verified === true };
}, "verifyGoogleIdToken");
var decodeJwtPart = /* @__PURE__ */ __name((part) => {
  try {
    return JSON.parse(new TextDecoder().decode(base64UrlDecode(part)));
  } catch {
    return null;
  }
}, "decodeJwtPart");
var isObject = /* @__PURE__ */ __name((value) => typeof value === "object" && value !== null && !Array.isArray(value), "isObject");
var isGoogleTokenResponse = /* @__PURE__ */ __name((value) => isObject(value), "isGoogleTokenResponse");
var normalizeReturnPath = /* @__PURE__ */ __name((value) => value === "/sensors/" ? value : "/sensors/", "normalizeReturnPath");
var redirectUri = /* @__PURE__ */ __name((env) => new URL("/api/auth/google/callback", env.PUBLIC_ORIGIN).toString(), "redirectUri");
var boundedInteger = /* @__PURE__ */ __name((value, minimum, maximum, fallback) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= minimum && parsed <= maximum ? parsed : fallback;
}, "boundedInteger");
var requireAuthConfiguration = /* @__PURE__ */ __name((env) => {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.SESSION_SECRET) {
    throw new ApiError(503, "OIDC_NOT_CONFIGURED", "Google OIDC credentials are not configured.");
  }
}, "requireAuthConfiguration");

// src/validation.ts
var validatePairRequest = /* @__PURE__ */ __name((value) => {
  if (!isRecord(value)) throw new ApiError(400, "INVALID_BODY", "Request body must be an object.");
  requireExactKeys(value, ["pairingCode"]);
  const pairingCode = requireString(value.pairingCode, "pairingCode", 9, 9).toUpperCase();
  if (!/^[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}$/u.test(pairingCode)) {
    throw new ApiError(400, "INVALID_PAIRING_CODE", "Pairing code format is invalid.");
  }
  return { pairingCode };
}, "validatePairRequest");
var validateDeviceDraft = /* @__PURE__ */ __name((value) => {
  if (!isRecord(value)) throw new ApiError(400, "INVALID_BODY", "Request body must be an object.");
  requireExactKeys(value, ["name", "countryCode", "admin1Code", "localityName"]);
  const name = requireString(value.name, "name", 1, 80);
  const countryCode = requireString(value.countryCode, "countryCode", 2, 2).toUpperCase();
  if (!/^[A-Z]{2}$/u.test(countryCode)) throw new ApiError(400, "INVALID_COUNTRY", "countryCode must be ISO 3166-1 alpha-2.");
  return {
    name,
    countryCode,
    admin1Code: optionalString(value.admin1Code, "admin1Code", 32),
    localityName: optionalString(value.localityName, "localityName", 80)
  };
}, "validateDeviceDraft");
var validateTelemetry = /* @__PURE__ */ __name((value) => {
  if (!isRecord(value)) throw new ApiError(400, "INVALID_BODY", "Request body must be an object.");
  requireExactKeys(value, ["seq", "observedAt", "data"]);
  if (!Number.isSafeInteger(value.seq) || value.seq < 0) {
    throw new ApiError(400, "INVALID_SEQUENCE", "seq must be a non-negative safe integer.");
  }
  let observedAt = null;
  if (value.observedAt !== void 0 && value.observedAt !== null) {
    observedAt = requireString(value.observedAt, "observedAt", 20, 35);
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/u.test(observedAt)) {
      throw new ApiError(400, "INVALID_TIMESTAMP", "observedAt must be an RFC 3339 UTC timestamp.");
    }
    const timestamp = Date.parse(observedAt);
    if (!Number.isFinite(timestamp)) {
      throw new ApiError(400, "INVALID_TIMESTAMP", "observedAt must be an RFC 3339 UTC timestamp.");
    }
    const skew = Math.abs(Date.now() - timestamp);
    if (skew > 31 * 24 * 60 * 60 * 1e3) {
      throw new ApiError(400, "INVALID_TIMESTAMP", "observedAt must be within 31 days of receipt.");
    }
  }
  if (!isRecord(value.data)) throw new ApiError(400, "INVALID_SENSOR_DATA", "data must be an object.");
  const entries = Object.entries(value.data);
  if (entries.length < 1 || entries.length > 16) {
    throw new ApiError(400, "INVALID_SENSOR_DATA", "data must contain between 1 and 16 measurements.");
  }
  const data = {};
  for (const [key, measurement] of entries) {
    if (!/^[a-z][a-z0-9_]{0,31}$/u.test(key)) throw new ApiError(400, "INVALID_SENSOR_KEY", `Invalid sensor key: ${key}.`);
    if (typeof measurement !== "number" || !Number.isFinite(measurement)) {
      throw new ApiError(400, "INVALID_SENSOR_VALUE", `${key} must be a finite number.`);
    }
    const range = SENSOR_RANGES[key];
    if (range && (measurement < range[0] || measurement > range[1])) {
      throw new ApiError(400, "SENSOR_VALUE_OUT_OF_RANGE", `${key} is outside the accepted demo range.`);
    }
    if (!range && Math.abs(measurement) > 1e6) {
      throw new ApiError(400, "SENSOR_VALUE_OUT_OF_RANGE", `${key} is outside the accepted numeric range.`);
    }
    data[key] = measurement;
  }
  return { seq: value.seq, observedAt: observedAt === null ? null : new Date(observedAt).toISOString(), data };
}, "validateTelemetry");
var SENSOR_RANGES = {
  temperature: [-80, 100],
  humidity: [0, 100],
  pm25: [0, 5e3],
  pm10: [0, 5e3],
  voc: [0, 1e5],
  nox: [0, 1e5]
};

// src/devices.ts
var listCountries = /* @__PURE__ */ __name(async (env) => {
  const result = await env.DB.prepare(
    "SELECT code, name_en AS nameEn, name_local AS nameLocal FROM countries WHERE enabled = 1 ORDER BY COALESCE(name_local, name_en)"
  ).all();
  return json({ countries: result.results });
}, "listCountries");
var createPairing = /* @__PURE__ */ __name(async (request, env, user) => {
  await requireCsrf(request, user);
  const draft = validateDeviceDraft(await readJson(request, 4096));
  const country = await env.DB.prepare("SELECT code FROM countries WHERE code = ?1 AND enabled = 1").bind(draft.countryCode).first();
  if (!country) throw new ApiError(400, "INVALID_COUNTRY", "Selected country is not enabled.");
  const code = randomPairingCode();
  const now = /* @__PURE__ */ new Date();
  const expiresAt = new Date(now.getTime() + 10 * 60 * 1e3).toISOString();
  await env.DB.prepare(
    `INSERT INTO device_pairing_codes
      (id, code_hash, user_id, device_name, country_code, admin1_code, locality_name, expires_at, created_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)`
  ).bind(
    crypto.randomUUID(),
    await hmacHex(env.PAIRING_CODE_PEPPER, code),
    user.id,
    draft.name,
    draft.countryCode,
    draft.admin1Code,
    draft.localityName,
    expiresAt,
    now.toISOString()
  ).run();
  return json({ pairingCode: code, expiresAt }, 201);
}, "createPairing");
var pairDevice = /* @__PURE__ */ __name(async (request, env) => {
  const { pairingCode } = validatePairRequest(await readJson(request, 2048));
  const codeHash = await hmacHex(env.PAIRING_CODE_PEPPER, pairingCode);
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const deviceId = `dev_${randomIdentifier(12)}`;
  const databaseId = crypto.randomUUID();
  const rawToken = randomToken("gdt_");
  const tokenHash = await hmacHex(env.DEVICE_TOKEN_PEPPER, rawToken);
  const results = await env.DB.batch([
    env.DB.prepare(
      `UPDATE device_pairing_codes
       SET used_at = ?1, consumed_by_device_id = ?3
       WHERE code_hash = ?2 AND used_at IS NULL AND expires_at > ?1
       RETURNING id, user_id, device_name, country_code, admin1_code, locality_name`
    ).bind(now, codeHash, databaseId),
    env.DB.prepare(
      `INSERT INTO devices
        (id, device_id, owner_user_id, name, token_hash, country_code, admin1_code, locality_name,
         location_precision, created_at, updated_at)
       SELECT ?1, ?2, user_id, device_name, ?3, country_code, admin1_code, locality_name,
         CASE WHEN locality_name IS NOT NULL THEN 'LOCALITY'
              WHEN admin1_code IS NOT NULL THEN 'ADMIN1' ELSE 'COUNTRY' END,
         ?4, ?4
       FROM device_pairing_codes
       WHERE code_hash = ?5 AND used_at = ?4 AND consumed_by_device_id = ?1`
    ).bind(databaseId, deviceId, tokenHash, now, codeHash)
  ]);
  const consumedRows = results[0]?.results;
  const inserted = results[1]?.meta.changes ?? 0;
  if (!consumedRows?.[0] || inserted !== 1) {
    throw new ApiError(409, "PAIRING_CODE_UNAVAILABLE", "Pairing code is invalid, expired, or already used.");
  }
  return json({ deviceId, deviceToken: rawToken, tokenType: "Bearer" }, 201);
}, "pairDevice");
var acceptTelemetry = /* @__PURE__ */ __name(async (request, env, deviceId) => {
  const authorization = request.headers.get("Authorization") ?? "";
  const tokenMatch = /^Bearer ([A-Za-z0-9_-]{40,128})$/u.exec(authorization);
  if (!tokenMatch?.[1]) throw new ApiError(401, "INVALID_DEVICE_TOKEN", "Device authentication failed.");
  const device = await env.DB.prepare(
    "SELECT token_hash, status FROM devices WHERE device_id = ?1 AND deleted_at IS NULL"
  ).bind(deviceId).first();
  const providedHash = await hmacHex(env.DEVICE_TOKEN_PEPPER, tokenMatch[1]);
  if (!device || device.status !== "ACTIVE" || !await timingSafeHexEqual(providedHash, device.token_hash)) {
    throw new ApiError(401, "INVALID_DEVICE_TOKEN", "Device authentication failed.");
  }
  const telemetry = validateTelemetry(await readJson(request, 12 * 1024));
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const canonicalData = Object.fromEntries(Object.entries(telemetry.data).sort(([left], [right]) => left.localeCompare(right)));
  const payload = JSON.stringify(canonicalData);
  const payloadHash = await sha256Hex(JSON.stringify({ observedAt: telemetry.observedAt, data: canonicalData }));
  const results = await env.DB.batch([
    env.DB.prepare(
      `UPDATE devices
       SET last_seq = ?1, last_payload_hash = ?2, last_seen_at = ?3, updated_at = ?3
       WHERE device_id = ?4 AND status = 'ACTIVE' AND deleted_at IS NULL
         AND (last_seq IS NULL OR ?1 > last_seq)
       RETURNING device_id`
    ).bind(telemetry.seq, payloadHash, now, deviceId),
    env.DB.prepare(
      `INSERT INTO telemetry
        (id, device_id, seq, observed_at, received_at, payload_hash, payload_json, created_at)
       SELECT ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?5
       FROM devices
       WHERE device_id = ?2 AND last_seq = ?3 AND last_payload_hash = ?6
         AND status = 'ACTIVE' AND deleted_at IS NULL
         AND NOT EXISTS (SELECT 1 FROM telemetry WHERE device_id = ?2 AND seq = ?3)`
    ).bind(crypto.randomUUID(), deviceId, telemetry.seq, telemetry.observedAt, now, payloadHash, payload)
  ]);
  const claimed = (results[0]?.meta.changes ?? 0) === 1;
  const created = (results[1]?.meta.changes ?? 0) === 1;
  if (claimed && created) return json({ accepted: true, duplicate: false, receivedAt: now }, 202);
  if (claimed !== created) throw new ApiError(409, "SEQUENCE_RACE", "Telemetry sequence could not be committed.");
  const existing = await env.DB.prepare(
    "SELECT payload_hash AS payloadHash FROM telemetry WHERE device_id = ?1 AND seq = ?2"
  ).bind(deviceId, telemetry.seq).first();
  if (!existing) throw new ApiError(409, "STALE_SEQUENCE", "seq is lower than the device's latest accepted sequence.");
  if (!await timingSafeHexEqual(payloadHash, existing.payloadHash)) {
    throw new ApiError(409, "SEQUENCE_CONFLICT", "This seq was already used with different telemetry content.");
  }
  await env.DB.prepare(
    `UPDATE devices SET last_seen_at = ?1, updated_at = ?1
     WHERE device_id = ?2 AND last_seq = ?3 AND last_payload_hash = ?4
       AND status = 'ACTIVE' AND deleted_at IS NULL`
  ).bind(now, deviceId, telemetry.seq, payloadHash).run();
  return json({ accepted: true, duplicate: true, receivedAt: now }, 200);
}, "acceptTelemetry");
var listDevices = /* @__PURE__ */ __name(async (env, user) => {
  const threshold = onlineThreshold(env);
  const result = await env.DB.prepare(
    `SELECT d.device_id AS deviceId, d.name, d.country_code AS countryCode,
       COALESCE(c.name_local, c.name_en) AS countryName, d.admin1_code AS admin1Code,
       d.locality_name AS localityName,
       CASE WHEN datetime(d.last_seen_at) >= datetime('now', ?1) THEN 'ONLINE' ELSE 'OFFLINE' END AS state,
       d.last_seen_at AS lastSeenAt, d.created_at AS createdAt
     FROM devices d JOIN countries c ON c.code = d.country_code
     WHERE d.owner_user_id = ?2 AND d.status = 'ACTIVE' AND d.deleted_at IS NULL
     ORDER BY d.created_at DESC`
  ).bind(`-${threshold} seconds`, user.id).all();
  return json({ devices: result.results });
}, "listDevices");
var getDevice = /* @__PURE__ */ __name(async (env, user, deviceId) => {
  const device = await ownedDevice(env, user.id, deviceId);
  return json({ device });
}, "getDevice");
var getLatest = /* @__PURE__ */ __name(async (env, user, deviceId) => {
  const device = await ownedDevice(env, user.id, deviceId);
  const latest = await env.DB.prepare(
    `SELECT seq, observed_at AS observedAt, received_at AS receivedAt, payload_json AS payloadJson
     FROM telemetry WHERE device_id = ?1 ORDER BY received_at DESC, seq DESC LIMIT 1`
  ).bind(deviceId).first();
  return json({ device, latest: latest ? serializeTelemetry(latest) : null });
}, "getLatest");
var getHistory = /* @__PURE__ */ __name(async (env, user, deviceId, url) => {
  await ownedDevice(env, user.id, deviceId);
  const limit = parseLimit(url.searchParams.get("limit"));
  const from = parseDateQuery(url.searchParams.get("from"), "from");
  const to = parseDateQuery(url.searchParams.get("to"), "to");
  if (from && to && from > to) throw new ApiError(400, "INVALID_TIME_RANGE", "from must not be after to.");
  const result = await env.DB.prepare(
    `SELECT t.seq, t.observed_at AS observedAt, t.received_at AS receivedAt, t.payload_json AS payloadJson
     FROM telemetry t
     JOIN devices d ON d.device_id = t.device_id
     WHERE t.device_id = ?1 AND d.owner_user_id = ?2 AND d.status = 'ACTIVE' AND d.deleted_at IS NULL
       AND (?3 IS NULL OR t.received_at >= ?3)
       AND (?4 IS NULL OR t.received_at <= ?4)
     ORDER BY t.received_at DESC, t.seq DESC LIMIT ?5`
  ).bind(deviceId, user.id, from, to, limit).all();
  return json({ deviceId, telemetry: result.results.map(serializeTelemetry) });
}, "getHistory");
var updateDevice = /* @__PURE__ */ __name(async (request, env, user, deviceId) => {
  await requireCsrf(request, user);
  const draft = validateDeviceDraft(await readJson(request, 4096));
  const country = await env.DB.prepare("SELECT code FROM countries WHERE code = ?1 AND enabled = 1").bind(draft.countryCode).first();
  if (!country) throw new ApiError(400, "INVALID_COUNTRY", "Selected country is not enabled.");
  const result = await env.DB.prepare(
    `UPDATE devices SET name = ?1, country_code = ?2, admin1_code = ?3, locality_name = ?4,
       location_precision = CASE WHEN ?4 IS NOT NULL THEN 'LOCALITY' WHEN ?3 IS NOT NULL THEN 'ADMIN1' ELSE 'COUNTRY' END,
       updated_at = ?5
     WHERE device_id = ?6 AND owner_user_id = ?7 AND status = 'ACTIVE' AND deleted_at IS NULL`
  ).bind(draft.name, draft.countryCode, draft.admin1Code, draft.localityName, (/* @__PURE__ */ new Date()).toISOString(), deviceId, user.id).run();
  if (result.meta.changes !== 1) throw new ApiError(404, "DEVICE_NOT_FOUND", "Device was not found.");
  return getDevice(env, user, deviceId);
}, "updateDevice");
var revokeDevice = /* @__PURE__ */ __name(async (request, env, user, deviceId) => {
  await requireCsrf(request, user);
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const result = await env.DB.prepare(
    `UPDATE devices SET status = 'REVOKED', deleted_at = ?1, updated_at = ?1
     WHERE device_id = ?2 AND owner_user_id = ?3 AND status = 'ACTIVE' AND deleted_at IS NULL`
  ).bind(now, deviceId, user.id).run();
  if (result.meta.changes !== 1) throw new ApiError(404, "DEVICE_NOT_FOUND", "Device was not found.");
  return new Response(null, { status: 204 });
}, "revokeDevice");
var ownedDevice = /* @__PURE__ */ __name(async (env, userId, deviceId) => {
  const threshold = onlineThreshold(env);
  const device = await env.DB.prepare(
    `SELECT d.device_id AS deviceId, d.name, d.country_code AS countryCode,
       COALESCE(c.name_local, c.name_en) AS countryName, d.admin1_code AS admin1Code,
       d.locality_name AS localityName,
       CASE WHEN datetime(d.last_seen_at) >= datetime('now', ?1) THEN 'ONLINE' ELSE 'OFFLINE' END AS state,
       d.last_seen_at AS lastSeenAt, d.created_at AS createdAt
     FROM devices d JOIN countries c ON c.code = d.country_code
     WHERE d.device_id = ?2 AND d.owner_user_id = ?3 AND d.status = 'ACTIVE' AND d.deleted_at IS NULL`
  ).bind(`-${threshold} seconds`, deviceId, userId).first();
  if (!device) throw new ApiError(404, "DEVICE_NOT_FOUND", "Device was not found.");
  return device;
}, "ownedDevice");
var serializeTelemetry = /* @__PURE__ */ __name((row) => ({
  seq: row.seq,
  observedAt: row.observedAt,
  receivedAt: row.receivedAt,
  data: JSON.parse(row.payloadJson)
}), "serializeTelemetry");
var parseLimit = /* @__PURE__ */ __name((value) => {
  if (value === null) return 100;
  const limit = Number(value);
  if (!Number.isInteger(limit) || limit < 1 || limit > 500) throw new ApiError(400, "INVALID_LIMIT", "limit must be between 1 and 500.");
  return limit;
}, "parseLimit");
var parseDateQuery = /* @__PURE__ */ __name((value, name) => {
  if (value === null || value === "") return null;
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) throw new ApiError(400, "INVALID_TIME_RANGE", `${name} must be an ISO 8601 timestamp.`);
  return new Date(parsed).toISOString();
}, "parseDateQuery");
var onlineThreshold = /* @__PURE__ */ __name((env) => {
  const parsed = Number(env.ONLINE_THRESHOLD_SECONDS);
  return Number.isInteger(parsed) && parsed >= 5 && parsed <= 3600 ? parsed : 30;
}, "onlineThreshold");
var randomIdentifier = /* @__PURE__ */ __name((length) => {
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}, "randomIdentifier");

// src/index.ts
var DEVICE_PATTERN = /^\/api\/web\/v1\/devices\/(dev_[a-z0-9]+)$/u;
var LATEST_PATTERN = /^\/api\/web\/v1\/devices\/(dev_[a-z0-9]+)\/latest$/u;
var HISTORY_PATTERN = /^\/api\/web\/v1\/devices\/(dev_[a-z0-9]+)\/telemetry$/u;
var TELEMETRY_PATTERN = /^\/api\/v1\/devices\/(dev_[a-z0-9]+)\/telemetry$/u;
var index_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const requestId = crypto.randomUUID();
    try {
      assertTransport(url, env);
      if (request.method === "OPTIONS") return preflight(request, env);
      const response = await route(request, env, url);
      return secureResponse(response, request, env, requestId);
    } catch (error) {
      if (error instanceof ApiError) {
        const response = errorResponse(error);
        if (url.pathname === "/api/auth/google/callback") response.headers.append("Set-Cookie", clearCookie(OIDC_FLOW_COOKIE, true));
        return secureResponse(response, request, env, requestId);
      }
      console.error(JSON.stringify({ level: "error", event: "request_failed", requestId, method: request.method, path: url.pathname }));
      return secureResponse(errorResponse(new ApiError(500, "INTERNAL_ERROR", "The request could not be completed.")), request, env, requestId);
    }
  }
};
var route = /* @__PURE__ */ __name(async (request, env, url) => {
  if (request.method === "GET" && url.pathname === "/api/health") return json({ ok: true, service: "gaia-senseware-sensor-platform" });
  if (request.method === "GET" && url.pathname === "/api/auth/google/start") return startGoogleLogin(request, env);
  if (request.method === "GET" && url.pathname === "/api/auth/google/callback") return finishGoogleLogin(request, env);
  if (request.method === "GET" && url.pathname === "/api/web/v1/session") return sessionResponse(request, env);
  if (request.method === "POST" && url.pathname === "/api/web/v1/logout") return logout(request, env);
  if (request.method === "POST" && url.pathname === "/api/v1/device/pair") return pairDevice(request, env);
  const telemetryMatch = TELEMETRY_PATTERN.exec(url.pathname);
  if (request.method === "POST" && telemetryMatch?.[1]) return acceptTelemetry(request, env, telemetryMatch[1]);
  if (request.method === "GET" && url.pathname === "/api/web/v1/countries") {
    await getAuthenticatedUser(request, env);
    return listCountries(env);
  }
  const user = await getAuthenticatedUser(request, env);
  if (request.method === "GET" && url.pathname === "/api/web/v1/devices") return listDevices(env, user);
  if (request.method === "POST" && url.pathname === "/api/web/v1/devices/pairing") return createPairing(request, env, user);
  const latestMatch = LATEST_PATTERN.exec(url.pathname);
  if (request.method === "GET" && latestMatch?.[1]) return getLatest(env, user, latestMatch[1]);
  const historyMatch = HISTORY_PATTERN.exec(url.pathname);
  if (request.method === "GET" && historyMatch?.[1]) return getHistory(env, user, historyMatch[1], url);
  const deviceMatch = DEVICE_PATTERN.exec(url.pathname);
  if (deviceMatch?.[1]) {
    if (request.method === "GET") return getDevice(env, user, deviceMatch[1]);
    if (request.method === "PATCH") return updateDevice(request, env, user, deviceMatch[1]);
    if (request.method === "DELETE") return revokeDevice(request, env, user, deviceMatch[1]);
  }
  throw new ApiError(404, "NOT_FOUND", "Endpoint was not found.");
}, "route");
var assertTransport = /* @__PURE__ */ __name((url, env) => {
  const local = url.hostname === "127.0.0.1" || url.hostname === "localhost";
  if (url.protocol !== "https:" && !(env.ENVIRONMENT === "local" && local)) {
    throw new ApiError(400, "HTTPS_REQUIRED", "HTTPS is required.");
  }
}, "assertTransport");
var preflight = /* @__PURE__ */ __name((request, env) => {
  const origin = request.headers.get("Origin");
  if (origin !== env.WEB_ORIGIN) throw new ApiError(403, "ORIGIN_NOT_ALLOWED", "Origin is not allowed.");
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-CSRF-Token",
      "Access-Control-Max-Age": "600",
      Vary: "Origin"
    }
  });
}, "preflight");
var secureResponse = /* @__PURE__ */ __name((response, request, env, requestId) => {
  const headers = new Headers(response.headers);
  headers.set("X-Request-Id", requestId);
  headers.set("X-Frame-Options", "DENY");
  headers.set("Permissions-Policy", "geolocation=(), camera=(), microphone=(), bluetooth=()");
  if (new URL(request.url).protocol === "https:") headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  const origin = request.headers.get("Origin");
  if (origin === env.WEB_ORIGIN) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Credentials", "true");
    headers.append("Vary", "Origin");
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}, "secureResponse");

// src/pages-entry.ts
var pages_entry_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) return index_default.fetch(request, env);
    return env.ASSETS.fetch(request);
  }
};
export {
  pages_entry_default as default
};
