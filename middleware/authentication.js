'use strict';


/**
 * FUNCTIONS.
 */
function authenticate(roles) {
  roles = roles || [];
  if (Object.prototype.toString.call(roles) !== '[object Array]') {
    roles = [roles];
  }
  return authenticateMiddleware.bind(null, roles);
}


function authenticateMiddleware(roles, req, res, next) {

  var user = req.session.user;

  if (!user) {
    var error = new Error('You need to be logged in.');
    error.status = 403;
    return next(error);
  }

  if (roles.length === 0) {
    return next();
  }

  var userRoles = user.roles || [];

  userRoles.forEach(function(role) {
    if (roles.indexOf(role) !== -1) {
      return next();
    }
  });

  var error = new Error('You are not authorized.');
  error.status = 401;
  return next(error);

}


/**
 * EXPORTS.
 */
module.exports = authenticate;