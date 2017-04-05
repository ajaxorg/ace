var plist = require("plist");
var util = require("util");
var url = require("url");
var cson = require("cson");

var https = require("https");
var http = require("http");

exports.parsePlist = function(xmlOrJSON, callback) {
    var json;
    if (xmlOrJSON[0] == "<") {
        plist.parseString(xmlOrJSON, function(_, result) {
            json = result[0];
        });
    } else {
        try {
            xmlOrJSON = xmlOrJSON.replace(
                /("(?:\\.|[^"])*")|(?:,\s*)+([\]\}])|(\w+)\s*:|([\]\}]\s*[\[\{])|(\/\/.*|\/\*(?:[^\*]|\*(?=[^\/]))*?\*\/)/g,
                function(_, str, extraComma, noQuote, missingComma, comment) {
                    if (comment)
                        return "";
                    if (missingComma)
                        return missingComma[0] + "," + missingComma.slice(1);
                    return str || extraComma || '"' + noQuote + '":';
            });
            json = JSON.parse(xmlOrJSON);
        } catch(e) {
            json = cson.parse(xmlOrJSON);
        }
    }
    callback && callback(json);
    return json;
};


exports.formatJSON = function(object, initialIndent) {
    return JSON.stringify(object, null, 4).replace(/^/gm, initialIndent||"");
};

exports.formatJS = function(object, initialIndent) {
    return formatJS(object, 4, initialIndent);
};

function formatJS(object, indent, initialIndent) {
    if (typeof  indent == "number")
        indent = Array(indent + 1).join(" ");
    
    function $format(buffer, totalIndent, state, o) {
        if (typeof o != "object" || !o) {
            if (typeof o == "string")
                buffer.push(JSON.stringify(o));
            else
                buffer.push("" + o);
        }
        else if (Array.isArray(o)) {
            buffer.push("[")
            
            var len = totalIndent.length
            var oneLine = true;
            for (var i = 0; i < o.length; i++) {
                if (typeof o[i] == "string") {
                    len += o[i].length + 2
                } else if (!o[i]) {
                    len += (o[i] + "").length
                } else {
                    oneLine = false;
                    break;
                }
                len += 2;
                if (len > 60) {
                    oneLine = false;
                    break;
                }
            }
            
            for (var i = 0; i < o.length; i++) {
                if (o[i] && typeof o[i] == "object") {
                    $format(buffer, totalIndent, state, o[i]);
                    if (i < o.length - 1)
                        buffer.push(", ");
                } else {
                    if (oneLine)
                        i && buffer.push(" ");
                    else
                        buffer.push("\n", totalIndent + indent)
                    $format(buffer, totalIndent + indent, state, o[i]);
                    if (i < o.length - 1)
                        buffer.push(",");
                }
                
            }
            if (!oneLine && buffer[buffer.length - 1] != "}")
                buffer.push("\n" + totalIndent)
            buffer.push("]")
        }
        else {
            var keys = Object.keys(o);
            buffer.push("{", "\n");
            for (var i = 0; i < keys.length; i++) {
                buffer.push(totalIndent + indent);
                if (/^\w+$/.test(keys[i]))
                    buffer.push(keys[i]);
                else
                    buffer.push(JSON.stringify(keys[i]));
                buffer.push(": ")

                if (keys[i] == "regex" && typeof o[keys[i]] == "string") {
                    try {
                        var re = new RegExp(o[keys[i]]);
                        buffer.push("/" + re.source.replace(/\\.|\//g, function(f) {
                            return f.length == 1 ? "\\" + f : f;
                        }) + "/");
                    } catch(e) {
                        $format(buffer, totalIndent + indent, state, o[keys[i]]);
                    }
                } else {
                    $format(buffer, totalIndent + indent, state, o[keys[i]]);
                }
                
                if (i < keys.length - 1)
                    buffer.push(",", "\n");
            }
            buffer.push("\n", totalIndent, "}");
        }
    }
    var buffer = [];
    $format(buffer, initialIndent || "", {}, object);
    return buffer.join("");
}

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

