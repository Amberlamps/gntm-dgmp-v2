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
var template = require('assets/js/components').template;
var eventKeys = require('assets/js/resources').eventKeys;


/**
 * FUNCTIONS.
 */
function exposeLocalsWrapper(app) {

  return function exposeLocals(req, res, next) {
    moment.locale('de');
    if (app.get('env') === 'development') {
      app.locals.pretty = true;
    }
    app.locals.pkg = pkg;
    app.locals.xhr = req.xhr;
    app.locals.user = req.session.user || {};
    app.locals.moment = moment;
    app.locals.template = template;
    app.locals.eventKeys = eventKeys;
    next();
  };

}


/**
 * EXPORTS.
 */
module.exports = exposeLocalsWrapper;