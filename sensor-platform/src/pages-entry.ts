import sensorPlatform from "./index";

interface PagesEnv extends Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: PagesEnv): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) return sensorPlatform.fetch(request, env);
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<PagesEnv>;
