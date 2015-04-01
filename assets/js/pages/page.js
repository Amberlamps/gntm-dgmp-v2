'use strict';


/**
 * MODULES.
 */
var forms = require('../components').forms;
var lists = require('../components').lists;


/**
 * FUNCTIONS.
 */
function Page(path, params) {

  this.path = path;
  this.params = params;

  this.container = $('.mainpage');

}

Page.prototype.init = function init(callback) {

  var self = this;

  $.ajax({
    type: 'get',
    url: this.path,
    success: onSuccess,
    error: onError
  });

  function onSuccess(html, success, response) {
    self.container.html(html);
    self.activatePage();
    self.render(html, response, callback);
  }

  function onError(err, error, message) {

    swal({
      title: 'Oops...',
      text: message,
      type: 'error'
    });

    if (Object.prototype.toString.call(self.error) === '[object Function]') {
      self.error(err, error, message);
    } else {
      callback(err);
    }

  }

};

Page.prototype.render = function render(html, response, callback) {
  callback(null, this.container);
};

Page.prototype._formCallback = function _formCallback() {
  console.log(arguments);
};

Page.prototype.activatePage = function activatePage() {
  forms.enable(this.container, this._formCallback.bind(this));
  lists.enable(this.container);
  if (this.activated && Object.prototype.toString.call(this.activated) === '[object Function]') {
    this.activated();
  }
};


/**
 * EXPORTS.
 */
module.exports = Page;