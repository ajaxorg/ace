/**
 * Simple node.js server, which generates the synax highlighted version of itself 
 * using the Ace modes and themes on the server and serving a static web page.
 */

// include ace search path and modules
require("../../support/paths");

// load jsdom, which is required by Ace
require("ace/test/mockdom");

var http = require("http");
var fs = require("fs");

// load the highlighter and the desired mode and theme
var highlighter = require("ace/ext/static_highlight");
var JavaScriptMode = require("ace/mode/javascript").Mode;
var theme = require("ace/theme/twilight");

var port = process.env.PORT || 2222;

http.createServer(function(req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});
    
    fs.readFile(__filename, "utf8", function(err, data) {
        var highlighted = highlighter.render(data, new JavaScriptMode(), theme);
        res.end('<html><body>\n\
<style type="text/css" media="screen">\n\
    :css:\n\
</style>\n\
:html:\n\
</body></html>'.replace(":css:", highlighted.css).replace(":html:", highlighted.html));
    });
}).listen(port);

console.log("Listening on port " + port);