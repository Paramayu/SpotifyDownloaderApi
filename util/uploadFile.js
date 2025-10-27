// upload-music.js
// Simple script to upload WebM audio files with automatic token validation

const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

// Function to upload a WebM file to Google Drive
async function uploadWebM(
  filePath,
  oAuth2Client,
  folderId = null,
  customFileName = null
) {
  try {
    // Step 2: Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    const drive = google.drive({ version: "v3", auth: oAuth2Client });

    // Step 4: Prepare file metadata
    const fileName = customFileName || path.basename(filePath);

    const fileMetadata = {
      name: fileName,
    };

    // If folder ID provided, upload to that folder
    if (folderId) {
      fileMetadata.parents = [folderId];
    }

    const media = {
      mimeType: "audio/webm", // WebM audio MIME type
      body: fs.createReadStream(filePath),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id, name, webViewLink, size, mimeType",
    });

    // Step 7: Success!

    return response.data;
  } catch (error) {
    console.error("\n✗ Upload failed:", error.message);
    throw error;
  }
}

module.exports = { uploadWebM };
