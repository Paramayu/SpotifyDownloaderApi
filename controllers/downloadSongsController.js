const youtubedl = require("youtube-dl-exec");
const youtubesearchapi = require("youtube-search-api");
const HTTPError = require("../util/http-error");
const path = require("path");
const fs = require("fs");
const { google } = require("googleapis");
const { uploadWebM } = require("../util/uploadFile");
const { refreshToken } = require("../util/refershToken");
const credentials = require("../tmp/credentials.json");
const deleteDriveFolder = require("../util/deleteDriveFolder");
const { getIO } = require("../util/socketService");
const { client_secret, client_id, redirect_uris } =
  credentials.installed || credentials.web;

const seekAndDownload = async (name, sessionId, artist) => {
  let results;
  try {
    results = await youtubesearchapi.GetListByKeyword(
      `${name} by ${artist} lyrics`,
      false,
      1,
      [{ type: "video" }]
    );
  } catch (err) {
    if (err instanceof youtubesearchapi.YouTubeAPIError) {
      throw new HTTPError(`${err.code} : ${err.message}`, 500, err);
    }
  }
  try {
    await youtubedl(
      `https://www.youtube.com/watch?v=${results.items[0].id}`,
      {
        format: "bestaudio", // extract only audio
        audioQuality: "0", // 0 = best
        output: `./tmp/${sessionId}/${name} -${artist}.webm`,
        extra: ["--cookies", path.join(process.cwd(), "tmp/cookies.txt")],
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
      },
      { useGlobalBinary: true }
    );
    console.log(`↓️ Downloaded ${name} by ${artist}`);
    return `${name} -${artist}.webm`;
  } catch (error) {
    throw new HTTPError("Downloading Failed", 500, error);
  }
};

const downloadSongsbyId = async (req, res, next) => {
  let totalDownloaded = 0;
  const socketId = req.query.socketId;
  if (!socketId) {
    return res.status(400).json({ error: "Socket ID is required" });
  }
  let io;

  let downloadedSong;
  const sessionId = Math.floor(Math.random() * 1000000000000).toString();
  const token = await refreshToken();
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  oAuth2Client.setCredentials(token);
  const drive = google.drive({ version: "v3", auth: oAuth2Client });
  const fileMetadata = {
    name: sessionId, // The folder's name
    mimeType: "application/vnd.google-apps.folder",
    parents: [process.env.GOOGLE_APP_FOLDER_ID], // This tells Drive it's a folder
  };

  console.log(`\nOperation Started with ID: ${sessionId}\n`);
  const response = await drive.files.create({
    requestBody: fileMetadata, // The folder information
    fields: "id", // What information to return
  });
  try {
    io = getIO();
    io.to(socketId).emit("downloadSequenceStarted");
  } catch (error) {
    next(new HTTPError("Socket Connection Failed", 500, error));
  }
  for (const song of req.body.tracks) {
    try {
      downloadedSong = await seekAndDownload(song.name, sessionId, song.artist);
    } catch (error) {
      throw new HTTPError("Downloading Failed", 500, error);
    }
    const filepath = path.join(
      __dirname,
      `../tmp/${sessionId}/${downloadedSong}`
    );

    try {
      const token = await refreshToken();

      oAuth2Client.setCredentials(token);

      await uploadWebM(filepath, oAuth2Client, response.data.id);
    } catch (error) {
      throw new HTTPError("Uploading Failed", 500, error);
    }
    console.log(`✓ Uploaded ${song.name} by ${song.artist}`);
    try {
      fs.unlinkSync(filepath);
    } catch (error) {
      throw new HTTPError("Deleting Failed", 500, error);
    }
    totalDownloaded += 1;
    io.to(socketId).emit("progress", {
      totalDownloaded,
      downloadedSong: song.name,
    });
  }
  try {
    io.to(socketId).emit("downloadSequenceCompleted");
    fs.rmdir(path.join(process.cwd(), `tmp/${sessionId}`), err => {});
    res.status(201).json({
      link: `https://drive.google.com/drive/folders/${response.data.id}`,
    });
    await deleteDriveFolder(response.data.id, drive);
  } catch (err) {
    console.error("Something happened while deleting the folder:", err);
    throw new HTTPError(
      `https://drive.google.com/drive/folders/${response.data.id}`,
      500
    );
  } finally {
    console.log("Operation Complete\n");
  }
};

module.exports = { downloadSongsbyId };
