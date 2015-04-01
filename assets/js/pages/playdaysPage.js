'use strict';


/**
 * MODULES.
 */
var Page = require('./page.js');


/**
 * FUNCTIONS.
 */
function PlaydaysPage(path, params) {

  Page.call(this, path, params);

  this.path = path;
  this.params = params;

}

PlaydaysPage.prototype = Object.create(Page.prototype);
PlaydaysPage.prototype.constructor = PlaydaysPage;

PlaydaysPage.prototype.render = function render(html, response, callback) {

  callback(null, this.container);

}


/**
 * EXPORTS.
 */
module.exports = PlaydaysPage;