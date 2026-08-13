interface Env {
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  SESSION_SECRET: string;
  DEVICE_TOKEN_PEPPER: string;
  PAIRING_CODE_PEPPER: string;
}

declare namespace Cloudflare {
  interface Env {
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    SESSION_SECRET: string;
    DEVICE_TOKEN_PEPPER: string;
    PAIRING_CODE_PEPPER: string;
  }
}
