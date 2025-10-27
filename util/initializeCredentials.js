const fs = require("fs");
const credentialsData = JSON.parse(process.env.CREDENTIALS);
const tokenData = JSON.parse(process.env.TOKEN);

module.exports = () => {
  fs.writeFileSync(
    "tmp/credentials.json",
    JSON.stringify(credentialsData, null, 2)
  );
  fs.writeFileSync(
    "tmp/token.json",
    JSON.stringify(tokenData, null, 2),
    "utf-8"
  );
  console.log("Credentials Initialized!");
};
