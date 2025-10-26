const express = require("express");
const {
  getSongById,
  getSongsByPlaylistId,
} = require("../controllers/getSongs");
const { downloadSongsbyId } = require("../controllers/downloadSongs");
const Router = express.Router();

Router.get("/song/:id", getSongById);
Router.get("/playlist/:id", getSongsByPlaylistId);
Router.post("/download", downloadSongsbyId);
module.exports = Router;
