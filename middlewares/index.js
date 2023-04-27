const fields = require('./validate-fields');
const jwt = require('./validate-jwt');
const roles = require('./validate-roles');
const uploads = require('./validate-uploads');

module.exports = {
  ...fields,
  ...jwt,
  ...roles,
  ...uploads,
};