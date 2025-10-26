module.exports = async (folderId, drive) => {
  setTimeout(async () => {
    await drive.files.update({
      fileId: folderId,
      requestBody: { trashed: true },
    });
    await drive.files.emptyTrash();
    console.log("\nDeleted folder with ID:", folderId);
  }, 10 * 60 * 1000);
};
