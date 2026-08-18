import sensorPlatform from "./index";

interface PagesEnv extends Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: PagesEnv): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) return sensorPlatform.fetch(request, env);
    const assetResponse = await env.ASSETS.fetch(request);
    if (!/^\/assets\/audio\/.+\.mp3$/u.test(url.pathname) || !assetResponse.ok) return assetResponse;

    const headers = new Headers(assetResponse.headers);
    headers.set("Accept-Ranges", "bytes");
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
