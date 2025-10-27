const express = require("express");
const { Server } = require("socket.io");
const HTTP = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const errorHandler = require("./controllers/errorController");
const { initSocket } = require("./util/socketService");
const getSpotifyToken = require("./util/getSpotifyToken");
require("dotenv").config();
const initializeCredentials = require("./util/initializeCredentials");
initializeCredentials();

const app = express();
const server = HTTP.createServer(app);
const io = initSocket(server);
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

const indexRoutes = require("./routes/indexRoutes");
app.use("/api", indexRoutes);
app.get("/ping", (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Server is running",
    timestamp: new Date(),
  });
});

app.use(errorHandler);
const port = process.env.PORT || 3000;
server.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  getSpotifyToken();
});
