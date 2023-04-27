const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields, validateJwt, validateIsAdmin } = require('../middlewares');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/products');
const { validateProductId, validateCategoryId } = require('../helpers');

const router = Router();

router.get('/', [
], getProducts);

router.get('/:id', [
  check('id', 'Is not a valid ID').isMongoId(),
  check('id').custom(validateProductId),
  validateFields,
], getProductById);

router.post('/', [
  validateJwt,
  check('name', 'name is required').notEmpty(),
  check('category', 'Is not a valid Category ID').isMongoId(),
  check('category').custom(validateCategoryId),
  validateFields,
], createProduct);

router.put('/:id', [
  validateJwt,
  check('id', 'Is not a valid ID').isMongoId(),
  check('id').custom(validateProductId),
  check('category', 'Is not a valid Category ID').isMongoId(),
  check('category').custom(validateCategoryId),
  validateFields,
], updateProduct);

router.delete('/:id', [
  validateJwt,
  validateIsAdmin,
  check('id', 'Is not a valid ID').isMongoId(),
  check('id').custom(validateProductId),
  validateFields,
], deleteProduct);

module.exports = router;