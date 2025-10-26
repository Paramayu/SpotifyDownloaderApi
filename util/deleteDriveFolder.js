module.exports = async (folderId, drive) => {
  setTimeout(async () => {
    await drive.files.update({
      fileId: folderId,
      requestBody: { trashed: true },
    });
    await drive.files.emptyTrash();
  }, 10 * 60 * 1000);
};
