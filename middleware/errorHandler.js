'use strict';


/**
 * VARIABLES.
 */
var pageNotFound = errorHandler.bind(null, {
  message: 'Page not found',
  status: 404
});

/**
 * FUNCTIONS.
 */
function errorHandler(err, req, res, next) {

  var status = err.status || 500;

  console.log(err);

  var errorObject = {
    message: err.message,
    error: {
      status: status,
      stack: err.stack
    }
  };

  res.status(status);

  if (req.xhr) {
    res.json(errorObject)
  } else {
    res.render('pages/error', errorObject);
  }

}


/**
 * EXPORTS.
 */
module.exports.development = errorHandler;
module.exports.production = errorHandler;
module.exports.pageNotFound = pageNotFound;