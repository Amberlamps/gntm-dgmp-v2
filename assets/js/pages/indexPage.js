'use strict';

/**
 * MODULES.
 */
var Page = require('./page.js');


/**
 * FUNCTIONS.
 */
function IndexPage(path, params) {

  Page.call(this, path, params);

  this.path = path;
  this.params = params;

}

IndexPage.prototype = Object.create(Page.prototype);
IndexPage.prototype.constructor = IndexPage;

IndexPage.prototype.render = function render(html, response, callback) {

  callback(null, this.container);

}

IndexPage.prototype._formCallback = function _formCallback(err, data, status, response) {

  if (err) {
    return swal({
      title: 'Error!',
      text: err.response.responseJSON.message,
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
module.exports = IndexPage;