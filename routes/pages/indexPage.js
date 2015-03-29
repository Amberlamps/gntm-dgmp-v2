'use strict';

/**
 * MODULES.
 */
var express = require('express');
var router = express.Router();
var Event = require('schemes').Event;


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
  // Wenn neue Artikel geschrieben wurden, in den Neuigkeiten direkt auf den Artikel linken und nicht auf die Front-Page der Liga.
  // Kommentar-Funktion zum Ein- und Ausklappen.
  // Unter Hauptpunkt "Regelwerk" erscheint Auflistung aller aktiven Regelwerke der jeweiligen Ligen.
  // Im Liga-Menüpunkt "Regelwerk" erscheint das aktuell aktive Regelwerk der Liga. Das ist der gleiche Link, wie wenn man im Hauptmenüpunkt "Regelwerk" auf die entsprechende Liga klickt.
  // Ist der User allerdings Admin der Liga, erscheint eine Übersicht mit drafts mit CRUD möglichkeiten.
  // Man kann ein Regelwerk nur dann löschen, wenn es noch in keinem Spieltag verwendet wurde oder es nicht aktiv ist.
  Event.find({ scope: 'all' }).sort({ _id: -1 }).limit(20).exec(renderEvents);

  function renderEvents(err, events) {

    if (err) {
      return next(err);
    }

    res.render('pages/index', {
      events: events
    });

  }

}

/**
 * EXPORTS.
 */
module.exports = router;