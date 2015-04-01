'use strict';

/**
 * MODULES.
 */
var Page = require('./page.js');


/**
 * FUNCTIONS.
 */
function LogoutPage(path, params) {

  Page.call(this, path, params);

  this.path = path;
  this.params = params;

}

LogoutPage.prototype = Object.create(Page.prototype);
LogoutPage.prototype.constructor = LogoutPage;

LogoutPage.prototype.render = function render(html, response, callback) {

  location.href = '/';

};


/**
 * EXPORTS.
 */
module.exports = LogoutPage;