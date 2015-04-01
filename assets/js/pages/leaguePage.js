'use strict';


/**
 * MODULES.
 */
var Page = require('./page.js');
var config = require('../config.js');


/**
 * VARIABLES.
 */
var roasterOverlay;
var roasterMenu;
var roasterDrops;
var roasterMap = {};
var apiUrl = ['', config.client.api.path, config.client.api.version, 'roasters'].join('/');
var leagueId;
var isAdmin = false;


/**
 * FUNCTIONS.
 */
function LeaguePage(path, params) {

  Page.call(this, path, params);

  this.path = path;
  this.params = params;

}

function getOffset(el) {
  var offset = el.getBoundingClientRect();
  return { top : offset.top + scrollY(), left : offset.left + scrollX() }
}

function isDropable(dropable, dragable) {
  var offset1 = getOffset( dragable ), width1 = dragable.offsetWidth, height1 = dragable.offsetHeight,
    offset2 = getOffset( dropable ), width2 = dropable.offsetWidth, height2 = dropable.offsetHeight;

  return !(offset2.left > offset1.left + width1 - width1/2 || 
      offset2.left + width2 < offset1.left + width1/2 || 
      offset2.top > offset1.top + height1 - height1/2 ||
      offset2.top + height2 < offset1.top + height1/2 );
}

function detectCollision(girl, callback) {

  $.each(roasterDrops, function(index, dropable) {
    if (isDropable(dropable, girl.element)) {
      callback(dropable);
    } else {
      $(dropable).css({
        opacity: 0.7
      });
    }
  });

}

function scrollX() {
  return window.pageXOffset || window.document.documentElement.scrollLeft;
}

function scrollY() {
  return window.pageYOffset || window.document.documentElement.scrollTop;
}

function reorderModels(container) {
  var models = container.find('.roaster-girl');
  models.sort(function(a, b) {
    a = a.getAttribute('data-displayname');
    b = b.getAttribute('data-displayname');
    if (a > b) {
      return -1;
    } else if (a < b) {
      return 1;
    } else {
      return 0;
    }
  });
  $.each(models, function(index, model) {
    container.prepend($(model).parent());
  });
}

function updateRoaster(from, to, model) {

  var options = {};

  var data = {
    model: model,
    league: leagueId
  };

  options.method = 'patch';
  options.url = apiUrl + '/' + from + '/' + to;
  options.contentType = 'application/json';
  options.dataType = 'json';

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
  }

  function onError(response, status, error) {
  }

}

LeaguePage.prototype = Object.create(Page.prototype);
LeaguePage.prototype.constructor = LeaguePage;

LeaguePage.prototype.render = function render(html, response, callback) {

  callback(null, this.container);

};

LeaguePage.prototype._activated = function _activated() {

  leagueId = $('.page-league').attr('data-league');
  isAdmin = $('.page-league').attr('data-isAdmin') === 'true';

  if (!isAdmin) {
    return false;
  }

  // Toggle management navigation
  $('.page-league-navigation-item-management').click(function() {
    $('.page-navigation-management').toggle(0);
  });

  roasterDrops = this.container.find('.roaster-overlay-category');
  $.each(this.container.find('.roaster'), function(index, roaster) {
    roaster = $(roaster);
    roasterMap[roaster.attr('data-member')] = roaster.find('.roaster-container');
  });

  roasterOverlay = this.container.find('.roaster-overlay');
  roasterMenu = this.container.find('.roaster-overlay-menu');

  this.container.find('.roaster-girl').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
    var target = $(this);
    target.removeClass('animate');
  });

  $.each(this.container.find('.roaster-girl'), function activateGirl(index, girl) {

    var draggies = new Draggabilly(girl, function() {
      console.log(arguments);
    });

    draggies.on('dragStart', onDragStart);
    draggies.on('dragMove', onDragMove);
    draggies.on('dragEnd', onDragEnd);

  });

  function onDragStart(girl) {

    $(girl.element).css({
      zIndex: 4
    });

    roasterOverlay.css({
      opacity: 0.7
    });

    roasterMenu.css({
      marginTop: 0-roasterMenu.height()
    });

    var memberId = $(girl.element).parent().parent().parent().attr('data-member');

    $.each(roasterDrops, function(index, drop) {
      drop = $(drop);
      drop.css({
        display: (drop.attr('data-member') === memberId) ? 'none' : 'inline-block'
      });
    });
    
  }

  function onDragMove(girl) {

    detectCollision(girl, function(dropable) {

      $(dropable).css({
        opacity: 1
      });

    });
    
  }

  function onDragEnd(girl) {

    $(girl.element).css({
      zIndex: 1,
      top: 0,
      left: 0
    }).addClass('animate');

    roasterOverlay.css({
      opacity: 0
    });

    roasterMenu.css({
      marginTop: 0
    });

    detectCollision(girl, function(dropable) {

      dropable = $(dropable);
      var memberId = dropable.attr('data-member');
      if (roasterMap.hasOwnProperty(memberId)) {
        var container = roasterMap[memberId];
        var from = $(girl.element).parent().parent().parent().attr('data-member');
        var to = memberId;
        container.prepend($(girl.element).parent());
        reorderModels(container);
        updateRoaster(from, to, $(girl.element).attr('data-modelId'));
      }

    });
    
  }

};

LeaguePage.prototype.activated = function activated() {
  this._activated();
};

