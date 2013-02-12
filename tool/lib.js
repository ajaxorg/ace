var plist = require("plist");
var util = require("util");
exports.parsePlist = function(themeXml, callback) {    
    var result = ""
    plist.parseString(themeXml, function(_, theme) {
        result = theme[0];
        callback && callback(theme[0]);
    });
    return result;
}

exports.formatJSON = function(object, initialIndent) {
    return util.inspect(object, false, 40).replace(/^/gm, initialIndent||"")
    
}


exports.fillTemplate = function(template, replacements) {
    return template.replace(/%(.+?)%/g, function(str, m) {
        return replacements[m] || "";
    });
}

exports.hyphenate = function(str) {
    return str.replace(/([A-Z])/g, "-$1").replace(/_/g, "-").toLowerCase();
}

exports.quoteString = function(str) {
    return '"' + str.replace(/\\/, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\\n") + '"';
}


exports.restoreJSONComments = function(objStr) {
    return objStr.replace(/^(\s*)comment: '(.*)'/gm, function(_, i, c) {
        return i + "//" +  c.replace(/\\n(\\t)*/g, "\n" + i + "//") + "\n" + i
    }).replace(/ \/\/ ERROR/g, '", // ERROR');
}

