exports.isDark = true;
exports.cssClass = "ace-tomorrow-night-blue";
exports.cssText = require("./tomorrow_night_blue.css.js");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
