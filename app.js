const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const indexRoutes = require("./routes/indexRoutes");
const errorHandler = require("./controllers/errorController");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api", indexRoutes);

app.use(errorHandler);
const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  //   (await getSpotifyToken())
  //     ? console.log("Spotify token fetched: ", process.env.SPOTIFY_TOKEN)
  //     : console.log("Spotify token fetching failed");
});
