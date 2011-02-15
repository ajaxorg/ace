#!/usr/bin/env node

var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs")
    port = process.env.C9_PORT || 8888;

function guessFileType(name) {
  var types = {
    '.html': 'text/html',
    '.xhtml': 'application/xhtml+xml',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
  };

  var ext = path.extname(name);

  return ext in types ? types[ext] : 'text/plain';
}

http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);
  
  path.exists(filename, function(exists) {
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

      response.writeHead(200, {"Content-Type": guessFileType(filename)});
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(port, "0.0.0.0");
