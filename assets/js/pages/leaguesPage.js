'use strict';

/**
 * MODULES.
 */
var Page = require('./page.js');


/**
 * FUNCTIONS.
 */
function LeaguesPage(path, params) {

  Page.call(this, path, params);

  this.path = path;
  this.params = params;

}

LeaguesPage.prototype = Object.create(Page.prototype);
LeaguesPage.prototype.constructor = LeaguesPage;

LeaguesPage.prototype.render = function render(html, response, callback) {

  callback(null, this.container);

}


/**
 * EXPORTS.
 */
module.exports = LeaguesPage;