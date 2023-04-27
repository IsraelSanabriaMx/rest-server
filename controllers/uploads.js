const { request, response } = require('express');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

const { fileUpload, removePreviousFile, buildFilePath } = require('../helpers/file-upload');
const { User, Product } = require('../models');

const extensions = ['png', 'jpg', 'jpeg', 'gif'];

const parseModel = async (res, id, collection = '') => {
  let model;

  switch (collection) {
    case 'users':
      model = await User.findById(id);

      if (!model) {
        return res.status(400).json({
          msg: `The user with id: ${id} does not exist`,
        });
      }
      break;
    case 'products':
      model = await Product.findById(id);

      if (!model) {
        return res.status(400).json({
          msg: `The product with id: ${id} does not exist`,
        });
      }
      break;
    default:
      return res.status(500).json({
        msg: `That collection ${collection} is not implemented`,
      });
  }

  return model;
}

const upload = async (req = request, res = response) => {
  try {
    const { fileName } = await fileUpload(req.files.file, extensions);

    res.json({
      fileName,
    });
  } catch (err) {
    res.status(400).json({
      msg: err,
    });
  }
};

const uploadModelImg = async (req = request, res = response) => {
  const { collection, id } = req.params;

  const model = await parseModel(res, id, collection);

  if (model.img) {
    removePreviousFile(model.img, collection);
  }

  const { fileName } = await fileUpload(req.files.file, undefined, collection);
  model.img = fileName;

  await model.save();

  res.json({
    model,
  });
};

const uploadModelImgCloudinary = async (req = request, res = response) => {
  cloudinary.config(process.env.CLOUDINARY_URL);
  const { collection, id } = req.params;

  const model = await parseModel(res, id, collection);

  if (model.img) {
    const imgArr = model.img.split('/');
    const name = imgArr[imgArr.length - 1];
    const [public_id] = name.split('.');

    await cloudinary.uploader.destroy(public_id);
  }

  const { tempFilePath } = req.files.file;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
  model.img = secure_url;

  await model.save();

  res.json({
    model,
  });
};

const showImg = async (req = request, res = response) => {
  const { collection, id } = req.params;

  const model = await parseModel(res, id, collection);

  if (model.img) {
    const filePath = buildFilePath(collection, model.img);

    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
  }

  // FINISH
  const placeholder = buildFilePath('', 'no-image.jpg');
  res.sendFile(placeholder);
};


module.exports = {
  showImg,
  upload,
  uploadModelImg,
  uploadModelImgCloudinary,
};