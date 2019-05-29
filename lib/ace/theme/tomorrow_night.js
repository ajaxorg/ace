exports.isDark = true;
exports.cssClass = "ace-tomorrow-night";
exports.cssText = require("./tomorrow_night.css.js");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
