'use strict';


/**
 * FUNCTIONS.
 */
function template(html, variables) {

  return html.replace(/#{(.*?)}/gi, function(match, key) {
    return (typeof variables[key] === 'undefined') ? '' : variables[key];
  });

};

/**
 * EXPORTS.
 */
module.exports = template;