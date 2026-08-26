import sensorPlatform from "./index";

interface PagesEnv extends Env {
  ASSETS: Fetcher;
}

const NON_PUBLIC_FILES = new Set([
  "/.codex-write-probe",
  "/.gitattributes",
  "/.gitignore",
  "/AGENTS.md",
  "/CHARACTER-DESIGN.md",
  "/package.json",
  "/README.md",
  "/wrangler.jsonc",
].map((path) => path.toLowerCase()));

const NON_PUBLIC_PREFIXES = [
  "/.github/",
  "/.tmp/",
  "/.wrangler/",
  "/artifacts/",
  "/contest-limited/",
  "/docs/",
  "/node_modules/",
  "/output/",
  "/scripts/",
  "/sensor-platform/",
  "/smartcity-sensor-starter-kit/",
  "/story/",
  "/tests/",
  "/tmp/",
];

const isNonPublicPath = (pathname: string): boolean => {
  let decodedPath = pathname;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {}
  const normalizedPath = decodedPath.toLowerCase();
  return NON_PUBLIC_FILES.has(normalizedPath)
    || NON_PUBLIC_PREFIXES.some((prefix) => normalizedPath.startsWith(prefix));
};

const nonPublicResponse = (): Response => new Response("Not Found", {
  status: 404,
  headers: {
    "Cache-Control": "no-store",
    "Content-Type": "text/plain; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
  },
});

export default {
  async fetch(request: Request, env: PagesEnv): Promise<Response> {
    const url = new URL(request.url);
    if (isNonPublicPath(url.pathname)) return nonPublicResponse();
    if (url.pathname.startsWith("/api/")) return sensorPlatform.fetch(request, env);
    const assetResponse = await env.ASSETS.fetch(request);
    if (!/^\/assets\/audio\/.+\.mp3$/u.test(url.pathname) || !assetResponse.ok) return assetResponse;

    const headers = new Headers(assetResponse.headers);
    headers.set("Accept-Ranges", "bytes");
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    const range = request.headers.get("Range")?.match(/^bytes=(\d*)-(\d*)$/u);
    if (!range || assetResponse.status === 206 || request.method === "HEAD") {
      return new Response(assetResponse.body, { status: assetResponse.status, statusText: assetResponse.statusText, headers });
    }

    const bytes = await assetResponse.arrayBuffer();
    const suffixLength = range[1] ? 0 : Number(range[2]);
    const start = range[1] ? Number(range[1]) : Math.max(0, bytes.byteLength - suffixLength);
    const end = range[2] && range[1] ? Math.min(Number(range[2]), bytes.byteLength - 1) : bytes.byteLength - 1;
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end < start || start >= bytes.byteLength) {
      headers.set("Content-Range", `bytes */${bytes.byteLength}`);
      headers.set("Content-Length", "0");
      return new Response(null, { status: 416, headers });
    }
    const chunk = bytes.slice(start, end + 1);
    headers.set("Content-Range", `bytes ${start}-${end}/${bytes.byteLength}`);
    headers.set("Content-Length", String(chunk.byteLength));
    return new Response(chunk, { status: 206, headers });
  },
} satisfies ExportedHandler<PagesEnv>;
