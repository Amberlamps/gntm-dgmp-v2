'use strict';


/**
 * MODULES.
 */
var Page = require('./page.js');
var config = require('../config.js');


/**
 * VARIABLES.
 */
var apiUrl = ['', config.client.api.path, config.client.api.version].join('/');


/**
 * VARIABLES.
 */
var gridLookup = [
  [1, 1],
  [1, 2],
  [2, 2],
  [2, 2],
  [2, 3],
  [2, 3],
  [3, 3],
  [3, 3],
  [3, 3],
  [3, 4],
  [3, 4],
  [3, 4],
  [4, 4],
  [4, 4],
  [4, 4],
  [4, 4],
  [4, 5],
  [4, 5],
  [4, 5],
  [4, 5],
  [5, 5],
  [5, 5],
  [5, 5],
  [5, 5],
  [5, 5],
  [5, 6],
  [5, 6],
  [5, 6],
  [5, 6],
  [5, 6],
  [6, 6],
  [6, 6],
  [6, 6],
  [6, 6],
  [6, 6]
];


/**
 * FUNCTIONS.
 */
function LivePage(path, params) {

  Page.call(this, path, params);

  this.path = path;
  this.params = params;

  this.container = $('.livepage');

}

LivePage.prototype = Object.create(Page.prototype);
LivePage.prototype.constructor = LivePage;

LivePage.prototype.render = function render(html, response, callback) {

  callback(null, this.container);

};

LivePage.prototype.activated = function activated() {

  this.closeup = this.container.find('.live-closeup');

  this.initSlider();
  this.initDimensions();

  this.openCloseup();
  this.initCloseup();
  this.closeCloseup();

  this.container.find('.live-girl').click(this.girlClick.bind(this));

  //$(window).on('resize', self.setDimensions.bind(this));

};

LivePage.prototype.girlClick = function girlClick(e) {

  this.openCloseup();

  this.closeupGirl = $(e.currentTarget);

  this.closeupName.text(this.closeupGirl.find('.live-girl-name').text());
  this.closeupDrinks.text(this.closeupGirl.find('.live-girl-stats-drinks').text());
  this.closeupJobs.text(this.closeupGirl.find('.live-girl-stats-jobs').text());
  this.closeupPicture.attr('style', this.closeupGirl.attr('style'));

};

LivePage.prototype.openCloseup = function open() {

  this.closeup.css({
    display: 'block'
  });

};

LivePage.prototype.closeCloseup = function close() {

  this.closeup.css({
    display: 'none'
  });

};

LivePage.prototype.actionClick = function actionClick(factor, e) {

  var panel = $(e.currentTarget);
  var rule = panel.parent();

  var value = +rule.find('.live-action-value').text() * factor;
  var request = {
    url: apiUrl + '/playdays/'
  };

  if (rule.attr('class').match(/drink/)) {
    var newValue = +this.closeupDrinks.text() + value;
    if (newValue < 0) {
      newValue = 0;
    }
    this.closeupDrinks.text(newValue);
    this.closeupGirl.find('.live-girl-stats-drinks').text(newValue);
  } else if (rule.attr('class').match(/job/)) {
    var newValue = +this.closeupJobs.text() + 1;
    if (newValue < 0) {
      newValue = 0;
    }
    this.closeupJobs.text(newValue);
    this.closeupGirl.find('.live-girl-stats-jobs').text(newValue);
  }

  window.setTimeout(this.closeCloseup.bind(this), 500);

};

LivePage.prototype.initCloseup = function initCloseup() {

  var actionGirl = this.closeup.find('.live-girl-container');
  var width = this.closeup.find('.live-closeup-girl').width() * 0.5;

  actionGirl.css({
    height: width,
    width: width,
    position: 'absolute',
    top: '50%',
    right: 60,
    marginTop: 0-width/2
  });

  var actions = this.container.find('.live-closeup-actions-container');

  if (actions.height() > this.closeup.height()) {
    this.container.find('.live-closeup-actions').css({
      'overflow-y': 'scroll'
    });
  } else {
    actions.css({
      position: 'absolute',
      top: '50%',
      left: 0,
      marginTop: 0 - actions.height()/2,
      width: '100%'
    });
  }

  this.closeup.find('.live-closeup-close').click(this.closeCloseup.bind(this));
  this.closeupPicture = this.closeup.find('.live-girl'); 
  this.closeupName = this.closeup.find('.live-girl-name');
  this.closeupDrinks = this.closeup.find('.live-girl-stats-drinks');
  this.closeupJobs = this.closeup.find('.live-girl-stats-jobs');

  this.closeup.find('.live-action-plus').click(this.actionClick.bind(this, 1));
  this.closeup.find('.live-action-minus').click(this.actionClick.bind(this, -1));

};

LivePage.prototype.initSlider = function initSlider() {

  var self = this;

  self.statisticsOpen = false;

  self.statistics = self.container.find('.live-statistics');
  self.statistics.css({
    marginLeft: $(window).width()
  });

  self.slider = self.statistics.find('.live-slider');
  self.slider.click(function() {
    if (self.statisticsOpen) {
      self.statistics.animate({
        marginLeft: $(window).width()
      }, 250);
    } else {
      self.statistics.animate({
        marginLeft: 0
      }, 250);
    }
    self.statisticsOpen = !self.statisticsOpen;
  });

};

LivePage.prototype.initDimensions = function initDimensions() {

  var girls = this.container.find('.live-girl-container');

  var grid = gridLookup[girls.length-1];

  var dimensions = {
    width: 100 / grid[1] + '%',
    height: 100 / grid[0] + '%'
  };

  girls.css(dimensions);

};


/**
 * EXPORTS.
 */
module.exports = LivePage;