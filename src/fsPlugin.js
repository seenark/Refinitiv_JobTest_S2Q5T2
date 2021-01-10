const fs = require("fs");
export default {
  readFile(fullFilePath) {
    let rawdata = fs.readFileSync(fullFilePath);
    let data = JSON.parse(rawdata);
    return data;
  },
  writeFile(fullFilePath, data) {
    fs.writeFileSync(fullFilePath, data);
  },
};
