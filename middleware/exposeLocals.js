/**
 * Middleware to expose variables to view.
 *
 * @author Amberlamps <alexander.behrens.84@gmail.com>
 */


/**
 * MODULES.
 */
var pkg = require('package.json');
var moment = require('moment');


/**
 * FUNCTIONS.
 */
function exposeLocalsWrapper(app) {

  return function exposeLocals(req, res, next) {
    if (app.get('env') === 'development') {
      app.locals.pretty = true;
    }
    app.locals.pkg = pkg;
    app.locals.xhr = req.xhr;
    app.locals.user = req.session.user || {};
    app.locals.moment = moment;
    next();
  };

}


/**
 * EXPORTS.
 */
module.exports = exposeLocalsWrapper;