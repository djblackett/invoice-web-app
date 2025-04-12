export const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const VITE_AUDIENCE = import.meta.env.VITE_AUDIENCE;
export const VITE_SCOPE = import.meta.env.VITE_SCOPE;
export const VITE_DOMAIN = import.meta.env.VITE_DOMAIN;
export const VITE_CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
export const VITE_REDIRECT_URI =
  import.meta.env.VITE_REDIRECT_URI ||
  window.location.origin + "/invoice-web-app/";

// export const isDemoMode = import.meta.env.VITE_DEMO_MODE === "true";
// export const setIsDemoMode = (value: boolean) => {
//   import.meta.env.VITE_DEMO_MODE = value ? "true" : "false";
// };

function checkEnvs() {
  if (!VITE_BACKEND_URL) {
    throw new Error("VITE_BACKEND_URL is required");
  }

  // if (isDemoMode) {
  //   console.log("Demo mode enabled");
  //   return;
  // }

  if (!VITE_AUDIENCE) {
    throw new Error("VITE_AUDIENCE is required");
  }
  if (!VITE_SCOPE) {
    throw new Error("VITE_SCOPE is required");
  }
  if (!VITE_DOMAIN) {
    throw new Error("VITE_DOMAIN is required");
  }
  if (!VITE_CLIENT_ID) {
    throw new Error("VITE_CLIENT_ID is required");
  }
  if (!VITE_REDIRECT_URI) {
    throw new Error("VITE_REDIRECT_URI is required");
  }
}

checkEnvs();
