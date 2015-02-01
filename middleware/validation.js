/**
 * Middleware for validating requests.
 *
 * @author Amberlamps <alexander.behrens.84@gmail.com>
 */


/**
 * MODULES.
 */


/**
 * FUNCTIONS.
 */
function validation(schema) {

  return validate;

  function validate(req, res, next) {

    next();

  }

}


/**
 * EXPORTS.
 */
module.exports = validation;