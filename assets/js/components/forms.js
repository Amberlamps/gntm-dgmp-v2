'use strict';


/**
 * MODULES.
 */
var config = require('../config.js');


/**
 * VARIABLES.
 */
var apiUrl = ['', config.client.api.path, config.client.api.version].join('/');


/**
 * FUNCTIONS.
 */
function enable(container, callback) {

  var options = {
    callback: callback || function() {}
  };

  container.find('form').on('submit', _onFormSubmit.bind(null, options));
  container.find('form .submit-substitute').click(_submitSubstituteForm);

}

function _submitSubstituteForm(e) {

  var target = e.currentTarget;
  var formName = target.getAttribute('data-form');
  var formular = null;

  if (!formName) {
    while (target.nodeName !== 'FORM' && target.nodeName !== 'BODY') {
      target = target.parentNode;
    }
    if (target.nodeName === 'FORM') {
      formular = target;
    }
  } else {
    formular = document.forms[formName];
  }

  if (formular) {
    if (!formular.submitButton) {
      var submit = document.createElement('input');
      submit.type = 'submit';
      submit.setAttribute('style', 'display:none');
      formular.appendChild(submit);
      formular.submitButton = submit;
    }
    formular.submitButton.click();
  }

}

function _onFormSubmit(options, e) {

  e.preventDefault();

  var form = e.currentTarget;

  options.url = form.getAttribute('data-action');
  options.type = form.getAttribute('data-method');
  options.form = form;

  var requestType = form.getAttribute('data-html');
  if (!requestType || requestType === 'false') {
    options.url = apiUrl + options.url;
  }

  _request(_buildData(form), options);

  return false;

}

function _buildData(form) {

  var data = {};

  for (var i = 0; i < form.length; i++) {
    var element = form[i];
    if (element.type === 'text' || element.type === 'password' || element.type === 'hidden' || (element.type === 'radio' && element.checked) || element.nodeName === 'TEXTAREA') {
      var parts = element.name.match(/^(\w+)\[(\d+)\]\[(\w+)\]/);
      if (parts) {
        var name = parts[1];
        var index = parts[2];
        var param = parts[3];
        if (!data.hasOwnProperty(name)) {
          data[name] = [];
        }
        if (!data[name].hasOwnProperty(index)) {
          data[name][index] = {};
        }
        data[name][index][param] = element.value;
      } else {
        data[element.name] = element.value;
      }
    }
  }

  return data;

}

function _request(data, options) {

  options = options || {};

  options.method = options.type || 'get';
  options.url = options.url || '';
  options.contentType = options.contentType || 'application/json';
  options.dataType = options.dataType || 'json';

  var request = {
    url: options.url,
    type: options.method,
    contentType: options.contentType + '; charset=UTF-8',
    dataType: options.dataType,
    success: onSuccess,
    error: onError
  };

  request.data = JSON.stringify(data);

  $.ajax(request);

  function onSuccess(data, status, response) {
    options.callback(null, data, status, response, options.form);
  }

  function onError(response, status, error) {

    var err = {
      response: response,
      status: status,
      error: error,
      message: response.responseJSON.message,
      form: options.form
    };
    options.callback(err);
  }

}


/**
 * EXPORTS.
 */
module.exports = {
  enable: enable
};