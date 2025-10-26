const HTTPError = require("./http-error");

module.exports = async function () {
  if (Date.now() - process.env.SPOTIFY_TOKEN_TIME < 50 * 60 * 1000) {
    return;
  }
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }),
    });

    if (!response.ok) {
      throw new HTTPError(
        `Spotify token request failed: ${response.statusText}`,
        response.status,
        response
      );
    }

    const data = await response.json();
    process.env.SPOTIFY_TOKEN = data.access_token;
    process.env.SPOTIFY_TOKEN_TIME = Date.now();
    console.log("New Spotify Token Recieved!");
  } catch (error) {
    console.error("Failed to get Spotify token:", error);
  }
};
