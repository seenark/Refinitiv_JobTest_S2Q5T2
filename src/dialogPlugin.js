const { dialog } = require("electron").remote;
export default {
  async openFileDialog() {
    const files = await dialog.showOpenDialog({
      properties: ["openFile"],
    });
    if (!files.canceled && files.filePaths.length <= 0) {
      return null;
    } else {
      return files.filePaths[0];
    }
  },
  async saveFileDialog() {
    const files = await dialog.showSaveDialog({
      properties: ["showOverwriteConfirmation"],
    });
    let filepath = files.filePath;
    console.log("test", /^.+(.json){1,1}$/gi.test(filepath));
    if (/^.+(.json){1,1}$/gi.test(filepath)) {
      console.log("filepath", filepath);
      filepath = filepath.replace(/\.json/gi, "");
      console.log("filepath2", filepath);
    }
    filepath = filepath + ".json";
    return filepath;
  },
};
