var plist = require("plist");
var util = require("util");
var url = require("url");

var https = require("https");
var http = require("http");

exports.parsePlist = function(xmlOrJSON, callback) {
    var json;
    if (xmlOrJSON[0] == "<") {
        plist.parseString(xmlOrJSON, function(_, result) {
            json = result[0];
        });
    } else {
        xmlOrJSON = xmlOrJSON.replace(/^\s*\/\/.*/gm, "");
        json = JSON.parse(xmlOrJSON)
    }
    callback && callback(json);
    return json;
};

exports.formatJSON = function(object, initialIndent) {
    return util.inspect(object, false, 40).replace(/^/gm, initialIndent||"");
};


exports.fillTemplate = function(template, replacements) {
    return template.replace(/%(.+?)%/g, function(str, m) {
        return replacements[m] || "";
    });
};

exports.hyphenate = function(str) {
    return str.replace(/([A-Z])/g, "-$1").replace(/[_\s\-]+/g, "-").toLowerCase();
};

exports.camelCase = function(str) {
    return str.replace(/[\-_\s]+(.?)/g, function(x, y) {return y.toUpperCase()});
};

exports.snakeCase = function(str) {
    return str.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s\-]+/g, "_").toLowerCase();
};

exports.quoteString = function(str) {
    return '"' + str.replace(/\\/, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\\n") + '"';
};


exports.restoreJSONComments = function(objStr) {
    return objStr.replace(/^(\s*)comment: '(.*)'/gm, function(_, i, c) {
        return i + "//" +  c.replace(/\\n(\\t)*/g, "\n" + i + "//") + "\n" + i;
    }).replace(/ \/\/ ERROR/g, '", // ERROR');
};


exports.download = function(href, callback) {
	var options = url.parse(href);   
	var protocol = options.protocol === "https:" ? https : http;
	console.log("connecting to " + options.host + " " + options.path);
	var request = protocol.get(options, function(res) {
		var data = "";
		res.setEncoding("utf-8");

		res.on("data", function(chunk) {
			data += chunk;
		});

		res.on("end", function(){
			callback(data);
		});
	});
};


exports.AceRoot = __dirname + "/../";
exports.AceLib = __dirname + "/../lib/";

