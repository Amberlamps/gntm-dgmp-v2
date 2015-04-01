'use strict';

/**
 * MODULES.
 */
var Page = require('./page.js');


/**
 * FUNCTIONS.
 */
function LeaguesAddPage(path, params) {

  Page.call(this, path, params);

  this.path = path;
  this.params = params;

}

LeaguesAddPage.prototype = Object.create(Page.prototype);
LeaguesAddPage.prototype.constructor = LeaguesAddPage;

LeaguesAddPage.prototype.render = function render(html, response, callback) {

  callback(null, this.container);

};

LeaguesAddPage.prototype._formCallback = function _formCallback(err, data, status, response, form) {

  if (err) {
    return swal({
      title: 'Error!',
      text: err.error,
      type: 'error'
    });
  }

  require('../router').getPage('/leagues/' + data.league._id + '/', true);

}

/**
 * EXPORTS.
 */
module.exports = LeaguesAddPage;