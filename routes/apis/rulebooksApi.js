(function () {

  'use strict';

  /**
   * MODULES.
   */
  var express = require('express');
  var router = express.Router();
  var Rulebook = require('schemes').Rulebook;


  /**
   * VARIABLES.
   */
  var defaultDrinkingRules = [{
    name: 'Name gesagt',
    description: 'Getrunken wird, wenn der Name eines Models genannt wird',
    target: 'manager',
    gulps: 1
  }, {
    name: 'Name geschrieben',
    description: 'Getrunken wird, wenn der Name eines Models irgendwo geschrieben steht.',
    target: 'manager',
    gulps: 2
  }, {
    name: 'Model weint',
    description: 'Getrunken wird, wenn ein Model weint.',
    target: 'manager',
    gulps: 5
  }, {
    name: 'Mädchen/Chicas gesagt',
    description: 'Getrunken wird, wenn "Mädchen" in irgendeiner Sprache genannt wird.',
    target: 'alle',
    gulps: 1
  }];
  var defaultDrinkingDistribution = [5, 4, 3, 2, 1];


  /**
   * ROUTES.
   */
  router.route('/:rulebookId?')
    .get(getRulebooks)
    .post(postRulebooks)
    .put(putRulebooks)
    .patch(patchRulebooks)
    .delete(deleteRulebooks);

  /**
   * FUNCTIONS.
   */
  function getRulebooks(req, res, next) {

    var leagueId = req.query.leagueId;

    var selector = {
      league: leagueId
    };

    Rulebook.findOne(selector, gotRulebook);

    function gotRulebook(err, rulebook) {

      if (err) {
        return next(err);
      }

      res.json({
        rulebook: rulebook
      });

    }

  }

  function postRulebooks(req, res, next) {

    var params = req.body;
 
    params.drinkingRules = params.drinkingRules || defaultDrinkingRules;
    params.drinkingDistribution = params.drinkingDistribution || defaultDrinkingDistribution;

    var rulebook = new Rulebook(params);

    rulebook.save(savedRulebook);

    function savedRulebook(err, rulebook) {

      if (err) {
        return next(err);
      }

      res.status(201).json({
        rulebook: rulebook
      });

    }

  }

  function putRulebooks(req, res, next) {
    res.json(1);
  }

  function patchRulebooks(req, res, next) {

    var rulebookId = req.params.rulebookId;

    var updates = req.body;

    var selector = {
      _id: rulebookId
    };

    var data = {
      $set: updates,
      $inc: {
        __v: 1
      }
    };

    Rulebook.update(selector, data, updatedRulebook);

    function updatedRulebook(err, updated) {

      if (err) {
        return next(err);
      }

      res.json({
        updated: updated
      });

    }

  }

  function deleteRulebooks(req, res, next) {

    var rulebookId = req.params.rulebookId;

    var selector = {
      _id: rulebookId
    };

    Rulebook.remove(selector, removedRulebook);

    function removedRulebook(err, deleted) {

      if (err) {
        return next(err);
      }

      res.json({
        deleted: deleted
      });

    }
  }

  /**
   * EXPORTS.
   */
  module.exports = router;


}) ();