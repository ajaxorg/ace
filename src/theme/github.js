exports.isDark = false;
exports.cssClass = "ace-github";
exports.cssText = require("./github.css.js");

    var dom = require("../lib/dom");
    dom.importCssString(exports.cssText, exports.cssClass);
