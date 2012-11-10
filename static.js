#!/usr/bin/env node

var http = require("http")
  , path = require("path")
  , mime = require("mime")
  , url = require("url")
  , fs = require("fs")
  , port = process.env.PORT || 8888
  , ip = process.env.IP || "0.0.0.0";

// compatibility with node 0.6
if (!fs.exists)
  fs.exists = path.exists;

http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);
  
  fs.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {        
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      var contentType = mime.lookup(filename) || "text/plain";
      response.writeHead(200, {"Content-Type": contentType});
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(port, ip);

console.log("http://localhost:" + port);
