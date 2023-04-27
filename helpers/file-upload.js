const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const buildFilePath = (directory = '', fileName) => path.join(__dirname, '../uploads/', directory, fileName);

const fileUpload = (file, extensions = ['png', 'jpg', 'jpeg', 'gif'], directory = '') => {
  return new Promise((resolve, reject) => {
    const nameArr = file.name.split('.');
    const extension = nameArr[nameArr.length - 1];

    if (!extensions.includes(extension)) {
      return reject(`Extension ${extension} is not allowed, ${extensions}`);
    }

    const fileName = `${uuidv4()}.${extension}`;
    const uploadPath = buildFilePath(directory, fileName);

    file.mv(uploadPath, (err) => {
      if (err) {
        reject({ err });
      }

      resolve({
        uploadPath,
        fileName,
      });
    });
  });
};

const removePreviousFile = (fileName, directory = '') => {
  const filePath = buildFilePath(directory, fileName);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

module.exports = {
  buildFilePath,
  fileUpload,
  removePreviousFile,
};