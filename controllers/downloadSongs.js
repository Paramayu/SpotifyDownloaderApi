const youtubedl = require("youtube-dl-exec");
const youtubesearchapi = require("youtube-search-api");
const HTTPError = require("../util/http-error");
const path = require("path");
const fs = require("fs");
const { google } = require("googleapis");
const { uploadWebM } = require("../util/uploadFile");
const { refreshToken } = require("../util/refershToken");
const credentials = require("../credentials/credentials.json");
const deleteDriveFolder = require("../util/deleteDriveFolder");
const { client_secret, client_id, redirect_uris } =
  credentials.installed || credentials.web;

const seekAndDownload = async (name, sessionId, artist) => {
  let results;
  try {
    console.log(`\nSearching for ${name} by ${artist} lyrics`);
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
    console.log(`Downloading ${name} by ${artist}`);
    await youtubedl(
      `https://www.youtube.com/watch?v=${results.items[0].id}`,
      {
        format: "bestaudio", // extract only audio
        audioQuality: "0", // 0 = best
        output: `./temp/${sessionId}/${name} -${artist}.webm`,
      },
      { useGlobalBinary: true }
    );
    console.log(`Downloaded ${name} by ${artist}`);
    return `${name} -${artist}.webm`;
  } catch (error) {
    throw new HTTPError("Downloading Failed", 500, error);
  }
};

const downloadSongsbyId = async (req, res, next) => {
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

  console.log(
    `\n\nOperation ID: ${sessionId}\nCreating folder "${sessionId}"...`
  );
  const response = await drive.files.create({
    requestBody: fileMetadata, // The folder information
    fields: "id", // What information to return
  });

  for (const song of req.body.tracks) {
    try {
      downloadedSong = await seekAndDownload(song.name, sessionId, song.artist);
    } catch (error) {
      throw new HTTPError("Downloading Failed", 500, error);
    }
    const filepath = path.join(
      __dirname,
      `../temp/${sessionId}/${downloadedSong}`
    );

    try {
      const token = await refreshToken();

      oAuth2Client.setCredentials(token);

      console.log(`Uploading ${song.name}...`);
      await uploadWebM(filepath, oAuth2Client, response.data.id);
    } catch (error) {
      throw new HTTPError("Uploading Failed", 500, error);
    }
    try {
      fs.unlinkSync(filepath);
      console.log(`Deleted ${song.name}`);
    } catch (error) {
      throw new HTTPError("Deleting Failed", 500, error);
    }
  }
  try {
    await deleteDriveFolder(response.data.id, drive);
    fs.rm(path.join(process.cwd(), `temp/${sessionId}`), err => {
      console.log("Deleted temp folder");
    });
    res.status(201).json({
      link: `https://drive.google.com/drive/folders/${response.data.id}`,
    });
  } catch (err) {
    console.error("Something happened while deleting the folder:", err);
    throw new HTTPError(
      `https://drive.google.com/drive/folders/${response.data.id}`,
      500
    );
  } finally {
    console.log("Operation Complete");
  }
};

module.exports = { downloadSongsbyId };
