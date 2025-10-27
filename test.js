// // Import required modules
// const { google } = require("googleapis"); // Google's API library
const fs = require("fs"); // File system (to read credentials.json)
const path = require("path");
const initializeCredentials = require("./util/initializeCredentials");
require("dotenv").config();
// const readline = require("readline"); // To read user input from terminal

// const { refreshToken } = require("./util/refershToken");
// const { uploadWebM } = require("./util/uploadFile");
// const credentials = require("./credentials/credentials.json");
// const path = require("path");

// // Step 1: Load your credentials from the JSON file you downloaded

// // Step 2: Define what permissions (scopes) we need
// // 'drive.file' means: "access only files that this app creates"
// const SCOPES = ["https://www.googleapis.com/auth/drive"];

// // Step 3: Define where to save the authentication token
// // After first login, we save the token so you don't have to login every time
// const TOKEN_PATH = "token.json";

// // Step 4: Extract credentials from the JSON file
// // The structure can be either credentials.installed or credentials.web
// const { client_secret, client_id, redirect_uris } =
//   credentials.installed || credentials.web;

// // Step 5: Create an OAuth2 client
// // This is what handles the authentication process
// const oAuth2Client = new google.auth.OAuth2(
//   client_id, // Your app's client ID
//   client_secret, // Your app's client secret
//   redirect_uris[0] // Where to redirect after authentication
// );

// // Step 6: Function to authenticate the user
// async function authenticate() {
//   // Check if we already have a saved token
//   if (fs.existsSync(TOKEN_PATH)) {
//     // If token exists, read it and use it
//     const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
//     oAuth2Client.setCredentials(token);
//     console.log("✓ Using saved authentication token");
//     return oAuth2Client;
//   }

//   // If no token exists, we need to get one from the user
//   console.log("No saved token found. Starting authentication...\n");

//   // Generate the authentication URL
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: "offline", // We want a refresh token
//     scope: SCOPES, // The permissions we need
//   });

//   // Print the URL and ask user to visit it
//   console.log("Please visit this URL to authorize this app:");
//   console.log(authUrl);
//   console.log("");

//   // Create an interface to read user input
//   const rl = readline.createInterface({
//     input: process.stdin, // Read from terminal input
//     output: process.stdout, // Write to terminal output
//   });

//   // Ask user to paste the code they get after visiting the URL
//   return new Promise((resolve, reject) => {
//     rl.question("Enter the authorization code from that page: ", code => {
//       rl.close(); // Close the input interface

//       // Exchange the code for an access token
//       oAuth2Client.getToken(code, (err, token) => {
//         if (err) {
//           console.error("Error getting access token:", err);
//           return reject(err);
//         }

//         // Set the credentials
//         oAuth2Client.setCredentials(token);

//         // Save the token for next time
//         fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
//         console.log("✓ Token saved to", TOKEN_PATH);
//         console.log("✓ Authentication successful!\n");

//         resolve(oAuth2Client);
//       });
//     });
//   });
// }

// // Step 7: Function to create a folder
// async function createFolder(folderName) {
//   try {
//     // First, authenticate
//     const auth = await authenticate();

//     // Create a Drive API client
//     const drive = google.drive({ version: "v3", auth });

//     // Define the folder metadata
//     const fileMetadata = {
//       name: folderName, // The folder's name
//       mimeType: "application/vnd.google-apps.folder", // This tells Drive it's a folder
//     };

//     // Make the API call to create the folder
//     console.log(`Creating folder "${folderName}"...`);
//     const response = await drive.files.create({
//       requestBody: fileMetadata, // The folder information
//       fields: "id, name", // What information to return
//     });

//     // Success! Print the results
//     console.log("✓ Folder created successfully!");
//     console.log("  Folder Name:", response.data.name);
//     console.log("  Folder ID:", response.data.id);
//     console.log(
//       `  View it at: https://drive.google.com/drive/folders/${response.data.id}`
//     );

//     return response.data;
//   } catch (error) {
//     console.error("✗ Error creating folder:", error.message);
//     throw error;
//   }
// }

// // Step 8: Run the program
// async function main() {
//   try {
//     // Create a folder called "My First Folder"
//     await createFolder("My First Folder");
//   } catch (error) {
//     console.error("Program failed:", error.message);
//   }
// }

// // Start the program
// main();
// // (async () => {
// //   const token = await refreshToken();
// //   const { client_secret, client_id, redirect_uris } =
// //     credentials.installed || credentials.web;

// //   const oAuth2Client = new google.auth.OAuth2(
// //     client_id,
// //     client_secret,
// //     redirect_uris[0]
// //   );

// //   oAuth2Client.setCredentials(token);
// //   const filepath = path.join(__dirname, "/temp/sessionId/Vaarron -.webm");
// //   await uploadWebM(
// //     filepath,
// //     oAuth2Client,
// //     "1ZUFfvsSdbiBdcAhNEHl6uYFHp3WhPUKN",
// //     "Vaarron"
// //   );
// // })();
// // console.log(__dirname);

console.log(JSON.parse(process.env.TOKEN));
initializeCredentials();
