if ( typeof WebSocket === "undefined" )
    global.WebSocket			= require('isomorphic-ws');

module.exports				= require('./browser.js');
