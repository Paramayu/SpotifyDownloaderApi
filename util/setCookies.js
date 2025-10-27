module.exports = function () {
  const fs = require("fs");
  const b64 = process.env.YT_COOKIES_B64;
  if (!b64) {
    console.warn(
      "YT_COOKIES_B64 not found in env — proceeding without cookies"
    );
    return null;
  }
  if (!fs.existsSync("/tmp")) fs.mkdirSync("/tmp", { recursive: true });

  const cookies = Buffer.from(b64, "base64").toString("utf8");
  // write with restrictive permissions
  fs.writeFileSync("./tmp/cookies.txt", cookies, { mode: 0o600 });
  console.log("Cookie Set!");
  return;
};
