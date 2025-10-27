const fs = require("fs");
require("dotenv").config();
const credentialsData = JSON.parse(process.env.CREDENTIALS);
const tokenData = JSON.parse(process.env.TOKEN);

module.exports = () => {
  fs.writeFileSync(
    "credentials.json",
    JSON.stringify(credentialsData, null, 2)
  );
  fs.writeFileSync("token.json", JSON.stringify(tokenData, null, 2), "utf-8");
  console.log("Credentials Initialized!");
};
