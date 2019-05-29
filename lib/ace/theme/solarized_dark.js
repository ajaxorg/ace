exports.isDark = true;
exports.cssClass = "ace-solarized-dark";
exports.cssText = require("./solarized_dark.css.js");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
