const { request, response } = require('express');

const validateIsAdmin = (req = request, res = response, next) => {
  const user = req.userAuthenticated;

  if (!user) {
    return res.status(500).json({
      msg: 'Not validated token before to validate is admin',
    });
  }

  if (user.role !== 'ADMIN_ROLE') {
    return res.status(401).json({
      msg: 'User role authenticated not valid',
    });
  }

  next();
};

const hasRole = (...roles) => {
  return (req = request, res = response, next) => {
    const user = req.userAuthenticated;

    if (!roles.includes(user.role)) {
      return res.status(401).json({
        msg: `Service needs one of these roles: ${roles}`,
      });
    }

    next();
  }
};

module.exports = {
  validateIsAdmin,
  hasRole,
}