/**
 * Simple node.js server, which generates the synax highlighted version of itself 
 * using the Ace modes and themes on the server and serving a static web page.
 */
// $'
// include ace search path and modules
require("amd-loader");

// load jsdom, which is required by Ace
require("../../lib/ace/test/mockdom");

var http = require("http");
var fs = require("fs");

// load the highlighter and the desired mode and theme
var highlighter = require("../../lib/ace/ext/static_highlight");
var JavaScriptMode = require("../../lib/ace/mode/javascript").Mode;
var theme = require("../../lib/ace/theme/twilight");

var port = process.env.PORT || 2222;

http.createServer(function(req, res) {
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    fs.readFile(__filename, "utf8", function(err, data) {
        var highlighted = highlighter.render(data, new JavaScriptMode(), theme);
        res.end(
            '<html><body>\n' +
                '<style type="text/css" media="screen">\n' +
                    highlighted.css +
                '</style>\n' + 
                highlighted.html +            
            '</body></html>'
        );
    });
}).listen(port);

console.log("Listening on port " + port);