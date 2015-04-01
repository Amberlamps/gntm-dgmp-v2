'use strict';


/**
 * MODULES.
 */
var Page = require('./page.js');


/**
 * FUNCTIONS.
 */
function RulebooksPage(path, params) {

  Page.call(this, path, params);

  this.path = path;
  this.params = params;

}

RulebooksPage.prototype = Object.create(Page.prototype);
RulebooksPage.prototype.constructor = RulebooksPage;

RulebooksPage.prototype.render = function render(html, response, callback) {

  callback(null, this.container);

}


/**
 * EXPORTS.
 */
module.exports = RulebooksPage;