import { google } from "googleapis";

/**
 * Returns an authorized OAuth2 client.
 * Checks if the access token (from env GOOGLE_ACCESS_TOKEN) is expired.
 * If expired, refreshes it automatically using refresh token (from env GOOGLE_REFRESH_TOKEN).
 * Requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to be set in env as well.
 */
export async function getOAuth2Client() {
  const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
    GOOGLE_ACCESS_TOKEN,
    GOOGLE_REFRESH_TOKEN,
  } = process.env;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
    throw new Error("Missing required environment variables for OAuth2");
  }

  const oAuth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI || "urn:ietf:wg:oauth:2.0:oob"
  );

  oAuth2Client.setCredentials({
    access_token: GOOGLE_ACCESS_TOKEN,
    refresh_token: GOOGLE_REFRESH_TOKEN,
  });

  // Check if token is expired or about to expire
  const now = Date.now();
  if (
    !oAuth2Client.credentials.expiry_date ||
    oAuth2Client.credentials.expiry_date <= now
  ) {
    // Refresh automatically
    try {
      const newTokens = await oAuth2Client.refreshAccessToken();
      oAuth2Client.setCredentials(newTokens.credentials);

      // Optional: update your environment variable or database with new access token
      console.log("✅ Access token refreshed automatically");
      process.env.GOOGLE_ACCESS_TOKEN = newTokens.credentials.access_token;
    } catch (err) {
      console.error("Failed to refresh access token:", err);
      throw err;
    }
  }

  return oAuth2Client;
}
