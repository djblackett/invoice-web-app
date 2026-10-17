export const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const VITE_AUDIENCE = import.meta.env.VITE_AUDIENCE;
export const VITE_SCOPE = import.meta.env.VITE_SCOPE;
export const VITE_DOMAIN = import.meta.env.VITE_DOMAIN;
export const VITE_CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
export const VITE_REDIRECT_URI =
  import.meta.env.VITE_REDIRECT_URI ||
  window.location.origin + "/invoice-web-app/";

export const isDemoMode = import.meta.env.VITE_DEMO_MODE === "true";
export const hasAuth0Config = Boolean(
  VITE_AUDIENCE && VITE_SCOPE && VITE_DOMAIN && VITE_CLIENT_ID,
);

function checkEnvs() {
  if (!VITE_BACKEND_URL) {
    throw new Error("VITE_BACKEND_URL is required");
  }

  // AppWrapper mounts Auth0 only when configured. Missing Auth0 values must
  // not prevent the public demo (or its entry screen) from booting.
}

checkEnvs();
