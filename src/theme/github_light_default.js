exports.isDark = false;
exports.cssClass = "ace-github-light-default";
exports.cssText = require("./github_light_default-css");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
