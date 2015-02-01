(function () {

  'use strict';

  /**
   * MODULES.
   */
  var express = require('express');
  var router = express.Router();


  /**
   * ROUTES.
   */
  router.route('/')
    .get(getIndexPage);

  /**
   * FUNCTIONS.
   */
  function getIndexPage(req, res, next) {
    // Zwischen Wertung und Spieltag unterscheiden.
    // Wertungen können kopiert werden und automatisch Spieltage erzeugt werden.
    // "Spieltag erstellen" erscheint als Modal, damit man es sowohl über der Spielanimation als auch beim Kopieren der Wertung anzeigen kann.
    // Spielanimation nimmt komplette Fläche des Bildschirms ein.
    // Jedes Mädel hat eine Kachel.
    // Eine zusätzliche Kachel für Aktionen, wo jeder trinken muss.
    // Links fügt sie eine Übersicht mit Statistiken an. Aktuell die meisten Trinkschlücke, Jobs, Sonstige Schlücke.
    // Linke Navigation durch Mausführung oder anklicken eines "Vergrößern" Pfeils möglich.
    //res.send('GNTM DGMP wird rechtzeitig zum Start der neuen Saison zurück sein!');
    res.render('pages/index');
  }

  /**
   * EXPORTS.
   */
  module.exports = router;


}) ();