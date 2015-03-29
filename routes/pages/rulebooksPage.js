'use strict';

/**
 * MODULES.
 */
var express = require('express');
var router = express.Router();
var Rulebook = require('schemes').Rulebook;


/**
 * ROUTES.
 */
router.route('/')
  .get(getRulebooksPage);

/**
 * FUNCTIONS.
 */
function getRulebooksPage(req, res, next) {

  Rulebook.find({ active: true }).populate('league').exec(renderRulebooks);

  function renderRulebooks(err, rulebooks) {

    if (err) {
      return next(err);
    }

    rulebooks.sort(sortRulebooks);

    res.render('pages/rulebooks', {
      rulebooks: rulebooks
    });

  }

}

function sortRulebooks(a, b) {

  a = a.league.sortname;
  b = b.league.sortname;

  if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  } else {
    return 0;
  }

}

/**
 * EXPORTS.
 */
module.exports = router;