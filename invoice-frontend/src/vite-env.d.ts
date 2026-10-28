/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string | undefined;
  readonly VITE_AUDIENCE: string | undefined;
  readonly VITE_SCOPE: string | undefined;
  readonly VITE_DOMAIN: string | undefined;
  readonly VITE_CLIENT_ID: string | undefined;
  readonly VITE_REDIRECT_URI: string | undefined;
  readonly VITE_DEMO_MODE: string | undefined;
  readonly VITE_DEMO_SESSIONS: string | undefined;
}
