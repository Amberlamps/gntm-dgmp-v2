'use strict';


/**
 * VARIABLES.
 */
var eventLookup = {
  'member.new': {
    message: '<b>#{memberName}</b> ist jetzt Mitglied in <b>#{leagueName}</b>.',
    url: '/leagues/#{leagueId}/roaster'
  },
  'member.delete': {
    message: '<b>#{memberName}</b> ist kein Mitglied mehr von <b>#{leagueName}</b>.',
    url: '/leagues/#{leagueId}/roaster'
  },
  'post.new': {
    message: '<b>#{memberName}</b> hat einen neuen Artikel in <b>#{leagueName}</b> geschrieben.',
    url: '/leagues/#{leagueId}/index/#{postId}'
  },
  'playday.new': {
    message: '<b>#{memberName}</b> hat einen neuen Spieltag in <b>#{leagueName}</b> erstellt.',
    url: '/leagues/#{leagueId}/spieltage'
  },
  'league.new': {
    message: '<b>#{memberName}</b> hat die Liga <b>#{leagueName}</b> gegründet.',
    url: '/leagues/#{leagueId}'
  },
  'comment.new': {
    message: '<b>#{memberName}</b> hat zu <b>#{postTitle}</b> einen Kommentar geschrieben.',
    url: '/leagues/#{leagueId}/index/#{postId}'
  },
  'user.new': {
    message: '<b>#{userName}</b> hat sich gerade neu angemeldet.'
  }
};


/**
 * FUNCTIONS.
 */
function getEvent(key) {

  return eventLookup[key] || { message: '' };

}

/**
 * EXPORTS.
 */
module.exports = getEvent;