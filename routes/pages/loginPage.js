(function () {

  'use strict';

  /**
   * MODULES.
   */
  var express = require('express');
  var router = express.Router();
  var User = require('schemes').User;


  /**
   * ROUTES.
   */
  router.route('/')
    .get(getLoginPage)
    .post(postLoginPage);
    

  /**
   * FUNCTIONS.
   */
  function getLoginPage(req, res, next) {

    if (req.session.user) {
      if (req.xhr) {
        res.status(204).send();
      } else {
        res.redirect('/');
      }
    } else {
      res.render('pages/login');
    }

  }

  function postLoginPage(req, res, next) {

    var email = req.body.email;
    var password = req.body.password;

    var selector = {
      email: email
    };

    User.findOne(selector, foundUser);

    function foundUser(err, user) {

      if (err) {
        return next(err);
      }

      if (!user) {
        var err = new Error('Email wurde nicht gefunden!');
        err.status = 400;
        return next(err);
      }

      if (!user.isValidPassword(password)) {
        var err = new Error('Falsches Passwort!');
        err.status = 401;
        return next(err);
      }

      req.session.user = user;

      if (req.xhr) {
        res.json({ message: 'Erfolgreich eingeloggt' });
      } else {
        res.redirect('/');
      }

    }

  }

  /**
   * EXPORTS.
   */
  module.exports = router;


}) ();