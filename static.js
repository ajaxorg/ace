#!/usr/bin/env node

var http = require("http")
  , path = require("path")
  , url = require("url")
  , fs = require("fs")
  , port = process.env.PORT || 8888
  , ip = process.env.IP || "0.0.0.0";

function lookupMime(filename) {
    var ext = /[^\/\\.]*$/.exec(filename)[0];
    return {
        js: "application/javascript",
        ico: "image/x-icon",
        css: "text/css",
        svg: "image/svg+xml",
        png: "image/png",
        jpg: "image/jpg",
        html: "text/html",
        jpeg: "image/jpeg"
    }[ext];
}
  
// compatibility with node 0.6
if (!fs.exists)
    fs.exists = path.exists;

var allowSave = process.argv.indexOf("--allow-save") != -1;
if (allowSave)
    console.warn("writing files from browser is enabled");

http.createServer(function(req, res) {
    var uri = unescape(url.parse(req.url).pathname);
    var filename = path.join(process.cwd(), uri);

    if (req.method == "OPTIONS") {
        writeHead(res, 200);
        return res.end();
    }
    
    if (req.method == "PUT") {
        if (!allowSave)
            return error(res, 404, "Saving not allowed pass --allow-save to enable");
        return save(req, res, filename);
    }

    fs.exists(filename, function(exists) {
        if (!exists)
            return error(res, 404, "404 Not Found\n" + filename);

        if (fs.statSync(filename).isDirectory())
            return serveDirectory(filename, uri, req, res);

        fs.readFile(filename, "binary", function(err, file) {
            if (err) {
                writeHead(res, 500, "text/plain");
                res.write(err + "\n");
                res.end();
                return;
            }

            var contentType = lookupMime(filename);
            writeHead(res, 200, contentType);
            res.write(file, "binary");
            res.end();
        });
    });
}).listen(port, ip);

function writeHead(res, code, contentType) {
    var headers = {
        "Access-Control-Allow-Origin": "file://",
        "Access-Control-Allow-Methods": "PUT, GET, OPTIONS, HEAD"
    };
    headers["Content-Type"] = contentType || "text/plain";
    res.writeHead(code, headers);
}

function serveDirectory(filename, uri, req, res) {
    var files = fs.readdirSync(filename);
    writeHead(res, 200, "text/html");
    
    files.push("..", ".");
    var html = files.map(function(name) {
        try {
            var stat = fs.statSync(filename + "/" + name);
        } catch(e) {}
        var index = name == "." ? 2 : name == ".." ? 3 : stat.isDirectory() ? 1 : 0;
        return { name: name, index: index, size: stat.size };
    }).filter(Boolean).sort(function(a, b) {
        if (a.index == b.index)
            return a.name.localeCompare(b.name);
        return b.index - a.index;
    }).map(function(stat) {
        var name = stat.name;
        if (stat.index) name += "/";
        var size = ""
        if (!stat.size) size = ""
        else if (stat.size < 1024) size = stat.size + "b";
        else if (stat.size < 1024 * 1024) size = (stat.size / 1024).toFixed(2) + "kb";
        else size = (stat.size / 1024 / 1024).toFixed(2) + "mb";
        return "<tr>"
            + "<td>&nbsp;&nbsp;" + size + "&nbsp;&nbsp;</td>"
            + "<td><a href='" + name + "'>" + name + "</a></td>"
        + "</tr>";
    }).join("");
    html = "<table>" + html + "</table>"

    res._hasBody && res.write(html);
    res.end();
}

function error(res, status, message, error) {
    console.error(error || message);
    writeHead(res, status, "text/plain");
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
        writeHead(res, 200);
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

