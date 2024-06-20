exports.isDark = false;
exports.cssClass = "ace-github-classic";
exports.cssText = require("./github_classic-css");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
