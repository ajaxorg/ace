/*
 * used by r.js during build
 */

"use strict";
module.exports = function(source) { 
    if (this.fs && this.resourcePath)
        source = this.fs.readFileSync(this.resourcePath).toString("utf8");
    source = source.replace(/\/\*(?:[^*]|[*](?=[^\/]))+\*\//g, "")
        .replace(/^[ \t]+/gm, "");
    var json = JSON.stringify(source)
        .replace(/[\u2028\u2029]/g, function(x) { '\\u' + x.charCodeAt(0).toString(16); });

    return "module.exports = " + json;
};
