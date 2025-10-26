const express = require("express");
const {
  getSongById,
  getSongsByPlaylistId,
} = require("../controllers/getSongsController");
const { downloadSongsbyId } = require("../controllers/downloadSongsController");
const Router = express.Router();

Router.get("/song/:id", getSongById);
Router.get("/playlist/:id", getSongsByPlaylistId);
Router.post("/download", downloadSongsbyId);
module.exports = Router;
