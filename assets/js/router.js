'use strict';


/**
 * MODULES.
 */
var config = require('./config.js');


/**
 * PAGES.
 */
var IndexPage = require('./pages').IndexPage;
var LeaguesPage = require('./pages').LeaguesPage;
var LeaguePage = require('./pages').LeaguePage;
var LeaguesAddPage = require('./pages').LeaguesAddPage;
var LivePage = require('./pages').LivePage;
var LoginPage = require('./pages').LoginPage;
var LogoutPage = require('./pages').LogoutPage;
var ModelsPage = require('./pages').ModelsPage;
var Page = require('./pages').Page;
var RulebooksPage = require('./pages').RulebooksPage;


/**
 * VARIABLES.
 */
var routes = [];
var pushPage;
var loadPage;
var pages = {
  '/': IndexPage,
  '/leagues/add/': LeaguesAddPage,
  '/leagues/': LeaguesPage,
  '/leagues/:leagueId/:page?': LeaguePage,
  '/live/': LivePage,
  '/login/': LoginPage,
  '/logout/': LogoutPage,
  '/models/:modelId?': ModelsPage,
  '/rulebooks/:rulebookId?': RulebooksPage
};
var currentPath = location.pathname;
var initialLoad = true;


/**
 * INIT.
 */

// Initialize routes.
for (var key in pages) {

  var page = pages[key];

  var matching = preparePath(key);

  routes.push({
    route: new RegExp(matching.path),
    lookup: matching.lookup,
    page: page
  });

}

// Checking for push strategy.
if (history.pushState) {

  pushPage =  function pushPushState(path) {
    history.pushState(null, null, path);
  };
  loadPage = function loadPushState(e) {
    getPage(location.pathname);
  };

  // setTimeout hack because popstate also fires on page load.
  window.setTimeout(function() {
    $(window).on('popstate', loadPage);
  }, 1000);

} else {

  pushPage =  function pushHashtag(page) {
    location.hash = '!' + page;
  };
  loadPage = function loadHashtag(e) {
    getPage(location.hash.substr(2));
  };

  if (location.hash) {
    loadPage();
  }

  $(window).on('hashchange', loadPage);

}

// Enabling DOM elements.
enablePage($('body'));

// Activate Page
if (currentPath.charAt(currentPath.length-1) !== '/') {
  currentPath += '/';
}
getPage(currentPath);


/**
 * FUNCTIONS.
 */
function preparePath(path) {

  var paramsLookup = [];
  path = '^' + path + '$';

  path =  path.replace(/(:.*?)(\?|\$|\/)/g, function(match, parameter, delimiter) {
    paramsLookup.push(parameter.substr(1));
    return '(.*?)' + delimiter;
  });

  return {
    path: path,
    lookup: paramsLookup
  };

}

function getPage(path, updatePath) {

  if (path === currentPath && !initialLoad) {
    return;
  }

  console.log(path);

  for (var i = 0, _len = routes.length; i < _len; i++) {

    var route = routes[i];

    var matches = path.match(route.route);

    if (matches) {

      var params = {};
      route.lookup.forEach(function(param, index) {
        var value = matches[index+1];
        if (value) {
          if (value.charAt(value.length-1) === '/') {
            value = value.substr(0, value.length-1);
          }
          params[param] = value;
        }
      });

      NProgress.start();

      var page = new route.page(path, params);

      if (initialLoad) {
        page.activatePage();
        NProgress.done();
        initialLoad = false;
      } else {
        page.init(function(err, container) {

          NProgress.done();

          if (err) {
            return false;
          }

          currentPath = path;

          if (updatePath) {
            pushPage(path);
          }

          enablePage(container);

        });
      }

      break;

    }

  }

}

function enablePage(container) {

  container.find('a').click(linkClick);

}

function linkClick(e) {

  if (!this.href.match(/\.pdf$/)) {
    e.preventDefault();
  }

  var path = this.pathname;
  if (path.charAt(path.length-1) !== '/') {
    path += '/';
  }

  getPage(path, true);

}

/**
 * EXPORTS.
 */
module.exports = {
  getPage: getPage
};