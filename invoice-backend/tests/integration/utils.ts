import dotenv from "dotenv";
dotenv.config({ path: "no-git.env" });

const DOMAIN = process.env.DOMAIN ?? "";
const CLIENT_ID = process.env.CLIENT_ID ?? "";
const CLIENT_SECRET = process.env.CLIENT_SECRET ?? "";
const AUDIENCE = process.env.AUDIENCE ?? "";

function checkEnvVars() {
  if (!DOMAIN || !CLIENT_ID || !CLIENT_SECRET || !AUDIENCE) {
    throw new Error(
      "Please provide DOMAIN, CLIENT_ID, CLIENT_SECRET, and AUDIENCE in the environment",
    );
  }
}

checkEnvVars();

// Get a real token for testing
export const getTestToken = async () => {
  try {
    const response = await fetch(`${DOMAIN}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        audience: AUDIENCE,
        grant_type: "client_credentials",
      }),
    });

    if (!response.ok) {
      console.error(response);
      throw new Error(`Failed to fetch token: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error fetching token:", error);
    throw error;
  }
};
