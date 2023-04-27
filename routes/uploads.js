const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields, validateUploads } = require('../middlewares');
const { upload, uploadModelImgCloudinary, showImg } = require('../controllers/uploads');
const { collectionsAllowed } = require('../helpers');

const router = Router();

router.get('/:collection/:id', [
  check('id', 'Is not a valid ID').isMongoId(),
  check('collection').custom((c) => collectionsAllowed(c, ['users', 'products'])),
  validateFields,
], showImg);

router.post('/', [
  validateUploads,
  validateFields,
], upload);

router.put('/:collection/:id', [
  check('id', 'Is not a valid ID').isMongoId(),
  check('collection').custom((c) => collectionsAllowed(c, ['users', 'products'])),
  validateUploads,
  validateFields,
// ], uploadModelImg);
], uploadModelImgCloudinary);

module.exports = router;