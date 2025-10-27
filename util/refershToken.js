// refresh-token.js
// This script automatically refreshes the Google Drive access token
// Only refreshes if token expires in less than 30 minutes

const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const credentials = require("../tmp/credentials.json");
// Load credentials and token
const TOKEN_PATH = path.join(__dirname, "../tmp/token.json");

// Minimum time before expiry to trigger refresh (30 minutes in milliseconds)
const MIN_TIME_BEFORE_REFRESH = 30 * 60 * 1000; // 30 minutes

async function refreshToken() {
  try {
    // Check if token file exists
    if (!fs.existsSync(TOKEN_PATH)) {
      throw new Error("token.json not found! Please authenticate first.");
    }

    // Load the current token
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH));

    // Check if refresh token exists
    if (!token.refresh_token) {
      throw new Error("No refresh token found! You need to re-authenticate.");
    }

    // Check if token needs refresh
    const now = Date.now();
    const expiryDate = token.expiry_date;
    const timeUntilExpiry = expiryDate - now;

    // Convert to minutes for display
    const minutesUntilExpiry = Math.round(timeUntilExpiry / (1000 * 60));

    // Check if token still has more than 30 minutes
    if (timeUntilExpiry > MIN_TIME_BEFORE_REFRESH) {
      return token; // Return existing token, no refresh needed
    }

    console.log("\n⚠ Token expires in ", minutesUntilExpiry, " minutes");
    console.log("→ Refreshing token...");

    // Extract credentials
    const { client_secret, client_id, redirect_uris } =
      credentials.installed || credentials.web;

    // Create OAuth2 client
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    // Set the credentials with the refresh token
    oAuth2Client.setCredentials(token);

    // Force a token refresh
    const { credentials: newToken } = await oAuth2Client.refreshAccessToken();

    // The refresh token doesn't change, but we get a new access token
    const updatedToken = {
      ...token, // Keep the old refresh token
      access_token: newToken.access_token, // Update with new access token
      expiry_date: newToken.expiry_date, // Update expiry date
      token_type: newToken.token_type,
      scope: newToken.scope,
    };

    // Save the updated token
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(updatedToken, null, 2));
    console.log("✓ Token refreshed and saved!");

    // Calculate new expiry
    const newExpiryDate = new Date(updatedToken.expiry_date);
    const newHoursUntilExpiry = Math.round(
      (newExpiryDate - now) / (1000 * 60 * 60)
    );

    console.log(`✓ Token refresh successful!\n`);

    return updatedToken;
  } catch (error) {
    console.error("✗ Error refreshing token:", error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  refreshToken()
    .then(() => {
      console.log("Done!");
      process.exit(0);
    })
    .catch(error => {
      console.error("Failed:", error.message);
      process.exit(1);
    });
}

// Export for use in other files
module.exports = { refreshToken };
