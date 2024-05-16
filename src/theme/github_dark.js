exports.isDark = true;
exports.cssClass = "ace-github-dark";
exports.cssText = require("./github_dark-css");

    var dom = require("../lib/dom");
    dom.importCssString(exports.cssText, exports.cssClass, false);

