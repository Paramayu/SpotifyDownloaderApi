module.exports = (folderId, drive) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      await drive.files.update({
        fileId: folderId,
        requestBody: { trashed: true },
      });
      await drive.files.emptyTrash();
      console.log("\n✓ Session Folder deleted successfully!");
      resolve();
    }, 2 * 60 * 1000);
  });
};
