const { Router } = require('express');
const { check } = require('express-validator');

const { login, googleSignIn } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

router.post('/login', [
  check('email', 'Is not a valid email').isEmail(),
  check('password', 'Password is not valid').notEmpty(),
  validateFields,
],login);

router.post('/google', [
  check('idToken', 'Google token is needed').notEmpty(),
  validateFields,
],googleSignIn);

module.exports = router;