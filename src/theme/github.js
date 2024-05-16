exports.isDark = false;
exports.cssClass = "ace-github";
exports.cssText = require("./github-css");

    var dom = require("../lib/dom");
    dom.importCssString(exports.cssText, exports.cssClass, false);
