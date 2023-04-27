const { Router } = require('express');
const { check } = require('express-validator');

const { getCategories, getCategoryById, updateCategory, createCategory, deleteCategory } = require('../controllers/categories');
const { validateFields, validateJwt, validateIsAdmin } = require('../middlewares');
const { validateCategoryId } = require('../helpers');

const router = Router();

router.get('/', [
], getCategories);

router.get('/:id', [
  check('id', 'Is not a valid ID').isMongoId(),
  check('id').custom(validateCategoryId),
  validateFields,
], getCategoryById);

router.post('/', [
  validateJwt,
  check('name', 'name is required').notEmpty(),
  validateFields,
], createCategory);

router.put('/:id', [
  validateJwt,
  check('name', 'name is required').notEmpty(),
  check('id', 'Is not a valid ID').isMongoId(),
  check('id').custom(validateCategoryId),
  validateFields,
], updateCategory);

router.delete('/:id', [
  validateJwt,
  validateIsAdmin,
  check('id', 'Is not a valid ID').isMongoId(),
  check('id').custom(validateCategoryId),
  validateFields,
], deleteCategory);

module.exports = router;