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

var allowSave = process.argv.indexOf("--allow-save") != -1;
if (allowSave)
    console.warn("writing files from browser is enabled");

http.createServer(function(req, res) {
    var uri = unescape(url.parse(req.url).pathname)
      , filename = path.join(process.cwd(), uri);

    if (req.method == "PUT") {
        if (!allowSave)
            return error(res, 404, "Saving not allowed pass --allow-save to enable");
        return save(req, res, filename);
    }

    fs.exists(filename, function(exists) {
        if (!exists)
            return error(res, 404, "404 Not Found\n" + filename);

        if (fs.statSync(filename).isDirectory()) {
            var files = fs.readdirSync(filename);
            res.writeHead(200, {"Content-Type": "text/html"});
            
            files.push(".", "..");
            var html = files.map(function(name) {
                var href = uri + "/" + name;
                href = href.replace(/[\/\\]+/g, "/").replace(/\/$/g, "");
                try {
                    var stat = fs.statSync(filename + "/" + name);
                    if (stat.isDirectory())
                        href += "/";
                    return "<a href='" + href + "'>" + name + "</a><br>";
                } catch(e) {}
            }).filter(Boolean);

            res._hasBody && res.write(html.join(""));
            res.end();
            return;
        }

        fs.readFile(filename, "binary", function(err, file) {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.write(err + "\n");
                res.end();
                return;
            }

            var contentType = mime.lookup(filename) || "text/plain";
            res.writeHead(200, { "Content-Type": contentType });
            res.write(file, "binary");
            res.end();
        });
    });
}).listen(port, ip);

function error(res, status, message, error) {
    console.error(error || message);
    res.writeHead(status, { "Content-Type": "text/plain" });
    res.write(message);
    res.end();
}

function save(req, res, filePath) {
    var data = "";
    req.on("data", function(chunk) {
        data += chunk;
    });
    req.on("error", function() {
        error(res, 404, "Could't save file");
    });
    req.on("end", function() {
        try {
            fs.writeFileSync(filePath, data);
        }
        catch (e) {
            return error(res, 404, "Could't save file", e);
        }
        res.statusCode = 200;
        res.end("OK");
        console.log("saved ", filePath);
    });
}

function getLocalIps() {
    var os = require("os");

    var interfaces = os.networkInterfaces ? os.networkInterfaces() : {};
    var addresses = [];
    for (var k in interfaces) {
        for (var k2 in interfaces[k]) {
            var address = interfaces[k][k2];
            if (address.family === "IPv4" && !address.internal) {
                addresses.push(address.address);
            }
        }
    }
    return addresses;
}

console.log("http://" + (ip == "0.0.0.0" ? getLocalIps()[0] : ip) + ":" + port);

