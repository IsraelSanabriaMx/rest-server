const fields = require('./validate-fields');
const jwt = require('./validate-jwt');
const roles = require('./validate-roles');

module.exports = {
  ...fields,
  ...jwt,
  ...roles,
};