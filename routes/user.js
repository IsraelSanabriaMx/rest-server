const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields, validateJwt, hasRole } = require('../middlewares');

const { usersGet, usersPut, usersPost, usersDelete } = require('../controllers/users');
const { roleValidator, emailDuplicated, validateId } = require('../helpers/db-validators');

const router = Router();

router.get('/', usersGet);

router.put('/:id', [
  check('id', 'Is not a valid ID').isMongoId(),
  check('id').custom(validateId),
  check('role').custom(roleValidator),
  validateFields,
], usersPut);

router.post('/', [
  check('name', 'Name is empty').notEmpty(),
  check('email', 'Email is not valid').isEmail(),
  check('email').custom(emailDuplicated),
  check('password', 'Password is not valid').isLength({ min: 6 }),
  // check('role', 'Role is not valid').isIn(['ADMIN_ROLE', 'USER_ROLE']),
  check('role').custom(roleValidator),
  validateFields,
], usersPost);

router.delete('/:id', [
  validateJwt,
  // validateIsAdmin,
  hasRole('ADMIN_ROLE', 'USER_ROLE'),
  check('id', 'Is not a valid ID').isMongoId(),
  check('id').custom(validateId),
  validateFields,
], usersDelete);

module.exports = router;