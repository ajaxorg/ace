var connect = require('connect');

/**
 * Connect middleware that serves the Ajax.org Code Editor (Ace).
 *
 * Example:
 *
 *     var connect = require('connect');
 *     var ace = require('ace-connect').connect('/js/ace');
 *     var server = connect.createServer(ace);
 *     server.listen(3000);
 *
 * This will serve ace.js under http://localhost:3000/js/ace/ace.js
 *
 * @param path the path under which the ace files will be mounted.
 */
exports.connect = function(path) {
  var aceFiles = connect.static(__dirname);

  return function(req, res, next) {
    if(req.url.indexOf(path) == 0) {
      req.url = req.url.slice(path.length);
      aceFiles(req, res, next);
    } else {
      next();
    }
  };
};