LeaguePage.prototype.roasterGirlStart = function roasterGirlStart(e) {

  var target = e.currentTarget;
  target.clientX = e.clientX;
  target.clientY = e.clientY;
  target.activated = true;

  roasterOverlay.css({
    opacity: 1,
    display: 'block'
  });

  $(target).css({
    zIndex: 3
  });

};

LeaguePage.prototype.roasterGirlMove = function roasterGirlMove(e) {

  var target = e.currentTarget;

  if (target.activated) {

    var x = e.clientX - target.clientX;
    var y = e.clientY - target.clientY;

    $(target).css({
      transform: 'translate3d(' + x + 'px, ' + y + 'px, 0px)'
    });

  }

};

LeaguePage.prototype.roasterGirlStop = function roasterGirlStop(e) {

  var target = e.currentTarget;
  target.activated = false;

  target = $(target);

  target.addClass('animate');
  target.css({
    transform: 'translate3d(0px, 0px, 0px)',
    zIndex: 0
  });

  roasterOverlay.css({
    opacity: 0
  });

};

LeaguePage.prototype._formCallback = function _formCallback(err, data, status, response, form) {

  if (err) {
    return swal({
      title: 'Error!',
      text: err.error,
      type: 'error'
    });
  }

  if (form.name === 'enterLeague') {

    swal({
      title: 'Bewerbung gesendet!',
      text: 'Dein Antrag muss noch bestätigt werden.',
      type: 'success'
    });

    $(form).remove();

  } else if (form.name === 'confirmMember') {

    swal({
      title: 'Bestätigung erfolgreich!',
      text: 'Deine Liga hat ein neues Mitglied.',
      type: 'success',
      timer: 1500
    });

    $(form).remove();

  } else if (form.name === 'denyMember') {

    swal({
      title: 'Bewerbung gelöscht!',
      text: 'Die Bewerbung des Spielers wurde erfolgreich gelöscht.',
      type: 'success',
      timer: 1500
    });

    $(form).parent().parent().remove();

  } else if (form.name === 'deleteMember') {

    swal({
      title: 'Mitglied gelöscht!',
      text: 'Das Mitglied wurde erfolgreich gelöscht.',
      type: 'success',
      timer: 1500
    });

    $(form).parent().parent().remove();

  } else if (form.name === 'cancelSubscription') {

    swal({
      title: 'Antrag zurückgezogen!',
      text: 'Dein Antrag wurde erfolgreich zurückgezogen.',
      type: 'success',
      timer: 1500
    });

    $(form).parent().parent().remove();

  } else if (form.name === 'cancelMembership') {

    swal({
      title: 'Ausgetreten!',
      text: 'Du bist erfolgreich aus der Liga ausgetreten.',
      type: 'success',
      timer: 1500
    });

    $(form).parent().parent().remove();

  } else if (form.name === 'promoteMember') {

    swal({
      title: 'Admin hinzugefügt!',
      text: 'Das Mitglied hat jetzt Adminrechte.',
      type: 'success',
      timer: 1500
    });

    $(form).remove();

  } else if (form.name === 'degradeMember') {

    swal({
      title: 'Adminrechte entzogen!',
      text: 'Das Mitglied ist von nun an kein Admin mehr.',
      type: 'success',
      timer: 1500
    });

    $(form).remove();

  } else if (form.name === 'createPost') {

    swal({
      title: 'Beitrag erstellt!',
      text: 'Dein neuer Beitrag ist erfolgreich erstellt worden.',
      type: 'success',
      timer: 1500
    });

    require('../router').getPage('/leagues/' + data.post.league + '/', true);

  } else if (form.name === 'editPost') {

    swal({
      title: 'Beitrag bearbeitet!',
      text: 'Der Beitrag ist erfolgreich bearbeitet worden.',
      type: 'success',
      timer: 1500
    });

    require('../router').getPage('/leagues/' + data.post.league + '/posts', true);

  } else if (form.name === 'deletePost') {

    swal({
      title: 'Beitrag gelöscht!',
      text: 'Der Beitrag wurde erfolgreich gelöscht.',
      type: 'success',
      timer: 1500
    });

    $(form).parent().parent().remove();

  } else if (form.name === 'createPlayday') {

    swal({
      title: 'Spieltag erstellt!',
      text: 'Ein neuer Spieltag ist erfolgreich erstellt worden.',
      type: 'success',
      timer: 1500
    });

    require('../router').getPage('/leagues/' + data.playday.league + '/playdays', true);

  } else if (form.name === 'editPlayday') {

    swal({
      title: 'Spieltag bearbeitet!',
      text: 'Der Spieltag ist erfolgreich bearbeitet worden.',
      type: 'success',
      timer: 1500
    });

    require('../router').getPage('/leagues/' + data.playday.league + '/playdays', true);

  } else if (form.name === 'deletePlayday') {

    swal({
      title: 'Spieltag gelöscht!',
      text: 'Der Spieltag wurde erfolgreich gelöscht.',
      type: 'success',
      timer: 1500
    });

    $(form).parent().parent().remove();

  } else if (form.name === 'postComment') {

    swal({
      title: 'Kommentar erstellt!',
      text: 'Dein Kommentar ist erfolgreich erstellt worden.',
      type: 'success'
    });

    require('../router').getPage('/leagues/' + data.comment.league + '/index/' + data.comment.post, true);

  }

}

/**
 * EXPORTS.
 */
module.exports = LeaguePage;