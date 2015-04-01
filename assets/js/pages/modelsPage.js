'use strict';


/**
 * MODULES.
 */
var Page = require('./page.js');


/**
 * FUNCTIONS.
 */
function ModelsPage(path, params) {

  Page.call(this, path, params);

  this.path = path;
  this.params = params;

}

ModelsPage.prototype = Object.create(Page.prototype);
ModelsPage.prototype.constructor = ModelsPage;

ModelsPage.prototype.render = function render(html, response, callback) {

  this._activated();
  callback(null, this.container);

};

ModelsPage.prototype._activated = function _activated() {

};

ModelsPage.prototype.activated = function activated() {

  this._activated();

};




/**
 * EXPORTS.
 */
module.exports = ModelsPage;