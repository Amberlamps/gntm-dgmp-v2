'use strict';

/**
 * MODULES.
 */
var Page = require('./page.js');


/**
 * FUNCTIONS.
 */
function LoginPage(path, params) {

  Page.call(this, path, params);

  this.path = path;
  this.params = params;

}

LoginPage.prototype = Object.create(Page.prototype);
LoginPage.prototype.constructor = LoginPage;

LoginPage.prototype.render = function render(html, response, callback) {

  if (response.status === 204) {
    return location.href = '/';
  }
  
  callback(null, this.container);

};

LoginPage.prototype._formCallback = function _formCallback(err, data, status, response) {

  if (err) {
    return swal({
      title: 'Error!',
      text: err.message,
      type: 'error'
    });
  }

  swal({
    title: 'Juchu!',
    text: data.message,
    type: 'success'
  });

  window.setTimeout(function() {
    location.href = '/';
  }, 1000);

}

/**
 * EXPORTS.
 */
module.exports = LoginPage;