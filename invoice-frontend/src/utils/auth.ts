// // src/auth.js
// import { Auth0Client } from "@auth0/auth0-spa-js";

// let auth0Client: Auth0Client;

// const initializeAuth0 = async () => {
//   auth0Client = await new Auth0Client({
//     domain: "dev-n4e4qk7s3kbzusrs.us.auth0.com",
//     clientId: "loNmHPxISIwdG530C4nTgEP5lWFVusZW",
//     authorizationParams: {
//       redirect_uri: window.location.origin,
//       cacheLocation: "memory",
//     },
//   });
// };

// // Call this function early in your app's lifecycle
// initializeAuth0();

// export const getAccessTokenSilently = async () => {
//   if (!auth0Client) {
//     await initializeAuth0();
//   }
//   try {
//     const token = await auth0Client.getTokenSilently();
//     console.log("Token:", token);
//     return token;
//   } catch (error) {
//     console.error("Failed to get access token", error);
//     return null;
//   }
// };
